import { forwardRef, type HTMLAttributes } from 'react';
import { dose, isFiniteNumber, number, tallMan } from '../../clinical';
import { cx } from '../../internal/cx';
import { Badge } from '../Badge/Badge';

export type DoseDisplayLayout = 'stacked' | 'inline';

export interface DoseDisplayProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Drug name; tall-man lettering is applied automatically; required */
  drug: string;
  /** Dose amount (a number, or a string such as '.5' that is parsed); required */
  amount: number | string;
  /** Dose unit: mg, mcg, g, units, mL, mEq... ('U', 'IU', 'ug', 'cc' are rewritten safely); required */
  unit: string;
  /** Product strength; default none */
  strength?: number;
  /** Strength unit; default `unit` */
  strengthUnit?: string;
  /** Dose form ('tablet', 'per 5 mL suspension'); default none */
  form?: string;
  /** Route ('PO', 'IV', 'subcut'); default none */
  route?: string;
  /** Frequency ('every 6 hours'); default none */
  frequency?: string;
  /** As needed; default false */
  prn?: boolean;
  /** PRN reason ('itching'); default none */
  prnReason?: string;
  /** Dose per kg, shown with `weightKg` as the calculation; default none */
  perKg?: number;
  /** Weight used for the calculation, kg; default none */
  weightKg?: number;
  /** ISMP high-alert medication: red High-alert badge; default false */
  highAlert?: boolean;
  /** Look-alike drug name: amber badge; default none */
  lookAlike?: string;
  /** 'stacked' (drug above, dose and sig below) | 'inline' (one line for tables); default 'stacked' */
  layout?: DoseDisplayLayout;
}

/**
 * DoseDisplay writes a medication dose the ISMP way: tall-man drug names, leading zero, no trailing zero, and
 * units, mcg and mL spelled safely.
 */
export const DoseDisplay = forwardRef<HTMLSpanElement, DoseDisplayProps>(function DoseDisplay(
  {
    drug,
    amount,
    unit,
    strength,
    strengthUnit,
    form,
    route,
    frequency,
    prn = false,
    prnReason,
    perKg,
    weightKg,
    highAlert = false,
    lookAlike,
    layout = 'stacked',
    className,
    ...rest
  },
  ref
) {
  const amt = dose(amount, unit);
  const perKgText =
    isFiniteNumber(perKg) && isFiniteNumber(weightKg)
      ? dose(perKg, unit + '/kg') + ' × ' + number(weightKg, 1) + ' kg'
      : null;
  const sig = [route, frequency, prn ? 'as needed' + (prnReason ? ' for ' + prnReason : '') : null].filter(Boolean).join(' ');
  const name = (
    <span className="co-dose-n">
      {tallMan(drug)}
      {strength != null ? ' ' + dose(strength, strengthUnit || unit) + (form ? ' ' + form : '') : null}
    </span>
  );

  return (
    <span ref={ref} className={cx('co-dose', className)} {...rest}>
      {layout === 'inline' ? (
        <span>
          {name}
          {' · '}
          <span className="co-dose-a">{amt}</span>
          {sig ? ' ' + sig : null}
        </span>
      ) : (
        <>
          <span className="co-row co-dose-h">
            {name}
            {highAlert ? (
              <Badge tone="danger" size="sm" icon="alert">
                High-alert
              </Badge>
            ) : null}
            {lookAlike ? (
              <Badge tone="warning" size="sm">
                {'Look-alike: ' + tallMan(lookAlike)}
              </Badge>
            ) : null}
          </span>
          <span className="co-dose-sig">
            <span className="co-dose-a">{amt}</span>
            {sig ? ' ' + sig : null}
            {perKgText ? <span className="co-cv-meta">{' (' + perKgText + ')'}</span> : null}
          </span>
        </>
      )}
    </span>
  );
});
