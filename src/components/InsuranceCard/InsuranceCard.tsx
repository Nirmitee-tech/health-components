import { forwardRef, type HTMLAttributes, type MouseEvent } from 'react';
import { cx } from '../../internal/cx';
import { useControllableState } from '../../internal/hooks';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { DescriptionList } from '../DescriptionList/DescriptionList';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';

export type InsuranceCardSide = 'front' | 'back';

export interface InsuranceCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Payer name, e.g. "Aetna" (front); default none */
  payer?: string;
  /** Plan name, e.g. "Open Access PPO" (front); default none */
  plan?: string;
  /** Member name as printed on the card (front); default none */
  member?: string;
  /** Member ID (front); default none */
  memberId?: string;
  /** Group number (front); default none */
  group?: string;
  /** Copay line, e.g. "PCP $25 . Spec $50" (front); default none */
  copay?: string;
  /** Rx BIN / PCN (front); default none */
  rx?: string;
  /** Payer ID for electronic claims (back); default none */
  payerId?: string;
  /** Where claims go (back); default none */
  claimsAddress?: string;
  /** Provider services phone line (back); default none */
  phone?: string;
  /** Pre-certification rule or phone (back); default none */
  precert?: string;
  /** Controlled side shown: 'front' | 'back'; default undefined (uncontrolled) */
  side?: InsuranceCardSide;
  /** Initial side when uncontrolled; default 'front' */
  defaultSide?: InsuranceCardSide;
  /** Called when the user flips the card */
  onSideChange?: (side: InsuranceCardSide) => void;
  /** Scan date; shows a Scanned badge instead of the Scan Card button; default none */
  scanned?: string;
  /** Called when Scan Card is pressed; default none */
  onScan?: (event: MouseEvent<HTMLButtonElement>) => void;
}

const SIDES = [
  { value: 'front', label: 'Front' },
  { value: 'back', label: 'Back' },
];

/** InsuranceCard shows the front and back of a member card with the fields billing needs and the scan state. */
export const InsuranceCard = forwardRef<HTMLDivElement, InsuranceCardProps>(function InsuranceCard(
  {
    payer,
    plan,
    member,
    memberId,
    group,
    copay,
    rx,
    payerId,
    claimsAddress,
    phone,
    precert,
    side: sideProp,
    defaultSide = 'front',
    onSideChange,
    scanned,
    onScan,
    className,
    ...rest
  },
  ref
) {
  const [side, setSide] = useControllableState<InsuranceCardSide>(sideProp, defaultSide, onSideChange);
  return (
    <div ref={ref} className={cx('co-inscard-wrap', className)} {...rest}>
      <div
        className={cx('co-inscard', side === 'back' && 'is-back')}
        role="group"
        aria-label={`${payer ?? 'Insurance'} card, ${side}`}
      >
        {side === 'front' ? (
          <>
            <div className="co-row">
              <b>{payer}</b>
              <span className="co-ml co-mi-s">{plan}</span>
            </div>
            <DescriptionList
              compact
              items={[
                ['Member', member],
                ['Member ID', memberId],
                ['Group', group],
                ['Copay', copay],
                ['Rx BIN / PCN', rx],
              ]}
            />
          </>
        ) : (
          <>
            <b>Claims and provider services</b>
            <DescriptionList
              compact
              items={[
                ['Payer ID', payerId],
                ['Claims to', claimsAddress],
                ['Provider line', phone],
                ['Pre-cert', precert],
              ]}
            />
          </>
        )}
      </div>
      <div className="co-row co-gap-8">
        <SegmentedControl
          size="sm"
          label="Card side"
          value={side}
          onChange={(v) => setSide(v as InsuranceCardSide)}
          options={SIDES}
        />
        {scanned ? (
          <Badge tone="success" icon="camera">
            {`Scanned ${scanned}`}
          </Badge>
        ) : (
          <Button size="sm" iconLeft="camera" onClick={onScan}>
            Scan Card
          </Button>
        )}
      </div>
    </div>
  );
});
