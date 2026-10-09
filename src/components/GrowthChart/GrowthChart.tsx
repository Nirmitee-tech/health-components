import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { useDomId } from '../../internal/hooks';

/** One measurement: [age in months, value]. */
export type GrowthPoint = readonly [ageMonths: number, value: number];

export interface GrowthChartProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Array<[ageMonths, value]>: the child's measurements; required */
  points: ReadonlyArray<GrowthPoint>;
  /** Record<percentile label, value per age in `ages`> ({'3': [...], '50': [...], '97': [...]}); required */
  percentiles: Record<string, ReadonlyArray<number>>;
  /** number[]: ages (months) of the x axis and of each percentile value; default [0,6,12,18,24,36] */
  ages?: ReadonlyArray<number>;
  /** Bottom of the y axis; default 2 */
  min?: number;
  /** Top of the y axis; default 18 */
  max?: number;
  /** Caption and accessible name; default "Weight-for-age (kg), WHO 0 to 36 months" */
  title?: string;
  /** Unit read with each measurement in the accessible summary; default none */
  unit?: string;
  /** Note under the chart ("Last: 11.6 kg at 24 months, about the 50th percentile."); default none */
  note?: ReactNode;
}

const DEFAULT_AGES = [0, 6, 12, 18, 24, 36];
const W = 520;
const H = 220;
const PL = 34;

/** "3" to "3rd", "50" to "50th", "97" to "97th". Non-numeric labels are kept as they are. */
function ordinal(label: string): string {
  const n = Number(label);
  if (!Number.isInteger(n)) return label;
  const t = n % 100;
  const suffix = t >= 11 && t <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th';
  return `${n}${suffix}`;
}

/** GrowthChart plots a child's measurements over WHO or CDC percentile curves. */
export const GrowthChart = forwardRef<HTMLElement, GrowthChartProps>(function GrowthChart(
  {
    points,
    percentiles,
    ages = DEFAULT_AGES,
    min = 2,
    max = 18,
    title = 'Weight-for-age (kg), WHO 0 to 36 months',
    unit,
    note,
    className,
    id,
    ...rest
  },
  ref
) {
  const baseId = useDomId('co-growth', id);
  const a0 = ages[0] ?? 0;
  const span = (ages[ages.length - 1] ?? a0) - a0 || 1;
  const range = max - min || 1;
  const x = (a: number) => PL + ((a - a0) / span) * (W - PL - 10);
  const y = (v: number) => 8 + (1 - (v - min) / range) * (H - 30);
  const bands = Object.keys(percentiles);
  const u = unit ? ` ${unit}` : '';
  return (
    <figure ref={ref} id={id} className={cx('co-chart', className)} {...rest}>
      <figcaption className="co-chart-t">{title}</figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="co-line"
        role="img"
        aria-label={`${title}. Patient: ${points.map(([a, v]) => `${a} months ${v}${u}`).join(', ')}`}
        aria-describedby={`${baseId}-sum`}
      >
        {bands.map((k) => {
          const vals = percentiles[k] ?? [];
          const last = vals[vals.length - 1];
          return (
            <g key={k}>
              <polyline
                points={vals.map((v, j) => `${x(ages[j] ?? a0)},${y(v)}`).join(' ')}
                fill="none"
                stroke="var(--co-border-strong)"
                strokeWidth={k === '50' ? 1.5 : 1}
                strokeDasharray={k === '50' ? undefined : '4 3'}
              />
              {last != null ? (
                <text x={W - 8} y={y(last) - 3} textAnchor="end" className="co-axis">
                  {ordinal(k)}
                </text>
              ) : null}
            </g>
          );
        })}
        {ages.map((a) => (
          <text key={a} x={x(a)} y={H - 6} textAnchor="middle" className="co-axis">
            {`${a} mo`}
          </text>
        ))}
        <polyline
          points={points.map(([a, v]) => `${x(a)},${y(v)}`).join(' ')}
          fill="none"
          stroke="var(--co-primary)"
          strokeWidth={2}
        />
        {points.map(([a, v], i) => (
          <circle key={i} cx={x(a)} cy={y(v)} r={4} fill="var(--co-surface)" stroke="var(--co-primary)" strokeWidth={2} />
        ))}
      </svg>
      <div id={`${baseId}-sum`} className="co-sr">
        {`Percentile curves: ${bands.map(ordinal).join(', ')}. `}
        {points.length
          ? `Measurements: ${points.map(([a, v]) => `${v}${u} at ${a} months`).join('; ')}.`
          : 'No measurements yet.'}
      </div>
      {note ? <div className="co-help">{note}</div> : null}
    </figure>
  );
});
