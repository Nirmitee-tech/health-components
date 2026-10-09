import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { gestational, RangeContextProvider, useRangeContext, type RangeContextId } from '../../clinical';
import { cx } from '../../internal/cx';
import { Muted, SpecTable, V, specFmt } from '../../internal/specialty';
import { Alert } from '../Alert/Alert';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';

/** Urine dipstick result. */
export type UrineDipstick = 'neg' | 'trace' | '1+' | '2+' | '3+' | '4+';

/** Pregnancy summary shown above the visits. */
export interface PrenatalHeader {
  /** Estimated due date */
  edd?: string;
  /** How the EDD was set ('8w ultrasound') */
  eddBy?: string;
  /** Gravida / para ('G2 P1001') */
  gp?: string;
  /** Blood type and antibody screen */
  blood?: string;
  /** Rubella status */
  rubella?: string;
  /** GBS status */
  gbs?: string;
  /** Pre-pregnancy BMI */
  bmi?: number;
  /** Risk badges */
  risks?: ReadonlyArray<string>;
}

/** One prenatal visit. */
export interface PrenatalVisit {
  date: string;
  /** Gestational age [weeks, days] */
  ga: readonly [number, number?];
  /** Maternal weight in kg */
  wt?: number | null;
  /** Systolic BP in mmHg */
  sbp?: number | null;
  /** Diastolic BP in mmHg */
  dbp?: number | null;
  /** Urine protein */
  protein?: UrineDipstick | null;
  /** Urine glucose */
  glucose?: UrineDipstick | null;
  /** Fundal height in cm */
  fh?: number | null;
  /** Fetal heart rate in bpm */
  fhr?: number | null;
  /** Fetal movement */
  fm?: string;
  /** Presentation */
  pres?: string;
  /** Edema; default 'None' */
  edema?: string;
  /** Clinician */
  by?: string;
}

export interface PrenatalFlowsheetProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** {edd, eddBy, gp, blood, rubella, gbs, bmi, risks}; default {} */
  header?: PrenatalHeader;
  /** Visits, oldest first; default [] */
  visits?: ReadonlyArray<PrenatalVisit>;
  /** Card title; default 'Prenatal flowsheet' */
  title?: string;
  /** Line under the title; default none */
  subtitle?: string;
  /** Hides Add Visit; default false */
  readOnly?: boolean;
  /** Add Visit action; default none */
  onAddVisit?: () => void;
  /** Which shared reference range flags use; the lab range on a result still wins; default 'pregnancy' when no global context is set */
  rangeContext?: RangeContextId;
}

const URINE: ReadonlyArray<string> = ['neg', 'trace', '1+', '2+', '3+', '4+'];

function Urine({ v }: { v?: string | null }) {
  if (!v) return <Muted>Not done</Muted>;
  const i = URINE.indexOf(v);
  const bad = i >= 3;
  const warn = i >= 2;
  return warn ? (
    <Badge tone={bad ? 'danger' : 'warning'} size="sm">
      {v}
    </Badge>
  ) : (
    <span>{v === 'neg' ? 'Negative' : v === 'trace' ? 'Trace' : v}</span>
  );
}

function GA({ w, d }: { w: number; d?: number }) {
  return (
    <span className="co-sp-num co-ga">
      <b aria-hidden="true">{gestational({ weeks: w, days: d || 0 })}</b>
      <span className="co-sr">{w + ' weeks ' + (d || 0) + ' days'}</span>
    </span>
  );
}

const EMPTY_HEADER: PrenatalHeader = {};
const EMPTY_VISITS: ReadonlyArray<PrenatalVisit> = [];

/** True when the latest visit's BP is in the severe range (160/110 or more). */
export function prenatalSevereBP(v: Pick<PrenatalVisit, 'sbp' | 'dbp'> | undefined): boolean {
  return !!v && ((v.sbp ?? 0) >= 160 || (v.dbp ?? 0) >= 110);
}

/**
 * PrenatalFlowsheet tracks every prenatal visit in one table, gestational age, weight, blood pressure, urine, fundal
 * height and fetal heart rate, with flags for hypertension, size and dates mismatch and abnormal heart rate.
 */
export const PrenatalFlowsheet = forwardRef<HTMLElement, PrenatalFlowsheetProps>(function PrenatalFlowsheet(
  {
    header = EMPTY_HEADER,
    visits = EMPTY_VISITS,
    title = 'Prenatal flowsheet',
    subtitle,
    readOnly = false,
    onAddVisit,
    rangeContext,
    className,
    ...rest
  },
  ref
) {
  const pctx = useRangeContext('pregnancy', rangeContext);
  const hd = header || {};
  const last: Partial<PrenatalVisit> = visits[visits.length - 1] || {};
  const sev = prenatalSevereBP(last);
  const ht = !sev && ((last.sbp ?? 0) >= 140 || (last.dbp ?? 0) >= 90) && !!last.ga && last.ga[0] >= 20;
  const facts: Array<[string, ReactNode]> = [
    ['EDD', hd.edd ? hd.edd + (hd.eddBy ? ' (' + hd.eddBy + ')' : '') : null],
    ['G / P', hd.gp],
    ['Blood type', hd.blood],
    ['Rubella', hd.rubella],
    ['GBS', hd.gbs],
    ['Pre-pregnancy BMI', <V key="bmi" k="bmi" v={hd.bmi} />],
  ];
  return (
    <RangeContextProvider value={rangeContext}>
      <Card
        ref={ref}
        className={cx('co-prenatal', className)}
        title={title}
        subtitle={subtitle}
        actions={
          readOnly ? null : (
            <Button size="sm" variant="primary" iconLeft="plus" onClick={onAddVisit}>
              Add Visit
            </Button>
          )
        }
        {...rest}
      >
        <div className="co-sp-grid co-sp-grid-130 co-sp-mb">
          {facts.map(([k, v]) => (
            <div key={k}>
              <div className="co-kl">{k}</div>
              <div className="co-sp-num">{v || 'Not recorded'}</div>
            </div>
          ))}
        </div>
        {hd.risks && hd.risks.length ? (
          <div className="co-row co-gap-6 co-prenatal-risks">
            {hd.risks.map((r) => (
              <Badge key={r} tone="warning" icon="alert">
                {r}
              </Badge>
            ))}
          </div>
        ) : null}
        {sev ? (
          <Alert tone="error" title={'Severe-range blood pressure ' + last.sbp + '/' + last.dbp + ' mmHg'}>
            Repeat in 15 minutes. If it stays at or above 160/110, start treatment within 30 to 60 minutes and assess for
            preeclampsia with severe features.
          </Alert>
        ) : null}
        {ht ? (
          <Alert tone="warning" title="Blood pressure 140/90 or higher after 20 weeks">
            Repeat in 4 hours. Check urine protein and labs for preeclampsia.
          </Alert>
        ) : null}
        <SpecTable
          caption="Prenatal visits"
          cols={['Date', 'GA', 'Weight', 'BP', 'Urine protein', 'Urine glucose', 'Fundal height', 'FHR', 'Movement', 'Presentation', 'Edema', 'By']}
          num={[2, 6, 7]}
          rows={visits.map((r) => {
            const wk = r.ga ? r.ga[0] : undefined;
            const fhOff = r.fh != null && wk != null && wk >= 20 && Math.abs(r.fh - wk) > 2;
            /* Registry pregnancy context: SBP > 159, DBP > 109, FHR < 100 or > 180 are critical. */
            const crit = (
              [
                ['sbp', r.sbp],
                ['dbp', r.dbp],
                ['fhr', r.fhr],
              ] as const
            ).some(([k, v]) => {
              const fl = specFmt(k, v, { context: pctx }).flag;
              return fl === 'HH' || fl === 'LL';
            });
            return {
              crit,
              cells: [
                r.date,
                r.ga ? <GA key="ga" w={r.ga[0]} d={r.ga[1]} /> : '',
                <V key="wt" k="mwt" v={r.wt} />,
                <span key="bp" className="co-prenatal-bp">
                  <V dctx="pregnancy" k="sbp" v={r.sbp} noUnit />/<V dctx="pregnancy" k="dbp" v={r.dbp} />
                </span>,
                <Urine key="p" v={r.protein} />,
                <Urine key="g" v={r.glucose} />,
                r.fh == null ? (
                  <Muted key="fh">{wk != null && wk < 20 ? 'Not yet' : 'Not recorded'}</Muted>
                ) : (
                  <span key="fh" className="co-prenatal-fh">
                    <V k="fh" v={r.fh} />
                    {fhOff ? (
                      <Badge tone="warning" size="sm" title="Fundal height differs from weeks by more than 2 cm">
                        Size ≠ dates
                      </Badge>
                    ) : null}
                  </span>
                ),
                r.fhr == null ? <Muted key="fhr">Doppler not yet</Muted> : <V key="fhr" dctx="pregnancy" k="fhr" v={r.fhr} />,
                r.fm || '',
                r.pres || '',
                r.edema || 'None',
                r.by || '',
              ],
            };
          })}
        />
        <div className="co-help">
          GA shown as weeks and days by the EDD above. Fundal height in cm should be within 2 of the weeks from 20 to 36
          weeks. FHR normal 110 to 160 bpm. BP flags at 140/90 and severe range at 160/110.
        </div>
      </Card>
    </RangeContextProvider>
  );
});
