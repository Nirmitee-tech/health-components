import { forwardRef, type HTMLAttributes } from 'react';
import { isFiniteNumber, money, round } from '../../clinical';
import { cx } from '../../internal/cx';

export interface MoneyDisplayProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Amount in US dollars; null shows an en dash (no amount); required */
  value: number | null;
  /** Bold, for balance due; default false */
  emphasis?: boolean;
  /** 'start' | 'end' (right aligned for columns); default 'start' */
  align?: 'start' | 'end';
  /** Appended to the spoken text ('contractual adjustment'); default none */
  label?: string;
  /** Column width in px when `align` is 'end'; default 90 */
  minWidth?: number;
}

/**
 * MoneyDisplay shows US dollar amounts with two decimals, grouping and tabular figures, and negative adjustments in
 * parentheses (spoken as "minus").
 */
export const MoneyDisplay = forwardRef<HTMLSpanElement, MoneyDisplayProps>(function MoneyDisplay(
  { value, emphasis = false, align = 'start', label, minWidth, className, style, ...rest },
  ref
) {
  const has = isFiniteNumber(value);
  const neg = has && round(value, 2) < 0;
  const spoken = has ? (neg ? 'minus ' : '') + money(Math.abs(value)) + (label ? ' ' + label : '') : 'No amount' + (label ? ' ' + label : '');
  return (
    <span
      ref={ref}
      className={cx('co-money', neg && 'co-money-neg', emphasis && 'co-money-due', align === 'end' && 'co-money-end', className)}
      style={align === 'end' ? { minWidth: minWidth ?? 90, ...style } : style}
      {...rest}
    >
      <span aria-hidden="true">{has ? money(value) : '–'}</span>
      <span className="co-cv-sr">{spoken}</span>
    </span>
  );
});
