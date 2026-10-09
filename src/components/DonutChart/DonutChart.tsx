import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { chartSeriesColors } from '../LineChart/LineChart';

/** One segment. */
export interface DonutChartDatum {
  /** Segment label in the legend */
  label: string;
  /** Segment value */
  value: number;
  /** CSS colour, use a token such as `var(--co-success)`; default the series palette */
  color?: string;
}

export interface DonutChartProps extends HTMLAttributes<HTMLElement> {
  /** Array<{label, value, color?}>; up to five parts read well */
  data: DonutChartDatum[];
  /** Caption above the chart and start of the accessible summary; default none */
  title?: string;
  /** Big number in the middle; default the total */
  centerValue?: string | number;
  /** Label under the middle number; default "Total" */
  centerLabel?: string;
  /** Largest diameter in px (the ring shrinks with narrow containers); default 140 */
  size?: number;
}

const R = 52;
const C = 2 * Math.PI * R;

/**
 * DonutChart shows how a total splits into up to five parts, with the total in the middle and a value legend.
 * The ring is `role="img"` with every label and value in its name; the legend is a real list with values and percentages.
 */
export const DonutChart = forwardRef<HTMLElement, DonutChartProps>(function DonutChart(
  { data, title, centerValue, centerLabel = 'Total', size = 140, className, ...rest },
  ref
) {
  const total = data.reduce((a, d) => a + d.value, 0);
  const tot = total || 1;
  const color = (d: DonutChartDatum, i: number) => d.color || chartSeriesColors[i % chartSeriesColors.length]!;
  let off = 0;
  return (
    <figure ref={ref} className={cx('co-chart', 'co-donut', className)} {...rest}>
      {title ? <figcaption className="co-chart-t">{title}</figcaption> : null}
      <div className="co-row co-gap-16">
        <svg
          viewBox="0 0 140 140"
          width="100%"
          style={{ flex: `0 1 ${size}px`, maxWidth: size, minWidth: 0, height: 'auto' }}
          role="img"
          aria-label={`${title || 'Donut chart'}: ${data.map((d) => `${d.label} ${d.value}`).join(', ')}`}
        >
          <circle cx={70} cy={70} r={R} fill="none" stroke="var(--co-surface-muted)" strokeWidth={18} />
          {data.map((d, i) => {
            const len = (d.value / tot) * C;
            const dash = Math.max(0, len - 2);
            const el = (
              <circle
                key={i}
                cx={70}
                cy={70}
                r={R}
                fill="none"
                stroke={color(d, i)}
                strokeWidth={18}
                strokeDasharray={`${dash} ${C - dash}`}
                strokeDashoffset={-off}
                transform="rotate(-90 70 70)"
              />
            );
            off += len;
            return el;
          })}
          <text x={70} y={68} textAnchor="middle" className="co-donut-v">
            {centerValue ?? total}
          </text>
          <text x={70} y={86} textAnchor="middle" className="co-axis">
            {centerLabel}
          </text>
        </svg>
        <ul className="co-donut-l">
          {data.map((d, i) => (
            <li key={i}>
              <i className="co-dot" style={{ background: color(d, i) }} />
              <span>{d.label}</span>
              <b>{d.value}</b>
              <span className="co-mi-s">{Math.round((d.value / tot) * 100)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
});
