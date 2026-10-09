import { forwardRef, type HTMLAttributes, type MouseEvent, type ReactNode, type Ref } from 'react';
import { cx } from '../../internal/cx';
import { ProgressBar, type ProgressTone } from '../ProgressBar/ProgressBar';
import { Skeleton } from '../Skeleton/Skeleton';

/** Usage meter shown under a StatCard value. */
export interface StatCardMeter {
  /** Amount used. */
  value: number;
  /** Allowance. */
  max: number;
  /** Bar tone; default 'primary' */
  tone?: ProgressTone;
}

export interface StatCardProps extends Omit<HTMLAttributes<HTMLElement>, 'onClick'> {
  /** Label, shown uppercase. Required */
  label: string;
  /** The number. Required */
  value: ReactNode;
  /** Context line: what the number counts and over what period; default none */
  sub?: ReactNode;
  /** Trend text, such as "1.4 pts"; default none */
  trend?: string;
  /** 'up' | 'down': arrow before the trend; default 'up' */
  trendDir?: 'up' | 'down';
  /** true colours the trend green, false red; default none (neutral) */
  trendGood?: boolean;
  /** Selected filter state (with onClick); default false */
  selected?: boolean;
  /** Makes the card a toggle button (aria-pressed); default none */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** `{value, max, tone?}` usage meter under the value; default none */
  meter?: StatCardMeter;
  /** Shows a skeleton instead of the value; default false */
  loading?: boolean;
}

/** StatCard shows one number with its label and context, and can act as a filter button. */
export const StatCard = forwardRef<HTMLElement, StatCardProps>(function StatCard(
  { label, value, sub, trend, trendDir = 'up', trendGood, selected = false, onClick, meter, loading = false, className, ...rest },
  ref
) {
  const cls = cx('co-kpi', selected && 'is-on', onClick && 'is-btn', className);
  const content = (
    <>
      <span className="co-kl">{label}</span>
      {loading ? (
        <Skeleton variant="text" width="60%" label={`Loading ${label}`} />
      ) : (
        <span className="co-kv">{value}</span>
      )}
      {sub || trend ? (
        <span className="co-ks">
          {trend ? (
            <span className={cx('co-trend', trendGood === false ? 'is-bad' : trendGood ? 'is-good' : undefined)}>
              {(trendDir === 'down' ? '↓ ' : '↑ ') + trend}
            </span>
          ) : null}
          {trend && sub ? ' ' : null}
          {sub}
        </span>
      ) : null}
      {meter ? <ProgressBar value={meter.value} max={meter.max} compact label={label} tone={meter.tone} /> : null}
    </>
  );
  if (onClick) {
    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        type="button"
        className={cls}
        aria-pressed={selected}
        onClick={onClick}
        {...rest}
      >
        {content}
      </button>
    );
  }
  return (
    <div ref={ref as Ref<HTMLDivElement>} className={cls} {...rest}>
      {content}
    </div>
  );
});
