import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../internal/cx';

/** Bar colour: hi (danger), lo (warning), ok (success), ai, accent, primary. Bars without a tone use `primary`. */
export type BarChartTone = 'hi' | 'lo' | 'ok' | 'ai' | 'accent' | 'primary';

/** One bar. */
export interface BarChartDatum {
  /** Category or day label under the bar */
  label: string;
  /** Bar value */
  value: number;
  /** Bar colour; default primary */
  tone?: BarChartTone;
}

/** One legend entry explaining a tone. */
export interface BarChartLegendItem {
  label: string;
  tone: BarChartTone;
}

export interface BarChartProps extends HTMLAttributes<HTMLElement> {
  /** Array<{label, value, tone?}> */
  data: BarChartDatum[];
  /** Caption above the chart and start of the accessible summary; default none */
  title?: string;
  /** Plot height in px; default 150 */
  height?: number;
  /** Top of the scale; default auto (largest value) */
  max?: number;
  /** Value of the dashed goal or limit line; default none */
  threshold?: number;
  /** Label of the threshold line; default "Goal N" */
  thresholdLabel?: string;
  /** Unit appended to values in the accessible text, e.g. " mmHg"; default "" */
  unit?: string;
  /** Array<{label, tone}>; default none */
  legend?: BarChartLegendItem[];
}

const pct = (v: number, max: number) => `${Math.min(100, Math.max(0, (v / max) * 100))}%`;

/**
 * BarChart shows values per category or day with optional threshold line and out-of-range colours, for dashboards and remote monitoring.
 * The plot is `role="img"` with every label and value in its name; a visually hidden table repeats the data for table navigation.
 */
export const BarChart = forwardRef<HTMLElement, BarChartProps>(function BarChart(
  { data, title, height = 150, max, threshold, thresholdLabel, unit = '', legend, className, ...rest },
  ref
) {
  const top = max || Math.max(1, ...data.map((d) => d.value));
  const toneLabel = (tone?: BarChartTone) => legend?.find((l) => l.tone === tone)?.label;
  const hasStatus = !!legend && data.some((d) => toneLabel(d.tone));
  const summary = `${title || 'Bar chart'}: ${data.map((d) => `${d.label} ${d.value}${unit}`).join(', ')}`;
  return (
    <figure ref={ref} className={cx('co-chart', className)} {...rest}>
      {title ? <figcaption className="co-chart-t">{title}</figcaption> : null}
      <div className="co-bars" style={{ height }} role="img" aria-label={summary}>
        {threshold != null ? (
          <span className="co-bars-th" style={{ bottom: pct(threshold, top) }}>
            <span>{thresholdLabel || `Goal ${threshold}`}</span>
          </span>
        ) : null}
        {data.map((d, i) => (
          <div key={i} className="co-barc">
            <span className="co-barval">{d.value}</span>
            <span className={cx('co-barv', d.tone && `co-barv-${d.tone}`)} style={{ height: pct(d.value, top) }} />
            <span className="co-barlab">{d.label}</span>
          </div>
        ))}
      </div>
      {legend ? (
        <div className="co-legend">
          {legend.map((l) => (
            <span key={l.label}>
              <i className={`co-dot co-barv-${l.tone}`} />
              {l.label}
            </span>
          ))}
        </div>
      ) : null}
      <table className="co-sr">
        {title ? <caption>{title}</caption> : null}
        <thead>
          <tr>
            <th scope="col">Label</th>
            <th scope="col">Value</th>
            {hasStatus ? <th scope="col">Status</th> : null}
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <th scope="row">{d.label}</th>
              <td>{`${d.value}${unit}`}</td>
              {hasStatus ? <td>{toneLabel(d.tone) ?? ''}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
});
