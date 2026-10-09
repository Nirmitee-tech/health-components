/* Money (USD). Ported from CareOS.fmt (ext: clinical-values). */
import { isFiniteNumber, number, round } from './units';

/** Options for money. */
export interface MoneyOptions {
  /** Negative as −$45.00 instead of ($45.00); default false. */
  minus?: boolean;
}

/**
 * US dollars with two decimals and grouping: '$1,234.50'. Negatives in parentheses '($45.00)' (or with a real
 * minus sign when `minus`). An amount that rounds to −0.00 shows '$0.00'. Not a number gives ''.
 */
export function money(v: number | null | undefined, o?: MoneyOptions): string {
  if (!isFiniteNumber(v)) return '';
  const s = '$' + number(Math.abs(v), 2);
  if (round(v, 2) < 0) return o && o.minus ? '−' + s : '(' + s + ')';
  return s;
}
