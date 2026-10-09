import { forwardRef, type HTMLAttributes } from 'react';
import { RangeContextProvider, type RangeContextId } from '../../clinical';
import { cx } from '../../internal/cx';
import { SpecHeading, SpecTable, V } from '../../internal/specialty';
import { Badge, type BadgeTone } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { ProgressBar } from '../ProgressBar/ProgressBar';

/** Visits authorized by the payer. */
export interface PTAuthorization {
  /** Visits used (signed notes); default 0 */
  used?: number;
  /** Visits authorized; default 0 */
  authorized?: number;
  /** Payer name */
  payer?: string;
  /** Date the authorization ends */
  expires?: string;
}

/** A functional outcome score. */
export interface PTScore {
  /** Measure name ('LEFS') */
  name: string;
  /** Range and direction ('0 to 80, higher is better') */
  range?: string;
  /** Measure key: 'pts' | 'pct' | 'nprs' | 'deg'...; default 'pts' */
  k?: string;
  baseline: number;
  current: number;
  /** Minimal clinically important difference */
  mcid: number;
  /** Higher is better; default false */
  higherBetter?: boolean;
}

/** Status of a goal. */
export type PTGoalStatus = 'met' | 'progressing' | 'not met' | 'new';

/** A short or long term goal. */
export interface PTGoal {
  /** 'Short' | 'Long' */
  term: string;
  text: string;
  /** Measure key of the values ('deg', 'm', 'nprs', 'pts') */
  k: string;
  baseline?: number | null;
  current?: number | null;
  target?: number | null;
  /** default 'new' */
  status?: PTGoalStatus;
}

export interface PTPlanOfCareProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Diagnosis with code; default 'Not recorded' */
  diagnosis?: string;
  /** Certification period; default 'Not recorded' */
  cert?: string;
  /** Visit frequency; default 'Not recorded' */
  frequency?: string;
  /** Referring provider; default 'Not recorded' */
  referring?: string;
  /** {used, authorized, payer, expires}; required */
  auth: PTAuthorization;
  /** Visits since the last progress note; default 0 */
  visitsSinceProgressNote?: number;
  /** Forces the Progress note due badge; default false (due at 10 visits) */
  progressNoteDue?: boolean;
  /** Functional outcome scores; default [] */
  scores?: ReadonlyArray<PTScore>;
  /** Goals; default [] */
  goals?: ReadonlyArray<PTGoal>;
  /** Card title; default 'Physical therapy plan of care' */
  title?: string;
  /** Line under the title; default none */
  subtitle?: string;
  /** Hides Progress Note and Send for Certification; default false */
  readOnly?: boolean;
  /** Progress Note action; default none */
  onProgressNote?: () => void;
  /** Send for Certification action; default none */
  onSendForCertification?: () => void;
  /** Which shared reference range flags use; the lab range on a result still wins; default the global context, else 'outpatient' */
  rangeContext?: RangeContextId;
}

const GST: Record<PTGoalStatus, { tone: BadgeTone; label: string }> = {
  met: { tone: 'success', label: 'Met' },
  progressing: { tone: 'info', label: 'Progressing' },
  'not met': { tone: 'danger', label: 'Not met' },
  new: { tone: 'neutral', label: 'New' },
};

/** How a score changed: 'beyond' MCID, 'under' MCID but better, or 'none' (no improvement). */
export function ptScoreChange(s: Pick<PTScore, 'baseline' | 'current' | 'mcid' | 'higherBetter'>): {
  change: number;
  improvement: number;
  result: 'beyond' | 'under' | 'none';
} {
  const change = s.current - s.baseline;
  const improvement = s.higherBetter ? change : -change;
  return { change, improvement, result: improvement >= s.mcid ? 'beyond' : improvement > 0 ? 'under' : 'none' };
}

const EMPTY_SCORES: ReadonlyArray<PTScore> = [];
const EMPTY_GOALS: ReadonlyArray<PTGoal> = [];

/**
 * PTPlanOfCare shows a therapy plan of care: diagnosis and certification, visits used against the authorization,
 * functional outcome scores against their minimal important change, and short and long term goals.
 */
export const PTPlanOfCare = forwardRef<HTMLElement, PTPlanOfCareProps>(function PTPlanOfCare(
  {
    diagnosis,
    cert,
    frequency,
    referring,
    auth,
    visitsSinceProgressNote = 0,
    progressNoteDue = false,
    scores = EMPTY_SCORES,
    goals = EMPTY_GOALS,
    title = 'Physical therapy plan of care',
    subtitle,
    readOnly = false,
    onProgressNote,
    onSendForCertification,
    rangeContext,
    className,
    ...rest
  },
  ref
) {
  const a = auth || {};
  const used = a.used || 0;
  const tot = a.authorized || 0;
  const left = tot - used;
  const since = visitsSinceProgressNote;
  const due = since >= 10 || progressNoteDue;
  return (
    <RangeContextProvider value={rangeContext}>
      <Card
        ref={ref}
        className={cx('co-ptpoc', className)}
        title={title}
        subtitle={subtitle}
        actions={
          readOnly ? null : (
            <>
              <Button size="sm" onClick={onProgressNote}>
                Progress Note
              </Button>
              <Button size="sm" variant="primary" onClick={onSendForCertification}>
                Send for Certification
              </Button>
            </>
          )
        }
        {...rest}
      >
        <div className="co-sp-grid co-sp-grid-170 co-sp-mb">
          {(
            [
              ['Diagnosis', diagnosis],
              ['Certification', cert],
              ['Frequency', frequency],
              ['Referring', referring],
            ] as const
          ).map(([k, v]) => (
            <div key={k}>
              <div className="co-kl">{k}</div>
              <div>{v || 'Not recorded'}</div>
            </div>
          ))}
        </div>
        <div className="co-sp-box">
          <ProgressBar
            label={'Visits used, ' + (a.payer || 'payer') + ' authorization'}
            value={used}
            max={tot || 1}
            thresholds={[80, 100]}
            valueText={used + ' of ' + tot + ' visits used, ' + left + ' left'}
            helper={
              (a.expires ? 'Authorization ends ' + a.expires + '. ' : '') +
              (left <= 2 && tot ? 'Request more visits now; a decision can take 5 to 7 business days.' : 'Visits counted from signed notes only.')
            }
          />
          <div className="co-row co-gap-8 co-pt-pn">
            <span className="co-mi-s co-sp-inline">
              Visits since last progress note: <b className="co-sp-num">{since}</b>
            </span>
            {due ? (
              <Badge tone="warning" icon="clock">
                Progress note due
              </Badge>
            ) : (
              <Badge tone="outline">Due at visit 10</Badge>
            )}
          </div>
        </div>
        <SpecHeading>Functional scores</SpecHeading>
        <SpecTable
          caption="Functional outcome scores"
          cols={['Measure', 'Baseline', 'Current', 'Change', 'MCID', 'Meaning']}
          num={[1, 2, 3, 4]}
          rows={scores.map((s) => {
            const c = ptScoreChange(s);
            const k = s.k || 'pts';
            return [
              <span key="n">
                <b>{s.name}</b>
                <span className="co-mi-s">{s.range}</span>
              </span>,
              <V key="b" k={k} v={s.baseline} />,
              <V key="c" k={k} v={s.current} />,
              <V key="d" k={k} v={c.change} over={{ sign: true }} />,
              <V key="m" k={k} v={s.mcid} />,
              <Badge key="r" tone={c.result === 'beyond' ? 'success' : c.result === 'under' ? 'info' : 'danger'} size="sm">
                {c.result === 'beyond' ? 'Change beyond MCID' : c.result === 'under' ? 'Better, under MCID' : 'No improvement'}
              </Badge>,
            ];
          })}
        />
        <SpecHeading>Goals</SpecHeading>
        <SpecTable
          caption="Goals"
          cols={['Term', 'Goal', 'Baseline', 'Current', 'Target', 'Status']}
          num={[2, 3, 4]}
          rows={goals.map((g) => {
            const st = (g.status && GST[g.status]) || GST.new;
            return [
              g.term,
              g.text,
              <V key="b" k={g.k} v={g.baseline} />,
              <V key="c" k={g.k} v={g.current} />,
              <V key="t" k={g.k} v={g.target} />,
              <Badge key="s" tone={st.tone} size="sm">
                {st.label}
              </Badge>,
            ];
          })}
        />
        <div className="co-help">
          MCID is the smallest change patients notice. Medicare requires a progress report at least every 10 treatment days
          and recertification by the end of the certification period.
        </div>
      </Card>
    </RangeContextProvider>
  );
});
