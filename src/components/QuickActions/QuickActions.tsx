import { forwardRef, type HTMLAttributes, type MouseEvent } from 'react';
import { cx } from '../../internal/cx';
import { Icon, type IconName } from '../Icon/Icon';

/** One tile. */
export interface QuickActionItem {
  /** Tile label, e.g. "Book Visit" */
  label: string;
  /** Icon name */
  icon: IconName;
  /** Link target; without it the tile is a button; default none */
  href?: string;
  /** Count shown on the tile (unread messages, results); default none */
  badge?: number | string;
  /** Called when the tile is chosen; default none */
  onClick?: (event: MouseEvent<HTMLElement>) => void;
}

export interface QuickActionsProps extends HTMLAttributes<HTMLDivElement> {
  /** Array<{label, icon, href?, badge?, onClick?}> */
  items: QuickActionItem[];
}

/** QuickActions is the 3-column grid of big icon tiles on phone and portal home screens. */
export const QuickActions = forwardRef<HTMLDivElement, QuickActionsProps>(function QuickActions(
  { items, className, ...rest },
  ref
) {
  return (
    <div ref={ref} className={cx('co-qa', className)} {...rest}>
      {items.map((q) => {
        const content = (
          <>
            <span className="co-qb-ic">
              <Icon name={q.icon} size={18} />
            </span>
            {q.label}
            {q.badge != null && q.badge !== 0 && q.badge !== '' ? (
              <span className="co-count" style={{ position: 'static' }}>
                <span className="co-sr">, </span>
                {q.badge}
              </span>
            ) : null}
          </>
        );
        return q.href ? (
          <a key={q.label} href={q.href} className="co-qb" onClick={q.onClick}>
            {content}
          </a>
        ) : (
          <button key={q.label} type="button" className="co-qb" onClick={q.onClick}>
            {content}
          </button>
        );
      })}
    </div>
  );
});
