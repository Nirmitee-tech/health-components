import { forwardRef, type HTMLAttributes } from 'react';
import { RangeContextProvider, type RangeContextId } from '../../clinical';
import { cx } from '../../internal/cx';
import { useControllableState, useLatest } from '../../internal/hooks';
import { Value, mmss, useClock, type InpatientMeasureValue } from '../../internal/inpatientFlow';
import { Button } from '../Button/Button';

/** One event on the code record. */
export interface CodeEvent {
  /** Seconds since the code started */
  t: number;
  /** What happened ('Epinephrine 1 mg IV push') */
  text: string;
  /** Who did or recorded it; default none */
  by?: string;
}

export interface CodeBlueTimerProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Patient ('Ruiz, Carmen, 81 F'); required */
  patient: string;
  /** Location ('4 West 404B'); required */
  location: string;
  /** When the code started, epoch ms; default when the component mounts */
  startedAt?: number;
  /** Freezes the clock at this epoch ms (for review and tests); default live */
  now?: number;
  /** Array of { t: seconds, text, by }: the starting log (uncontrolled); default [] */
  events?: CodeEvent[];
  /** The log (controlled); pair with onEventsChange; default uncontrolled */
  eventsValue?: CodeEvent[];
  /** Called with the new log when an event is added; default none */
  onEventsChange?: (events: CodeEvent[]) => void;
  /** Current rhythm ('VF', 'PEA'); default none */
  rhythm?: string;
  /** Defibrillator energy, joules biphasic; default none (200 in the shock log) */
  energy?: string | number;
  /** Array of { measure, value }: monitor values; default [] */
  vitals?: InpatientMeasureValue[];
  /** string[]: the team; default none */
  team?: string[];
  /** Outcome; ends the code (header shows it, actions hidden, clock stops); default none */
  ended?: string;
  /** Review of a past code: no actions; default false */
  readOnly?: boolean;
  /** Called with each new event; default none */
  onEvent?: (event: CodeEvent) => void;
  /** Called by ROSC; default none */
  onRosc?: () => void;
  /** Which shared reference range flags use; the lab range on a result still wins; default 'inpatient' when no global context is set */
  rangeContext?: RangeContextId;
}

const NO_EVENTS: CodeEvent[] = [];

/**
 * CodeBlueTimer runs a resuscitation: elapsed time, the 2-minute CPR cycle, time since epinephrine, rhythm and
 * shocks, one-tap event logging, and the event log for the code record.
 * Timers follow AHA ACLS 2020: rhythm check every 2 minutes, epinephrine every 3 to 5 minutes. They are reminders only.
 */
export const CodeBlueTimer = forwardRef<HTMLElement, CodeBlueTimerProps>(function CodeBlueTimer(
  {
    patient,
    location,
    startedAt,
    now,
    events = NO_EVENTS,
    eventsValue,
    onEventsChange,
    rhythm,
    energy,
    vitals = [],
    team,
    ended,
    readOnly = false,
    onEvent,
    onRosc,
    rangeContext,
    className,
    ...rest
  },
  ref
) {
  const el = useClock(startedAt, now, !ended);
  const [log, setLog] = useControllableState(eventsValue, events, onEventsChange);
  const onEventRef = useLatest(onEvent);
  const add = (text: string) => {
    const ev: CodeEvent = { t: Math.floor(el), text };
    setLog(log.concat([ev]));
    onEventRef.current?.(ev);
  };
  const lastOf = (re: RegExp) => {
    for (let i = log.length - 1; i >= 0; i--) if (re.test(log[i]!.text)) return log[i]!.t;
    return null;
  };
  const lastCyc = lastOf(/Rhythm check|CPR started/);
  const lastEpi = lastOf(/Epinephrine/);
  const cyc = lastCyc != null && !ended ? el - lastCyc : null;
  const epi = lastEpi != null && !ended ? el - lastEpi : null;
  const shocks = log.filter((e) => /Shock/.test(e.text)).length;
  const epis = log.filter((e) => /Epinephrine/.test(e.text)).length;
  const amioGiven = log.some((e) => /Amiodarone/.test(e.text));
  return (
    <RangeContextProvider value={rangeContext}>
      <section ref={ref} className={cx('ip-code', className)} aria-label="Code Blue" {...rest}>
        <div className="ip-code-h">
          <div>
            <b>{ended ? 'Code Blue ended: ' + ended : 'CODE BLUE'}</b>
            <div style={{ fontSize: 12 }}>{location + ' · ' + patient}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11 }}>Elapsed</div>
            <div className="ip-clock" style={{ color: 'inherit' }} role="timer" aria-label={'Elapsed ' + mmss(el)}>
              {mmss(el)}
            </div>
          </div>
        </div>
        <div className="ip-code-b">
          <div
            className={cx(
              'ip-tile',
              cyc != null && cyc >= 120 && 'is-due',
              cyc != null && cyc >= 105 && cyc < 120 && 'is-soon'
            )}
          >
            <span className="ip-tile-l">CPR cycle</span>
            <span className={cx('ip-clock-sm', cyc != null && cyc >= 120 && !ended && 'ip-blink')}>
              {cyc == null ? '--:--' : mmss(cyc)}
            </span>
            <span className="co-mi-s">{cyc != null && cyc >= 120 ? 'Rhythm check due' : 'Check rhythm at 02:00'}</span>
          </div>
          <div
            className={cx(
              'ip-tile',
              epi != null && epi >= 300 && 'is-due',
              epi != null && epi >= 180 && epi < 300 && 'is-soon'
            )}
          >
            <span className="ip-tile-l">Since epinephrine</span>
            <span className="ip-clock-sm">{epi == null ? '--:--' : mmss(epi)}</span>
            <span className="co-mi-s">{epis + (epis === 1 ? ' dose ' : ' doses ') + '· due every 03:00 to 05:00'}</span>
          </div>
          <div className="ip-tile">
            <span className="ip-tile-l">Rhythm</span>
            <b>{rhythm || 'Unknown'}</b>
            <span className="co-mi-s">
              {shocks + (shocks === 1 ? ' shock' : ' shocks') + (energy ? ' · ' + energy + ' J biphasic' : '')}
            </span>
          </div>
          <div className="ip-tile">
            <span className="ip-tile-l">Monitor</span>
            {vitals.map((v, i) => (
              <Value key={i} showLabel {...v} />
            ))}
          </div>
        </div>
        {ended || readOnly ? null : (
          <div className="ip-acts">
            <Button size="sm" onClick={() => add('Rhythm check: ' + (rhythm || 'checked'))}>
              Rhythm Check
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => add('Shock ' + (shocks + 1) + ', ' + (energy || 200) + ' J')}
            >
              Shock Delivered
            </Button>
            <Button size="sm" onClick={() => add('Epinephrine 1 mg IV push')}>
              Epinephrine 1 mg
            </Button>
            <Button size="sm" onClick={() => add('Amiodarone ' + (amioGiven ? '150' : '300') + ' mg IV push')}>
              {'Amiodarone ' + (amioGiven ? '150' : '300') + ' mg'}
            </Button>
            <Button size="sm" onClick={() => add('Airway: ETT placed, EtCO2 confirmed')}>
              Airway
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                add('ROSC');
                onRosc?.();
              }}
            >
              ROSC
            </Button>
          </div>
        )}
        <div className="co-kl" style={{ padding: '0 14px 4px' }}>
          {'Event log (' + log.length + ')'}
        </div>
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- scrollable log must be keyboard focusable (axe scrollable-region-focusable). */}
        <ol className="ip-log" aria-live="polite" tabIndex={0} aria-label="Event log, newest first">
          {log
            .slice()
            .reverse()
            .map((e, i) => (
              <li key={log.length - i}>
                <time>{mmss(e.t)}</time>
                <span>
                  {e.text}
                  {e.by ? <span className="co-mi-s">{' · ' + e.by}</span> : null}
                </span>
              </li>
            ))}
        </ol>
        {team ? (
          <div
            style={{
              padding: '0 14px 12px',
              fontSize: 12,
              color: 'var(--co-muted)',
            }}
          >
            {'Team: ' + team.join(', ')}
          </div>
        ) : null}
      </section>
    </RangeContextProvider>
  );
});
