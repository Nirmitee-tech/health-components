import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../internal/cx';

/** Default series colours (tokens), in order. Shared with DonutChart. */
export const chartSeriesColors = [
  'var(--co-primary)',
  'var(--co-accent)',
  'var(--co-ai)',
  'var(--co-ink-2)',
  'var(--co-muted)',
] as const;

/** One line. */
export interface LineChartSeries {
  /** Series name for the legend and accessible text */
  name: string;
  /** One value per label */
  values: number[];
  /** CSS colour, use a token such as `var(--co-success)`; default the series palette */
  color?: string;
}

export interface LineChartProps extends HTMLAttributes<HTMLElement> {
  /** X-axis labels, one per value */
  labels: string[];
  /** Array<{name, values: number[], color?}>; up to two series read well (the second is dashed) */
  series: LineChartSeries[];
  /** Caption above the chart and start of the accessible summary; default none */
  title?: string;
  /** Height of the drawing in viewBox units (the chart scales with its width); default 180 */
  height?: number;
  /** Bottom of the scale; default 0 */
  min?: number;
  /** Top of the scale; default auto (largest value) */
  max?: number;
  /** [low, high] target band; default none */
  band?: [number, number];
}

const W = 520;
const PL = 36;
const PR = 8;
const PB = 22;
const PT = 8;

const fmt = (n: number) => (Number.isInteger(n) ? String(n) : String(Math.round(n * 10) / 10));

/**
 * LineChart shows a trend over time for up to two series, with an optional target band.
 * The SVG scales to its container (viewBox, width 100%), is `role="img"` with the values in its name, and a visually hidden table repeats the data.
 */
export const LineChart = forwardRef<HTMLElement, LineChartProps>(function LineChart(
  { labels, series, title, height = 180, min, max, band, className, ...rest },
  ref
) {
  const H = height;
  const all = series.flatMap((s) => s.values);
  const mn = min ?? 0;
  let mx = max || Math.max(1, ...all);
  if (mx <= mn) mx = mn + 1;
  const x = (i: number) => PL + (i * (W - PL - PR)) / Math.max(1, labels.length - 1);
  const y = (v: number) => PT + (1 - (v - mn) / (mx - mn)) * (H - PT - PB);
  const clampY = (v: number) => y(Math.min(mx, Math.max(mn, v)));
  const ticks = [mn, mn + (mx - mn) / 2, mx];
  const color = (s: LineChartSeries, i: number) => s.color || chartSeriesColors[i % chartSeriesColors.length]!;
  const summary = `${title || 'Line chart'}. ${series
    .map((s) => `${s.name}: ${s.values.map((v, i) => `${labels[i] ?? ''} ${v}`).join(', ')}`)
    .join('. ')}`;

  return (
    <figure ref={ref} className={cx('co-chart', className)} {...rest}>
      {title ? <figcaption className="co-chart-t">{title}</figcaption> : null}
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="co-line" role="img" aria-label={summary}>
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={PL} x2={W - PR} y1={y(t)} y2={y(t)} className="co-grid" />
            <text x={PL - 6} y={y(t) + 4} textAnchor="end" className="co-axis">
              {fmt(t)}
            </text>
          </g>
        ))}
        {labels.map((l, i) => (
          <text key={i} x={x(i)} y={H - 6} textAnchor="middle" className="co-axis">
            {l}
          </text>
        ))}
        {band ? (
          <rect
            x={PL}
            width={W - PL - PR}
            y={clampY(band[1])}
            height={Math.max(0, clampY(band[0]) - clampY(band[1]))}
            className="co-band"
          />
        ) : null}
        {series.map((s, si) => {
          const c = color(s, si);
          return (
            <g key={si}>
              <polyline
                points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ')}
                fill="none"
                stroke={c}
                strokeWidth={2}
                strokeDasharray={si === 1 ? '6 4' : undefined}
              />
              {s.values.map((v, i) => (
                <circle key={i} cx={x(i)} cy={y(v)} r={3.5} fill="var(--co-surface)" stroke={c} strokeWidth={2} />
              ))}
            </g>
          );
        })}
      </svg>
      <div className="co-legend">
        {series.map((s, si) => (
          <span key={si}>
            <i className="co-dot" style={{ background: color(s, si) }} />
            {s.name + (si === 1 ? ' (dashed)' : '')}
          </span>
        ))}
      </div>
      <table className="co-sr">
        {title ? <caption>{title}</caption> : null}
        <thead>
          <tr>
            <th scope="col">Label</th>
            {series.map((s, si) => (
              <th key={si} scope="col">
                {s.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {labels.map((l, i) => (
            <tr key={i}>
              <th scope="row">{l}</th>
              {series.map((s, si) => (
                <td key={si}>{s.values[i] ?? ''}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
});
