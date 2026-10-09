import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { Avatar } from '../Avatar/Avatar';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { KebabMenu, type MenuItem } from '../Menu/Menu';

/** One waitlisted patient. */
export interface WaitlistItem {
  /** Patient name */
  patient: string;
  /** Visit type, e.g. "Annual Wellness" */
  type: string;
  /** Wanted provider, or "Any provider" */
  provider: string;
  /** Wanted window, e.g. "mornings this week" */
  window: string;
  /** When the patient joined the list */
  since: string;
  /** Priority tag, e.g. "Same day"; default none */
  priority?: string;
  /** A matching opening, e.g. "Thu 10/09 9:40 AM"; default none (No match yet) */
  match?: string;
}

export interface WaitlistRowProps extends HTMLAttributes<HTMLDivElement> {
  /** The waitlist entry. Required */
  item: WaitlistItem;
  /** Called when Offer Slot is pressed (enabled only with a match); default none */
  onOffer?: (item: WaitlistItem) => void;
  /** Row menu: Text Patient; default none */
  onText?: (item: WaitlistItem) => void;
  /** Row menu: Edit Preferences; default none */
  onEdit?: (item: WaitlistItem) => void;
  /** Row menu: Remove from Waitlist; default none */
  onRemove?: (item: WaitlistItem) => void;
}

/** WaitlistRow is one waitlisted patient with wanted window, priority, a matched opening and Offer Slot. */
export const WaitlistRow = forwardRef<HTMLDivElement, WaitlistRowProps>(function WaitlistRow(
  { item: w, onOffer, onText, onEdit, onRemove, className, ...rest },
  ref
) {
  const items: MenuItem[] = [
    { label: 'Text Patient', onSelect: () => onText?.(w) },
    { label: 'Edit Preferences', onSelect: () => onEdit?.(w) },
    { divider: true },
    { label: 'Remove from Waitlist', danger: true, onSelect: () => onRemove?.(w) },
  ];
  return (
    <div ref={ref} className={cx('co-li co-wait', className)} {...rest}>
      <Avatar name={w.patient} size="sm" aria-hidden="true" />
      <div className="co-li-b">
        <b>{w.patient}</b>
        <span className="co-mi-s">{[w.type, w.provider, `Wants ${w.window}`, `On list ${w.since}`].join(' . ')}</span>
      </div>
      {w.priority ? <Badge tone="danger">{w.priority}</Badge> : null}
      {w.match ? (
        <Badge tone="success" icon="calendar">
          {`Opening: ${w.match}`}
        </Badge>
      ) : (
        <Badge>No match yet</Badge>
      )}
      <Button
        size="sm"
        variant={w.match ? 'primary' : 'secondary'}
        disabled={!w.match}
        aria-label={`Offer Slot to ${w.patient}`}
        onClick={() => onOffer?.(w)}
      >
        Offer Slot
      </Button>
      <KebabMenu label={`Actions for ${w.patient}`} items={items} />
    </div>
  );
});
