import { forwardRef, useState, type HTMLAttributes } from 'react';
import { useRangeContext, type RangeContextId } from '../../clinical';
import { NURSING_CONTEXT, Value, type NursingRange } from '../../internal/nursing';
import { Badge, type BadgeTone } from '../Badge/Badge';
import { Card } from '../Card/Card';

/** How an intervention went in one shift. */
export type ShiftStatus = 'done' | 'partial' | 'notdone' | 'na';
/** Where the goal stands. */
export type CarePlanGoalStatus = 'met' | 'progressing' | 'notmet' | 'new';

/** One intervention of a nursing problem. */
export interface CarePlanIntervention {
  /** What the nurse does */
  text: string;
  /** How often ('q2h') */
  freq?: string;
  /** Status per shift, by shift index */
  status?: Array<ShiftStatus | undefined>;
}

/** One nursing problem with its goal and interventions. */
export interface CarePlanProblem {
  /** Problem ('Risk for falls') */
  problem: string;
  /** Goal text */
  goal: string;
  /** 'met' | 'progressing' | 'notmet' | 'new'; default 'new' */
  goalStatus?: CarePlanGoalStatus;
  /** Shows a Priority badge */
  priority?: boolean;
  /** Target date */
  target?: string;
  /** Latest value that measures the goal */
  measure?: { measure: string; value: number; range?: NursingRange };
  /** Interventions */
  interventions: CarePlanIntervention[];
  /** Evaluation text */
  evaluation?: string;
}

/** What onStatusChange receives. */
export interface CarePlanStatusChange {
  /** Problem index */
  problem: number;
  /** Intervention index */
  intervention: number;
  /** Shift index */
  shift: number;
  /** New status */
  status: ShiftStatus;
}

export interface CarePlanByShiftProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Problems; required */
  problems: CarePlanProblem[];
  /** Shift labels; default ['Day 07-15', 'Evening 15-23', 'Night 23-07'] */
  shifts?: string[];
  /** Index of the current (only editable) shift; default none (nothing editable) */
  currentShift?: number;
  /** View only; default false */
  readOnly?: boolean;
  /** Called when a current-shift status is changed (Done, Partly, Not done, N/A in turn) */
  onStatusChange?: (e: CarePlanStatusChange) => void;
  /** Card title; default 'Care Plan by Shift' */
  title?: string;
  /** Patient line; default none */
  subtitle?: string;
  /** Which shared reference range flags use; a goal measure's own range still wins; default 'inpatient' when no global context is set */
  rangeContext?: RangeContextId;
}

const SHIFT_ST: Record<ShiftStatus, { tone: BadgeTone; label: string }> = {
  done: { tone: 'success', label: 'Done' },
  partial: { tone: 'warning', label: 'Partly' },
  notdone: { tone: 'danger', label: 'Not done' },
  na: { tone: 'neutral', label: 'N/A' },
};
const GOAL_ST: Record<CarePlanGoalStatus, { tone: BadgeTone; label: string }> = {
  met: { tone: 'success', label: 'Goal met' },
  progressing: { tone: 'info', label: 'Progressing' },
  notmet: { tone: 'danger', label: 'Not progressing' },
  new: { tone: 'neutral', label: 'New' },
};
const CYCLE: ShiftStatus[] = ['done', 'partial', 'notdone', 'na'];

/**
 * CarePlanByShift shows each nursing problem with its goal, goal status and the interventions charted Done, Partly,
 * Not done or N/A for each shift; only the current shift is editable.
 */
export const CarePlanByShift = forwardRef<HTMLElement, CarePlanByShiftProps>(function CarePlanByShift(
  {
    problems,
    shifts = ['Day 07-15', 'Evening 15-23', 'Night 23-07'],
    currentShift,
    readOnly = false,
    onStatusChange,
    title = 'Care Plan by Shift',
    subtitle,
    rangeContext,
    ...rest
  },
  ref
) {
  const ctx = useRangeContext(NURSING_CONTEXT, rangeContext);
  /* Statuses charted here overlay the props, keyed 'problem|intervention|shift'. */
  const [charted, setCharted] = useState<Record<string, ShiftStatus>>({});
  const statusOf = (pi: number, ii: number, si: number): ShiftStatus | undefined =>
    charted[pi + '|' + ii + '|' + si] || (problems[pi]?.interventions[ii]?.status || [])[si];
  const bump = (pi: number, ii: number, si: number) => {
    if (readOnly || si !== currentShift) return;
    const c = statusOf(pi, ii, si);
    const next = CYCLE[(c ? CYCLE.indexOf(c) + 1 : 0) % CYCLE.length]!;
    setCharted((m) => ({ ...m, [pi + '|' + ii + '|' + si]: next }));
    onStatusChange?.({ problem: pi, intervention: ii, shift: si, status: next });
  };

  return (
    <Card ref={ref} title={title} subtitle={subtitle} {...rest}>
      {problems.map((pr, pi) => {
        const g = GOAL_ST[pr.goalStatus || 'new'] || GOAL_ST.new;
        return (
          <section key={pi} className="nu-cp" aria-label={pr.problem}>
            <header>
              <b>{pr.problem}</b>
              <Badge tone={g.tone} size="sm">
                {g.label}
              </Badge>
              {pr.priority ? (
                <Badge tone="danger" size="sm">
                  Priority
                </Badge>
              ) : null}
              <span className="nu-sp" />
              {pr.target ? <span className="nu-muted">Target {pr.target}</span> : null}
            </header>
            <div className="nu-ink2 nu-cp-goal">
              <span className="nu-muted">Goal: </span>
              {pr.goal}
              {pr.measure ? (
                <span>
                  {' '}
                  Latest <Value measure={pr.measure.measure} value={pr.measure.value} range={pr.measure.range} rangeContext={ctx} />
                </span>
              ) : null}
            </div>
            <div className="nu-cp-tbl">
              <table className="nu-t">
                <caption className="co-sr">Interventions for {pr.problem} by shift</caption>
                <thead>
                  <tr>
                    <th scope="col">Intervention</th>
                    {shifts.map((s, si) => (
                      <th key={s} scope="col" className={si === currentShift ? 'nu-now nu-th-c' : 'nu-th-c'}>
                        {s}
                        {si === currentShift ? <span className="nu-muted"> (now)</span> : null}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pr.interventions.map((it, ii) => (
                    <tr key={ii}>
                      <td>
                        {it.text}
                        {it.freq ? <span className="nu-muted"> . {it.freq}</span> : null}
                      </td>
                      {shifts.map((s, si) => {
                        const st = statusOf(pi, ii, si);
                        const m = st ? SHIFT_ST[st] : undefined;
                        const editable = !readOnly && si === currentShift;
                        const tag = m ? (
                          <Badge tone={m.tone} size="sm">
                            {m.label}
                          </Badge>
                        ) : (
                          <span className="nu-muted">{currentShift != null && si > currentShift ? 'Upcoming' : '--'}</span>
                        );
                        return (
                          <td key={si} className={si === currentShift ? 'nu-now nu-th-c' : 'nu-th-c'}>
                            {editable ? (
                              <button
                                type="button"
                                className="nu-opt nu-cp-btn"
                                aria-label={it.text + ', ' + s + ': ' + (m ? m.label : 'not charted') + '. Select to change.'}
                                onClick={() => bump(pi, ii, si)}
                              >
                                {tag}
                              </button>
                            ) : (
                              tag
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pr.evaluation ? (
              <div className="nu-cp-eval">
                <span className="nu-muted">Evaluation: </span>
                {pr.evaluation}
              </div>
            ) : null}
          </section>
        );
      })}
    </Card>
  );
});
