import { forwardRef, type SVGAttributes } from 'react';
import { cx } from '../../internal/cx';

export interface SparklineProps extends Omit<SVGAttributes<SVGSVGElement>, 'values' | 'color'> {
  /** number[]; at least two values, otherwise nothing renders */
  values: number[];
  /** Width in px; default 72 */
  width?: number;
  /** Height in px; default 22 */
  height?: number;
  /** CSS colour, use a token (`var(--co-danger)` for a flagged value); default var(--co-primary) */
  color?: string;
  /** Start of the accessible name, followed by the values; default "Trend" */
  label?: string;
}

/** Sparkline is a tiny trend line for a vital sign or lab value, with the last point marked. */
export const Sparkline = forwardRef<SVGSVGElement, SparklineProps>(function Sparkline(
  { values, width = 72, height = 22, color = 'var(--co-primary)', label = 'Trend', className, ...rest },
  ref
) {
  if (values.length < 2) return null;
  const w = width;
  const h = height;
  const mn = Math.min(...values);
  const mx = Math.max(...values);
  const rg = mx - mn || 1;
  const yOf = (v: number) => h - 2 - ((v - mn) / rg) * (h - 4);
  const pts = values.map((v, i) => `${(i * (w - 4)) / (values.length - 1) + 2},${yOf(v)}`).join(' ');
  return (
    <svg
      ref={ref}
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={`${label}: ${values.join(', ')}`}
      className={cx('co-spark', className)}
      {...rest}
    >
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} />
      <circle cx={w - 2} cy={yOf(values[values.length - 1]!)} r={2.5} fill={color} />
    </svg>
  );
});
