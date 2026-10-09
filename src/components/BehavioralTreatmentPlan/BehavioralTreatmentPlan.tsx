import { forwardRef, type HTMLAttributes } from 'react';
import { RangeContextProvider, type RangeContextId } from '../../clinical';
import { cx } from '../../internal/cx';
import { V } from '../../internal/specialty';
import { Badge, type BadgeTone } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { Icon } from '../Icon/Icon';

/** Status of an objective. */
export type ObjectiveStatus = 'met' | 'progressing' | 'not started' | 'not met' | 'revised';

/** What the clinician does, how often and who. */
export interface TreatmentIntervention {
  text: string;
  frequency: string;
  who: string;
}

/** A measure tracked by an objective. */
export interface ObjectiveMeasure {
  /** Measure name ('PHQ-9') */
  name: string;
  /** Measure key of the values; default 'pts' */
  k?: string;
  baseline?: number | null;
  current?: number | null;
  target?: number | null;
}

/** A measurable step with a target date. */
export interface TreatmentObjective {
  text: string;
  /** Target date */
  target: string;
  /** default 'not started' */
  status?: ObjectiveStatus;
  measure?: ObjectiveMeasure;
  interventions?: ReadonlyArray<TreatmentIntervention>;
}

/** A goal in clinical words, with the client's own words. */
export interface TreatmentGoal {
  text: string;
  /** The client's own words */
  words?: string;
  objectives?: ReadonlyArray<TreatmentObjective>;
}

/** A problem on the plan. */
export interface TreatmentProblem {
  /** ICD-10 code */
  code?: string;
  label: string;
  /** 'High' | 'Medium' | 'Low' */
  priority?: string;
  /** What shows the problem */
  evidence?: string;
  goals?: ReadonlyArray<TreatmentGoal>;
}

/** A signature on the plan; no date means it is still needed. */
export interface PlanSignature {
  role: string;
  date?: string;
}

export interface BehavioralTreatmentPlanProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Problems with goals, objectives and interventions; default [] */
  problems?: ReadonlyArray<TreatmentProblem>;
  /** Next review date; default none */
  reviewDue?: string;
  /** The review date has passed; default false */
  reviewOverdue?: boolean;
  /** Signatures; default [] */
  signatures?: ReadonlyArray<PlanSignature>;
  /** Card title; default 'Treatment plan' */
  title?: string;
  /** Line under the title; default none */
  subtitle?: string;
  /** Hides Review Plan and Sign Plan; default false */
  readOnly?: boolean;
  /** Review Plan action; default none */
  onReviewPlan?: () => void;
  /** Sign Plan action; default none */
  onSignPlan?: () => void;
  /** Which shared reference range flags use; the lab range on a result still wins; default the global context, else 'outpatient' */
  rangeContext?: RangeContextId;
}

const OST: Record<ObjectiveStatus, BadgeTone> = {
  met: 'success',
  progressing: 'info',
  'not started': 'neutral',
  'not met': 'danger',
  revised: 'warning',
};

const EMPTY_PROBLEMS: ReadonlyArray<TreatmentProblem> = [];
const EMPTY_SIGS: ReadonlyArray<PlanSignature> = [];

/**
 * BehavioralTreatmentPlan lays out a behavioral health plan as problems, goals, measurable objectives and the
 * interventions for each, with target dates, progress, review date and signatures.
 */
export const BehavioralTreatmentPlan = forwardRef<HTMLElement, BehavioralTreatmentPlanProps>(function BehavioralTreatmentPlan(
  {
    problems = EMPTY_PROBLEMS,
    reviewDue,
    reviewOverdue = false,
    signatures = EMPTY_SIGS,
    title = 'Treatment plan',
    subtitle,
    readOnly = false,
    onReviewPlan,
    onSignPlan,
    rangeContext,
    className,
    ...rest
  },
  ref
) {
  return (
    <RangeContextProvider value={rangeContext}>
      <Card
        ref={ref}
        className={cx('co-btp', className)}
        title={title}
        subtitle={subtitle}
        actions={
          readOnly ? null : (
            <>
              <Button size="sm" onClick={onReviewPlan}>
                Review Plan
              </Button>
              <Button size="sm" variant="primary" onClick={onSignPlan}>
                Sign Plan
              </Button>
            </>
          )
        }
        {...rest}
      >
        <div className="co-row co-gap-8 co-btp-head">
          {reviewDue ? (
            <Badge tone={reviewOverdue ? 'danger' : 'info'} icon="calendar">
              {(reviewOverdue ? 'Review overdue since ' : 'Next review ') + reviewDue}
            </Badge>
          ) : null}
          {signatures.map((s) => (
            <Badge key={s.role} tone={s.date ? 'success' : 'warning'} icon={s.date ? 'check' : 'clock'}>
              {s.role + (s.date ? ' signed ' + s.date : ' signature needed')}
            </Badge>
          ))}
        </div>
        {problems.map((pr, i) => (
          <section key={i} className="co-sp-box co-btp-prob" aria-label={'Problem ' + (i + 1)}>
            <div className="co-row co-gap-8">
              <span className="co-kl">{'Problem ' + (i + 1)}</span>
              {pr.code ? <span className="co-code">{pr.code}</span> : null}
              <b>{pr.label}</b>
              {pr.priority ? (
                <Badge tone={pr.priority === 'High' ? 'danger' : 'outline'} size="sm">
                  {pr.priority + ' priority'}
                </Badge>
              ) : null}
            </div>
            {pr.evidence ? <div className="co-mi-s co-btp-ev">{'As shown by: ' + pr.evidence}</div> : null}
            {(pr.goals || []).map((g, j) => (
              <div key={j} className="co-btp-goal">
                <div>
                  <span className="co-kl">{'Goal ' + (i + 1) + '.' + (j + 1) + ' '}</span>
                  <span>{g.text}</span>
                  {g.words ? <span className="co-mi-s">{'In the client’s words: "' + g.words + '"'}</span> : null}
                </div>
                <ol className="co-list co-btp-objs">
                  {(g.objectives || []).map((o, k) => {
                    const mk = (o.measure && o.measure.k) || 'pts';
                    return (
                      <li key={k} className="co-li co-btp-obj">
                        <span className="co-code">{i + 1 + '.' + (j + 1) + String.fromCharCode(97 + k)}</span>
                        <div className="co-li-b">
                          <span>{o.text}</span>
                          {o.measure ? (
                            <span className="co-mi-s">
                              {'Measure: ' + o.measure.name + ' baseline '}
                              <V k={mk} v={o.measure.baseline} />
                              {', now '}
                              <V k={mk} v={o.measure.current} />
                              {', target '}
                              <V k={mk} v={o.measure.target} />
                            </span>
                          ) : null}
                          <span className="co-mi-s">{'Target date ' + o.target}</span>
                          {(o.interventions || []).map((iv, m) => (
                            <span key={m} className="co-mi-s co-btp-iv">
                              <Icon name="chevron-right" size={12} />
                              {' ' + iv.text + ' . ' + iv.frequency + ' . ' + iv.who}
                            </span>
                          ))}
                        </div>
                        <Badge tone={(o.status && OST[o.status]) || 'neutral'} size="sm">
                          {o.status || 'not started'}
                        </Badge>
                      </li>
                    );
                  })}
                </ol>
              </div>
            ))}
          </section>
        ))}
        <div className="co-help">
          Objectives are measurable steps with a target date. Interventions say what the clinician does, how often and who.
          Most payers want a review at least every 90 days.
        </div>
      </Card>
    </RangeContextProvider>
  );
});
