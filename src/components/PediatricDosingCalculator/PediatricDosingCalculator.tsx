import { forwardRef, type HTMLAttributes } from 'react';
import { RangeContextProvider, type RangeContextId } from '../../clinical';
import { cx } from '../../internal/cx';
import { useControllableState } from '../../internal/hooks';
import { V, specText } from '../../internal/specialty';
import { Alert } from '../Alert/Alert';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { Select } from '../Select/Select';
import { TextField } from '../TextField/TextField';

/** One medication the calculator can dose. */
export interface PediatricDrug {
  /** Drug name ('Ibuprofen') */
  name: string;
  /** Form and strength ('100 mg/5 mL suspension') */
  form: string;
  /** Dose in mg per kg per dose */
  mgkg: number;
  /** Doses per day; default 1 */
  perDay?: number;
  /** Frequency text ('every 6 hours as needed') */
  freq?: string;
  /** Maximum single dose in mg; default none */
  maxDose?: number | null;
  /** Maximum daily dose in mg; default none */
  maxDaily?: number | null;
  /** Concentration in mg/mL, for the volume; default none (no volume) */
  conc?: number | null;
  /** Note under the result */
  note?: string;
}

/** Inputs of calcPedsDose. */
export interface PedsDoseInput {
  /** Weight in kg (a number or the text typed in the field) */
  weightKg: number | string | null | undefined;
  /** mg per kg per dose */
  mgkg: number | null | undefined;
  /** Maximum single dose in mg */
  maxDose?: number | null;
  /** Maximum daily dose in mg */
  maxDaily?: number | null;
  /** Doses per day; default 1 */
  perDay?: number | null;
  /** Concentration in mg/mL */
  conc?: number | null;
}

/** Result of calcPedsDose: an error, or the dose. All amounts are rounded to 0.1. */
export type PedsDoseResult =
  | {
      error: string;
      /** Which input is wrong: 'weight' or 'drug' */
      field: 'weight' | 'drug';
    }
  | {
      error?: undefined;
      /** Weight x mg/kg before any cap, mg */
      raw: number;
      /** Dose to give, mg */
      dose: number;
      /** Which cap changed the dose: 'single' maximum, 'daily' maximum, or null */
      capped: 'single' | 'daily' | null;
      /** dose x doses per day, mg */
      daily: number;
      /** dose / concentration, mL; null without a concentration */
      volume: number | null;
      perDay: number;
    };

/** Rounds to 0.1 the way the source does (Math.round of tenths). */
function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/**
 * Weight-based dose: weight x mg/kg, capped at the maximum single dose, then reduced so doses per day stay within the
 * maximum daily dose, then rounded to 0.1 mg; volume = dose / concentration rounded to 0.1 mL.
 * Weight must be 0.5 to 150 kg.
 */
export function calcPedsDose(o: PedsDoseInput): PedsDoseResult {
  const w = typeof o.weightKg === 'string' && o.weightKg.trim() === '' ? NaN : Number(o.weightKg);
  if (!(w >= 0.5) || w > 150) return { error: 'Enter a weight between 0.5 and 150 kg.', field: 'weight' };
  const mgkg = o.mgkg;
  if (typeof mgkg !== 'number' || !isFinite(mgkg) || mgkg <= 0) return { error: 'This medication has no mg/kg dose.', field: 'drug' };
  const raw = w * mgkg;
  let dose = raw;
  let capped: 'single' | 'daily' | null = null;
  if (o.maxDose != null && dose > o.maxDose) {
    dose = o.maxDose;
    capped = 'single';
  }
  const perDay = o.perDay || 1;
  if (o.maxDaily != null && dose * perDay > o.maxDaily) {
    dose = o.maxDaily / perDay;
    capped = 'daily';
  }
  dose = round1(dose);
  return { raw: round1(raw), dose, capped, daily: round1(dose * perDay), volume: o.conc ? round1(dose / o.conc) : null, perDay };
}

export interface PediatricDosingCalculatorProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Medications to choose from; required */
  drugs: ReadonlyArray<PediatricDrug>;
  /** Weight in kg typed in the field (controlled, text); default uncontrolled */
  weight?: string;
  /** First weight in kg (uncontrolled); default none */
  defaultWeight?: number;
  /** Called with the weight text as typed; default none */
  onWeightChange?: (weight: string) => void;
  /** Selected medication index (controlled); default uncontrolled */
  drug?: number;
  /** First medication index (uncontrolled); default 0 */
  defaultDrug?: number;
  /** Called with the medication index; default none */
  onDrugChange?: (index: number) => void;
  /** When the weight was taken; default none (helper asks for today's weight) */
  weightDate?: string;
  /** How old the weight is ("45 days"): shows a warning; default none */
  weightStale?: string;
  /** Card title; default 'Pediatric dose calculator' */
  title?: string;
  /** Line under the title; default none */
  subtitle?: string;
  /** Hides Use in Order and Request Double Check; default false */
  readOnly?: boolean;
  /** Use in Order action, with the result and the medication; default none */
  onUseInOrder?: (result: Exclude<PedsDoseResult, { error: string }>, drug: PediatricDrug) => void;
  /** Request Double Check action; default none */
  onRequestDoubleCheck?: () => void;
  /** Which shared reference range flags use; the lab range on a result still wins; default the global context, else 'outpatient' */
  rangeContext?: RangeContextId;
}

/**
 * PediatricDosingCalculator works out a weight-based dose in mg/kg, caps it at the maximum single and daily dose,
 * converts it to mL, and shows the working so a second person can check it.
 */
export const PediatricDosingCalculator = forwardRef<HTMLElement, PediatricDosingCalculatorProps>(function PediatricDosingCalculator(
  {
    drugs,
    weight,
    defaultWeight,
    onWeightChange,
    drug,
    defaultDrug = 0,
    onDrugChange,
    weightDate,
    weightStale,
    title = 'Pediatric dose calculator',
    subtitle,
    readOnly = false,
    onUseInOrder,
    onRequestDoubleCheck,
    rangeContext,
    className,
    ...rest
  },
  ref
) {
  const [w, setW] = useControllableState<string>(weight, defaultWeight != null ? String(defaultWeight) : '', onWeightChange);
  const [di, setDi] = useControllableState<number>(drug, defaultDrug, onDrugChange);
  const list = drugs || [];
  const dr: Partial<PediatricDrug> = list[di] || {};
  const r = calcPedsDose({ weightKg: w, mgkg: dr.mgkg, maxDose: dr.maxDose, maxDaily: dr.maxDaily, perDay: dr.perDay, conc: dr.conc });
  const ok = r.error === undefined ? r : null;
  return (
    <RangeContextProvider value={rangeContext}>
      <Card ref={ref} className={cx('co-peds', className)} title={title} subtitle={subtitle} {...rest}>
        <div className="co-sp-grid co-sp-grid-200">
          <TextField
            label="Weight"
            value={w}
            suffix="kg"
            inputMode="decimal"
            required
            onChange={(v) => setW(v)}
            helper={weightDate ? 'Last weighed ' + weightDate : 'Use a weight from today'}
            error={r.error !== undefined && r.field === 'weight' ? r.error : undefined}
          />
          <Select
            label="Medication"
            value={String(di)}
            onChange={(e) => setDi(+e.target.value)}
            options={list.map((d, i) => ({ value: String(i), label: d.name + ' ' + d.form }))}
            error={r.error !== undefined && r.field === 'drug' && w.trim() !== '' ? r.error : undefined}
          />
        </div>
        {weightStale ? (
          <Alert tone="warning" title={'Weight is ' + weightStale + ' old'}>
            Weigh the child again before dosing.
          </Alert>
        ) : null}
        {ok ? (
          <div className="co-sp-box co-peds-res" aria-live="polite">
            <div className="co-kl">Working</div>
            <div className="co-peds-work">
              <V k="mwt" v={w} />
              {' × '}
              <V k="mgkg" v={dr.mgkg} />
              {' = '}
              <V k="mg" v={ok.raw} />
              {' per dose'}
            </div>
            {ok.capped ? (
              <Alert
                tone="warning"
                title={ok.capped === 'single' ? 'Capped at the maximum single dose' : 'Capped by the maximum daily dose'}
              >
                {ok.capped === 'single'
                  ? 'The weight-based dose is more than the ' + specText('mg', dr.maxDose) + ' maximum, so the maximum is used.'
                  : 'Doses per day would pass ' + specText('mg', dr.maxDaily) + ' per day, so each dose is reduced.'}
              </Alert>
            ) : null}
            <div className="co-sp-grid co-sp-grid-150">
              <div>
                <div className="co-kl">Dose</div>
                <div className="co-sp-big">
                  <V k="mg" v={ok.dose} />
                </div>
              </div>
              {dr.conc ? (
                <div>
                  <div className="co-kl">
                    Volume at <V k="conc" v={dr.conc} />
                  </div>
                  <div className="co-sp-big">
                    <V k="ml" v={ok.volume} />
                  </div>
                </div>
              ) : null}
              <div>
                <div className="co-kl">Frequency</div>
                <div>{dr.freq}</div>
              </div>
              <div>
                <div className="co-kl">Daily total</div>
                <div>
                  <V k="mg" v={ok.daily} />
                  {dr.maxDaily ? (
                    <span className="co-mi-s">
                      Max <V k="mg" v={dr.maxDaily} /> per day
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            {dr.note ? <div className="co-help">{dr.note}</div> : null}
          </div>
        ) : null}
        <div className="co-help">
          Doses rounded to 0.1 mg and 0.1 mL and shown without trailing zeros. This is a calculator, not an order check: a
          second clinician verifies high-alert medications before giving them.
        </div>
        {readOnly ? null : (
          <div className="co-row co-gap-8 co-peds-actions">
            <Button variant="primary" disabled={!ok} onClick={() => ok && onUseInOrder?.(ok, dr as PediatricDrug)}>
              Use in Order
            </Button>
            <Button onClick={onRequestDoubleCheck}>Request Double Check</Button>
          </div>
        )}
      </Card>
    </RangeContextProvider>
  );
});
