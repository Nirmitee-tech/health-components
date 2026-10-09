import { forwardRef } from 'react';
import { Alert } from '../Alert/Alert';
import { Badge } from '../Badge/Badge';
import { BarChart, type BarChartDatum } from '../BarChart/BarChart';
import { Card, type CardProps } from '../Card/Card';
import { ProgressBar } from '../ProgressBar/ProgressBar';

/** One reading: [label, value], e.g. ['10/03', 138]. */
export type RPMReading = readonly [label: string, value: number];

export interface RPMReadingChartProps extends Omit<CardProps, 'title' | 'subtitle' | 'children' | 'actions'> {
  /** Array<[label, value]>; required */
  readings: ReadonlyArray<RPMReading>;
  /** Chart caption and start of its accessible summary ("Systolic (mmHg), last 7 readings"); default none */
  metric?: string;
  /** Device and context line under the title; default none */
  device?: string;
  /** Card title; default "Remote monitoring" */
  title?: string;
  /** Alert line: readings at or above it are red; default none */
  high?: number;
  /** Readings at or below it are amber; default none */
  low?: number;
  /** Top of the chart scale; default auto */
  max?: number;
  /** Reading days this month (16 needed for 99454); required */
  days: number;
  /** Interactive minutes this month (20 needed for 99457); default 0 */
  minutes?: number;
  /** Out-of-range note shown as a warning Alert; default none */
  alert?: string;
}

/** RPMReadingChart shows remote-monitoring readings against an alert line, reading days toward 99454 and interactive minutes toward 99457. */
export const RPMReadingChart = forwardRef<HTMLElement, RPMReadingChartProps>(function RPMReadingChart(
  { readings, metric, device, title = 'Remote monitoring', high, low, max, days, minutes = 0, alert, ...rest },
  ref
) {
  const data: BarChartDatum[] = readings.map(([label, value]) => ({
    label,
    value,
    tone: high != null && value >= high ? 'hi' : low != null && value <= low ? 'lo' : 'ok',
  }));
  const over = high != null ? data.filter((d) => d.tone === 'hi').length : 0;
  const under = low != null ? data.filter((d) => d.tone === 'lo').length : 0;
  const summary = [
    high != null ? `${over} of ${data.length} readings at or above the ${high} alert line.` : null,
    low != null ? `${under} at or below ${low}.` : null,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <Card
      ref={ref}
      title={title}
      subtitle={device}
      actions={<Badge tone={days >= 16 ? 'success' : 'warning'}>{`${days} of 16 reading days (99454)`}</Badge>}
      {...rest}
    >
      <BarChart
        data={data}
        threshold={high}
        thresholdLabel={high != null ? `${high} alert` : undefined}
        max={max}
        title={metric}
      />
      {summary ? <p className="co-sr">{summary}</p> : null}
      {alert ? <Alert tone="warning" title={alert} /> : null}
      <ProgressBar
        label="Interactive time this month (99457)"
        value={minutes}
        max={20}
        valueText={`${minutes} of 20 min`}
        tone={minutes >= 20 ? 'success' : 'primary'}
      />
    </Card>
  );
});
