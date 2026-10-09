import { forwardRef, type HTMLAttributes } from 'react';
import { RangeContextProvider, type RangeContextId } from '../../clinical';
import { cx } from '../../internal/cx';
import { SpecTable, V, specText } from '../../internal/specialty';
import { Alert } from '../Alert/Alert';
import { Badge, type BadgeTone } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import type { IconName } from '../Icon/Icon';
import { ProgressBar } from '../ProgressBar/ProgressBar';

/** Hold rules: hold when ANC or platelets are below, or creatinine above. */
export interface RegimenHoldRules {
  /** ANC ×10⁹/L */
  anc?: number;
  /** Platelets ×10⁹/L */
  plt?: number;
  /** Creatinine mg/dL */
  cr?: number;
}

/** One drug of the regimen: by BSA (mg/m²) or a flat dose (mg). */
export interface RegimenDrug {
  name: string;
  /** Route ('IV', 'CIV 46 h') */
  route: string;
  /** Days of the cycle ('D1', 'D1-2') */
  days: string;
  /** Dose in mg/m² */
  mgm2?: number;
  /** Flat dose in mg; wins over mgm2 */
  flat?: number;
}

/** The regimen. */
export interface OncologyRegimenDef {
  /** Regimen name ('mFOLFOX6') */
  name?: string;
  /** Intent and diagnosis */
  intent?: string;
  /** Days per cycle */
  cycleDays?: number;
  /** Planned number of cycles */
  cycles?: number;
  /** Largest BSA used for dosing, m²; default none */
  bsaCap?: number;
  /** Hold rules; default {anc: 1.5, plt: 100} */
  hold?: RegimenHoldRules;
  drugs?: ReadonlyArray<RegimenDrug>;
}

/** Patient measurements for dosing. */
export interface OncologyPatient {
  heightCm?: number;
  weightKg?: number;
  /** Measured or stated BSA in m²; default Mosteller from height and weight */
  bsa?: number;
  /** Weight change since cycle 1, in % */
  weightChange?: number;
}

/** Status of a cycle. */
export type CycleStatus = 'given' | 'current' | 'planned' | 'delayed' | 'held';

/** Pre-cycle labs. */
export interface CycleLabs {
  anc?: number | null;
  plt?: number | null;
  hgb?: number | null;
  cr?: number | null;
}

/** One cycle. */
export interface RegimenCycle {
  /** Cycle number */
  n: number;
  date: string;
  status: CycleStatus;
  /** Dose reduction in % */
  reduction?: number;
  labs?: CycleLabs;
  labsDate?: string;
}

/** A lifetime cumulative dose. */
export interface CumulativeDose {
  drug: string;
  /** Given so far, mg/m² */
  given: number;
  /** Lifetime limit, mg/m² */
  limit: number;
  note?: string;
}

export interface OncologyRegimenProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** {name, intent, cycleDays, cycles, bsaCap?, hold, drugs}; required */
  regimen: OncologyRegimenDef;
  /** {heightCm, weightKg, bsa?, weightChange?}; required */
  patient: OncologyPatient;
  /** Cycles; default [] */
  cycles?: ReadonlyArray<RegimenCycle>;
  /** Lifetime doses; default [] */
  cumulative?: ReadonlyArray<CumulativeDose>;
  /** Hides Hold Cycle and Release to Pharmacy; default false */
  readOnly?: boolean;
  /** Hold Cycle action; default none */
  onHoldCycle?: () => void;
  /** Release to Pharmacy action (disabled while hold criteria are met); default none */
  onRelease?: () => void;
  /** Which shared reference range flags use; the lab range on a result still wins; default the global context, else 'outpatient' */
  rangeContext?: RangeContextId;
}

/** Mosteller BSA, rounded to 0.01 m²: sqrt(height cm × weight kg / 3600). */
export function bsaMosteller(heightCm: number, weightKg: number): number {
  return Math.round(Math.sqrt((heightCm * weightKg) / 3600) * 100) / 100;
}

/** Why a cycle must be held under the regimen's rules; empty when it can go ahead. */
export function holdReasons(labs: CycleLabs | null | undefined, hold: RegimenHoldRules = { anc: 1.5, plt: 100 }): string[] {
  if (!labs) return [];
  return [
    labs.anc != null && hold.anc != null && labs.anc < hold.anc ? 'ANC below ' + specText('anc', hold.anc) : null,
    labs.plt != null && hold.plt != null && labs.plt < hold.plt ? 'Platelets below ' + specText('plt', hold.plt) : null,
    hold.cr != null && labs.cr != null && labs.cr > hold.cr ? 'Creatinine above ' + specText('cr', hold.cr) : null,
  ].filter((x): x is string => !!x);
}

const CST: Record<CycleStatus, { tone: BadgeTone; icon?: IconName; label: string }> = {
  given: { tone: 'success', icon: 'check', label: 'Given' },
  current: { tone: 'info', icon: 'clock', label: 'Due today' },
  planned: { tone: 'outline', label: 'Planned' },
  delayed: { tone: 'warning', icon: 'clock', label: 'Delayed' },
  held: { tone: 'danger', icon: 'x', label: 'Held' },
};

const EMPTY_CYCLES: ReadonlyArray<RegimenCycle> = [];
const EMPTY_CUM: ReadonlyArray<CumulativeDose> = [];

/**
 * OncologyRegimen tracks a chemotherapy regimen cycle by cycle, with BSA-based doses, dose reductions, pre-cycle labs
 * against hold rules and lifetime cumulative doses.
 */
export const OncologyRegimen = forwardRef<HTMLElement, OncologyRegimenProps>(function OncologyRegimen(
  { regimen, patient, cycles = EMPTY_CYCLES, cumulative = EMPTY_CUM, readOnly = false, onHoldCycle, onRelease, rangeContext, className, ...rest },
  ref
) {
  const rg = regimen || {};
  const pt = patient || {};
  const bsa = pt.bsa || bsaMosteller(pt.heightCm as number, pt.weightKg as number);
  const cap = rg.bsaCap;
  const used = cap && bsa > cap ? cap : bsa;
  const cur = cycles.find((c) => c.status === 'current');
  const reasons = cur ? holdReasons(cur.labs, rg.hold || { anc: 1.5, plt: 100 }) : [];
  const red = cur && cur.reduction ? cur.reduction : 0;
  const sub = [
    rg.intent,
    rg.cycleDays ? 'every ' + rg.cycleDays + ' days' : null,
    rg.cycles ? cycles.filter((c) => c.status === 'given').length + ' of ' + rg.cycles + ' cycles given' : null,
  ]
    .filter(Boolean)
    .join(' . ');
  return (
    <RangeContextProvider value={rangeContext}>
      <Card
        ref={ref}
        className={cx('co-onc', className)}
        title={rg.name || 'Regimen'}
        subtitle={sub}
        actions={
          readOnly ? null : (
            <>
              <Button size="sm" onClick={onHoldCycle}>
                Hold Cycle
              </Button>
              <Button size="sm" variant="primary" disabled={reasons.length > 0} onClick={onRelease}>
                Release to Pharmacy
              </Button>
            </>
          )
        }
        {...rest}
      >
        {reasons.length && cur ? (
          <Alert tone="error" title={'Hold criteria met for cycle ' + cur.n}>
            {reasons.join('; ') + '. Release is blocked until a provider overrides or labs recover.'}
          </Alert>
        ) : null}
        <div role="list" aria-label="Cycles" className="co-onc-cycles">
          {cycles.map((c) => {
            const s = CST[c.status] || CST.planned;
            return (
              <div key={c.n} role="listitem" className={cx('co-onc-cycle', c.status === 'current' && 'is-current')}>
                <div className="co-kl">{'C' + c.n}</div>
                <div className="co-onc-date">{c.date}</div>
                <Badge tone={s.tone} icon={s.icon} size="sm">
                  {s.label}
                </Badge>
                {c.reduction ? (
                  <div className="co-onc-red">
                    <V k="pct" v={-c.reduction} noFlag /> dose
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
        <div className="co-row co-gap-8 co-onc-meta">
          <span>
            Height <V k="len" v={pt.heightCm} />
          </span>
          <span>
            Weight <V k="mwt" v={pt.weightKg} />
          </span>
          <span>
            BSA <V k="bsa" v={bsa} /> (Mosteller)
          </span>
          {cap && bsa > cap ? (
            <Badge tone="warning" size="sm">
              {'Capped at ' + specText('bsa', cap)}
            </Badge>
          ) : null}
          {pt.weightChange ? (
            <Badge tone={Math.abs(pt.weightChange) >= 10 ? 'warning' : 'outline'} size="sm">
              {'Weight change since cycle 1: ' + specText('pct', pt.weightChange, { sign: true })}
            </Badge>
          ) : null}
        </div>
        <SpecTable
          caption={'Doses for ' + (cur ? 'cycle ' + cur.n : 'this cycle')}
          cols={['Drug', 'Route', 'Days', 'Dose', 'Calculated', 'Reduction', 'Final dose']}
          num={[3, 4, 5, 6]}
          rows={(rg.drugs || []).map((d) => {
            const calc = d.flat != null ? d.flat : (d.mgm2 as number) * used;
            const fin = calc * (1 - red / 100);
            return [
              <b key="n">{d.name}</b>,
              d.route,
              d.days,
              d.flat != null ? <V key="d" k="mg" v={d.flat} /> : <V key="d" k="mgm2" v={d.mgm2} />,
              <V key="c" k="mg" v={calc} />,
              red ? <V key="r" k="pct" v={-red} /> : 'None',
              <V key="f" k="mg" v={fin} />,
            ];
          })}
        />
        {cur && cur.labs ? (
          <div className="co-row co-gap-8 co-onc-labs">
            <span className="co-kl">{'Pre-cycle labs ' + (cur.labsDate || '')}</span>
            <span>
              ANC <V k="anc" v={cur.labs.anc} />
            </span>
            <span>
              Platelets <V k="plt" v={cur.labs.plt} />
            </span>
            <span>
              Hgb <V k="hgb" v={cur.labs.hgb} />
            </span>
            <span>
              Creatinine <V k="cr" v={cur.labs.cr} />
            </span>
          </div>
        ) : null}
        {cumulative.map((c) => {
          const pct = Math.round((c.given / c.limit) * 100);
          return (
            <div key={c.drug} className="co-onc-cum">
              <ProgressBar
                label={'Lifetime ' + c.drug}
                value={c.given}
                max={c.limit}
                thresholds={[80, 100]}
                valueText={specText('mgm2', c.given) + ' of ' + specText('mgm2', c.limit) + ' (' + pct + '%)'}
                helper={c.note}
              />
            </div>
          );
        })}
        <div className="co-help">
          Doses use the BSA shown; recalculate when weight changes by 10% or more. Hold rules here come from the regimen and
          need a provider to confirm or override.
        </div>
      </Card>
    </RangeContextProvider>
  );
});
