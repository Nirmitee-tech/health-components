import { forwardRef, type HTMLAttributes } from 'react';
import { RangeContextProvider, useRangeContext, type RangeContextId } from '../../clinical';
import { cx } from '../../internal/cx';
import { useControllableState } from '../../internal/hooks';
import {
  INPATIENT_DEFAULT_CONTEXT,
  Value,
  inpatientFlag,
  inpatientLabel,
  inpatientText,
  isCritical,
  mmss,
  useClock,
  type InpatientMeasureValue,
} from '../../internal/inpatientFlow';
import { Button } from '../Button/Button';
import { Select } from '../Select/Select';

/** One intervention already done. */
export interface RapidResponseIntervention {
  /** When ('14:04') */
  at: string;
  /** What was done */
  text: string;
}

/** Outcomes offered when the call ends. */
export const rapidResponseOutcomes: readonly string[] = [
  'Stays on unit, watch closely',
  'Transfer to step-down',
  'Transfer to ICU',
  'Escalated to Code Blue',
  'Goals of care changed to comfort',
];

export interface RapidResponsePanelProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Patient ('Kowalski, Anna, 34 F'); required */
  patient: string;
  /** Location; required */
  location: string;
  /** Who called ('J. Patel, RN', 'Family'); default none */
  calledBy?: string;
  /** Why the team was called; required */
  reason: string;
  /** When the call was made, epoch ms; default when the component mounts */
  calledAt?: number;
  /** Freezes the clock at this epoch ms (for review and tests); default live */
  now?: number;
  /** Array of { measure, value, range, taken }; default [] */
  vitals?: InpatientMeasureValue[];
  /** Array of { measure, value, range, taken }; default [] */
  labs?: InpatientMeasureValue[];
  /** Array of { at, text }; default [] */
  interventions?: RapidResponseIntervention[];
  /** Starting outcome (uncontrolled); a chosen outcome closes the call and stops the clock; default none */
  outcome?: string;
  /** Outcome (controlled); default uncontrolled */
  outcomeValue?: string;
  /** Called with the chosen outcome; default none */
  onOutcomeChange?: (outcome: string) => void;
  /** Called by Escalate to Code Blue; default none */
  onEscalate?: () => void;
  /** Called by Close Call with the outcome; default none */
  onClose?: (outcome: string) => void;
  /** View only; default false */
  readOnly?: boolean;
  /** Which shared reference range flags use; the lab range on a result still wins; default 'inpatient' when no global context is set */
  rangeContext?: RangeContextId;
}

const NONE: never[] = [];

/**
 * RapidResponsePanel supports a rapid response call: who called and why, vitals against calling criteria, recent labs,
 * what has been done, outcome, and escalation to Code Blue.
 * Calling criteria shown are critical flags from the shared ranges; each hospital sets its own.
 */
export const RapidResponsePanel = forwardRef<HTMLElement, RapidResponsePanelProps>(function RapidResponsePanel(
  {
    patient,
    location,
    calledBy,
    reason,
    calledAt,
    now,
    vitals = NONE,
    labs = NONE,
    interventions = NONE,
    outcome = '',
    outcomeValue,
    onOutcomeChange,
    onEscalate,
    onClose,
    readOnly = false,
    rangeContext,
    className,
    ...rest
  },
  ref
) {
  const ctx = useRangeContext(INPATIENT_DEFAULT_CONTEXT, rangeContext);
  const [out, setOut] = useControllableState(outcomeValue, outcome, onOutcomeChange);
  const el = useClock(calledAt, now, !out);
  const triggers = vitals.filter((v) => isCritical(inpatientFlag(v.measure, v.value, v.range, ctx)));
  return (
    <RangeContextProvider value={rangeContext}>
      <section ref={ref} className={cx('ip-code', 'is-rrt', className)} aria-label="Rapid Response" {...rest}>
        <div className="ip-code-h">
          <div>
            <b>Rapid Response</b>
            <div style={{ fontSize: 12 }}>
              {location + ' · ' + patient + (calledBy ? ' · called by ' + calledBy : '')}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11 }}>{out ? 'Closed' : 'Team at bedside'}</div>
            <div className="ip-clock-sm" style={{ color: 'inherit' }} role="timer" aria-label={'Elapsed ' + mmss(el)}>
              {mmss(el)}
            </div>
          </div>
        </div>
        <div
          style={{
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <div>
            <div className="co-kl" style={{ marginBottom: 4 }}>
              Reason called
            </div>
            <div>{reason}</div>
            {triggers.length ? (
              <div className="co-mi-s" style={{ color: 'var(--co-danger-strong)' }}>
                {'Meets criteria: ' +
                  triggers
                    .map((v) => inpatientText(v.measure, v.value) + ' ' + inpatientLabel(v.measure).toLowerCase())
                    .join('; ')}
              </div>
            ) : null}
          </div>
          {vitals.length ? (
            <div className="ip-code-b" style={{ padding: 0 }}>
              {vitals.map((v, i) => {
                const f = inpatientFlag(v.measure, v.value, v.range, ctx);
                return (
                  <div
                    key={i}
                    className={cx('ip-tile', isCritical(f) && 'is-due', f != null && !isCritical(f) && 'is-soon')}
                  >
                    <span className="ip-tile-l">{v.label || inpatientLabel(v.measure)}</span>
                    <Value showRange {...v} />
                    {v.taken ? <span className="co-mi-s">{v.taken}</span> : null}
                  </div>
                );
              })}
            </div>
          ) : null}
          {labs.length ? (
            <div>
              <div className="co-kl" style={{ marginBottom: 4 }}>
                Recent labs
              </div>
              <div className="co-row co-gap-16" style={{ flexWrap: 'wrap' }}>
                {labs.map((l, i) => (
                  <span key={i}>
                    <span className="co-mi-s" aria-hidden="true">
                      {(l.label || inpatientLabel(l.measure)) + ' '}
                    </span>
                    <Value {...l} />
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          {interventions.length ? (
            <div>
              <div className="co-kl" style={{ marginBottom: 4 }}>
                Done so far
              </div>
              {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- scrollable log must be keyboard focusable (axe scrollable-region-focusable). */}
              <ol className="ip-log" style={{ padding: 0 }} tabIndex={0} aria-label="Interventions done so far">
                {interventions.map((e, i) => (
                  <li key={i}>
                    <time>{e.at}</time>
                    <span>{e.text}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
          <div className="ip-form">
            <Select
              label="Outcome"
              placeholder="Choose when the call ends"
              value={out}
              onChange={(e) => setOut(e.target.value)}
              options={rapidResponseOutcomes as string[]}
              readOnly={readOnly}
            />
          </div>
          <div className="co-row co-gap-8" style={{ justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <Button variant="danger-solid" onClick={onEscalate} disabled={readOnly}>
              Escalate to Code Blue
            </Button>
            <Button variant="primary" disabled={!out || readOnly} onClick={() => onClose?.(out)}>
              Close Call
            </Button>
          </div>
        </div>
      </section>
    </RangeContextProvider>
  );
});
