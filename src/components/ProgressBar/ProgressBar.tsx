import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../internal/cx';

export type ProgressTone = 'primary' | 'success' | 'warning' | 'danger' | 'ai';

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Current value. Required */
  value: number;
  /** Maximum value; default 100 */
  max?: number;
  /** Visible label and accessible name. Required */
  label: string;
  /** Unit word: "visits" gives "12 of 20 visits used"; default none (percent) */
  unit?: string;
  /** Value text shown and announced; default auto (percent, or "12 of 20 visits used") */
  valueText?: string;
  /** Uses role meter (an amount used of an allowance) instead of progressbar; default false */
  meter?: boolean;
  /** [warnPct, dangerPct]: the bar turns warning and danger at these percentages; default none */
  thresholds?: readonly [warn: number, danger: number];
  /** 'primary' | 'success' | 'warning' | 'danger' | 'ai'; default auto (from thresholds, else primary) */
  tone?: ProgressTone;
  /** Bar only, without the header and helper; default false */
  compact?: boolean;
  /** 'md' 8px | 'lg' 12px bar; default 'md' */
  size?: 'md' | 'lg';
  /** Helper text under the bar; default none */
  helper?: ReactNode;
}

/** ProgressBar shows progress of a task or how much of an allowance is used, such as PA units used 12 of 20. */
export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(function ProgressBar(
  { value, max = 100, label, unit, valueText, meter = false, thresholds, tone, compact = false, size = 'md', helper, className, ...rest },
  ref
) {
  const safeMax = max > 0 ? max : 100;
  const v = Math.max(0, Math.min(Number.isFinite(value) ? value : 0, safeMax));
  const pct = Math.round((v / safeMax) * 100);
  const t: ProgressTone =
    tone ?? (thresholds ? (pct >= thresholds[1] ? 'danger' : pct >= thresholds[0] ? 'warning' : 'primary') : 'primary');
  const shown = valueText ?? (unit ? `${v} of ${safeMax} ${unit} used` : `${pct}%`);
  const announced = valueText ?? (unit ? `${v} of ${safeMax} ${unit}` : `${pct}%`);
  return (
    <div ref={ref} className={cx('co-prog', compact && 'co-prog-compact', className)} {...rest}>
      {compact ? null : (
        <div className="co-prog-h">
          <span className="co-lbl0">{label}</span>
          <span className="co-prog-v">{shown}</span>
        </div>
      )}
      <div
        className={cx('co-bar', size === 'lg' && 'co-bar-lg')}
        role={meter ? 'meter' : 'progressbar'}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={v}
        aria-valuetext={announced}
      >
        <span className={`co-bar-${t}`} style={{ width: `${pct}%` }} />
      </div>
      {helper && !compact ? <div className="co-help">{helper}</div> : null}
    </div>
  );
});
