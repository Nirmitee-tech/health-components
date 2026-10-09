import { forwardRef, useEffect, useState } from 'react';
import { useControllableState } from '../../internal/hooks';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card, type CardProps } from '../Card/Card';
import { ProgressBar } from '../ProgressBar/ProgressBar';

export interface CCMTimerProps extends Omit<CardProps, 'title' | 'subtitle' | 'children' | 'actions' | 'padding'> {
  /** Patient name; required */
  patient: string;
  /** Month being counted ("October 2026"); required */
  month: string;
  /** Minutes already logged this month; default 0 */
  minutes?: number;
  /** Starting value of the session clock, "mm:ss" or "h:mm:ss"; default "00:00" */
  clock?: string;
  /** Controlled running state; default undefined (uncontrolled) */
  running?: boolean;
  /** Initial running state (uncontrolled); default false */
  defaultRunning?: boolean;
  /** Called when Start or Pause is pressed */
  onRunningChange?: (running: boolean) => void;
  /** Called by Log Activity with the session clock in seconds; default none */
  onLogActivity?: (seconds: number) => void;
}

/** Parses "mm:ss" or "h:mm:ss" to seconds; invalid text gives 0. */
export function parseClock(clock: string): number {
  const parts = clock.split(':').map((p) => Number(p));
  if (parts.some((n) => !Number.isFinite(n) || n < 0)) return 0;
  return parts.reduce((acc, n) => acc * 60 + n, 0);
}

/** Formats seconds as "mm:ss", or "h:mm:ss" from one hour. */
export function formatClock(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s % 60)}` : `${pad(m)}:${pad(s % 60)}`;
}

/**
 * CCMTimer tracks chronic care management minutes for the month toward 99490 and 99439.
 * The session clock ticks every second while running; the interval starts only in the browser and is cleared on pause and unmount.
 */
export const CCMTimer = forwardRef<HTMLElement, CCMTimerProps>(function CCMTimer(
  {
    patient,
    month,
    minutes = 0,
    clock = '00:00',
    running,
    defaultRunning = false,
    onRunningChange,
    onLogActivity,
    ...rest
  },
  ref
) {
  const [run, setRun] = useControllableState(running, defaultRunning, onRunningChange);
  const [elapsed, setElapsed] = useState(() => parseClock(clock));
  const [startClock, setStartClock] = useState(clock);
  if (startClock !== clock) {
    // A new starting clock from the parent resets the session clock.
    setStartClock(clock);
    setElapsed(parseClock(clock));
  }

  useEffect(() => {
    if (!run) return;
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [run]);

  const m = minutes;
  const helper =
    m >= 20
      ? m >= 40
        ? '99490 + 99439 earned.'
        : '99490 earned. 20 more minutes adds 99439.'
      : `${20 - m} minutes to go. Counts only clinical staff time with consent on file.`;

  return (
    <Card ref={ref} title="Chronic care management time" subtitle={`${patient} . ${month}`} padding="compact" {...rest}>
      <div className="co-row">
        <span className="co-kv" role="timer" aria-live="off" aria-label={`Session time ${formatClock(elapsed)}`}>
          {formatClock(elapsed)}
        </span>
        {run ? (
          <Badge tone="success" dot>
            Timing
          </Badge>
        ) : (
          <Badge>Paused</Badge>
        )}
        <div className="co-ml co-row co-gap-6">
          <Button
            size="sm"
            variant={run ? 'secondary' : 'primary'}
            iconLeft={run ? 'minus' : 'clock'}
            onClick={() => setRun(!run)}
          >
            {run ? 'Pause' : 'Start'}
          </Button>
          <Button size="sm" onClick={() => onLogActivity?.(elapsed)}>
            Log Activity
          </Button>
        </div>
      </div>
      <ProgressBar
        label="This month toward 99490 (20 min)"
        value={Math.min(m, 20)}
        max={20}
        valueText={`${m} min logged`}
        tone={m >= 20 ? 'success' : 'primary'}
        helper={helper}
      />
    </Card>
  );
});
