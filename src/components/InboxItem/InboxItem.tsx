import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Icon, type IconName } from '../Icon/Icon';

/** What the inbox item is about. */
export type InboxItemKind = 'result' | 'refill' | 'message' | 'cosign' | 'imaging' | 'fax';
/** Priority of an inbox item; 'Normal' shows no badge. */
export type InboxItemPriority = 'Normal' | 'Urgent' | 'Critical';

/** One inbox entry. */
export interface InboxItemData {
  /** 'result' | 'refill' | 'message' | 'cosign' | 'imaging' | 'fax'; unknown kinds show as message */
  kind: InboxItemKind;
  /** Patient name */
  patient: string;
  /** What arrived ("Potassium 6.1 mmol/L (critical)") */
  title: string;
  /** Sender or source ("Quest . BMP") */
  from: string;
  /** When it arrived ("08:42", "Yesterday") */
  received: string;
  /** 'Normal' | 'Urgent' | 'Critical'; default 'Normal' */
  priority?: InboxItemPriority;
  /** Bold with a primary edge; default false */
  unread?: boolean;
  /** Inline action labels; the first is primary. Default ['Open'] */
  actions?: string[];
}

export interface InboxItemProps extends HTMLAttributes<HTMLDivElement> {
  /** {kind, patient, title, from, received, priority?, unread?, actions?: string[]}; required */
  item: InboxItemData;
  /** Called with the action label when an action button is pressed; default none */
  onAction?: (action: string, item: InboxItemData) => void;
}

const KINDS: Record<InboxItemKind, [IconName, string]> = {
  result: ['flask', 'Result'],
  refill: ['pill', 'Refill'],
  message: ['message', 'Message'],
  cosign: ['file', 'Co-sign'],
  imaging: ['camera', 'Imaging'],
  fax: ['inbox', 'Fax'],
};

/** InboxItem is one inbox card for a result, refill, message, co-sign, imaging or fax, with priority and inline actions. */
export const InboxItem = forwardRef<HTMLDivElement, InboxItemProps>(function InboxItem(
  { item, onAction, className, ...rest },
  ref
) {
  const [icon, kindLabel] = KINDS[item.kind] ?? KINDS.message;
  const critical = item.priority === 'Critical';
  const actions = item.actions ?? ['Open'];
  return (
    <div
      ref={ref}
      className={cx('co-inbox', item.unread && 'is-unread', critical && 'is-crit', className)}
      {...rest}
    >
      <span className="co-inbox-ic">
        <Icon name={icon} size={18} />
      </span>
      <div className="co-li-b">
        <div className="co-row co-gap-6">
          <b>{item.patient}</b>
          <Badge size="sm">{kindLabel}</Badge>
          {item.priority && item.priority !== 'Normal' ? (
            <Badge size="sm" tone={critical ? 'danger' : 'warning'} icon={critical ? 'alert' : undefined}>
              {item.priority}
            </Badge>
          ) : null}
          {item.unread ? <span className="co-sr">Unread</span> : null}
          <span className="co-mi-s co-ml">{item.received}</span>
        </div>
        <span>{item.title}</span>
        <span className="co-mi-s">{item.from}</span>
      </div>
      <div className="co-row co-gap-6">
        {actions.map((a, k) => (
          <Button
            key={a}
            size="sm"
            variant={k === 0 ? 'primary' : 'secondary'}
            aria-label={`${a}: ${item.patient}, ${item.title}`}
            onClick={() => onAction?.(a, item)}
          >
            {a}
          </Button>
        ))}
      </div>
    </div>
  );
});
