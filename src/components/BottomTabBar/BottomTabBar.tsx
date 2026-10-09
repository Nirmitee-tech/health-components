import { forwardRef, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { Icon, type IconName } from '../Icon/Icon';

/** One bottom tab. */
export interface BottomTabBarItem {
  /** Tab label; also what `active` matches */
  label: string;
  /** Icon; default 'grid' */
  icon?: IconName;
  /** Link; default none (click only calls `onNavigate`) */
  href?: string;
  /** Unread count; default none */
  badge?: ReactNode;
}

export interface BottomTabBarProps extends HTMLAttributes<HTMLElement> {
  /** Four or five tabs. Required. */
  items: BottomTabBarItem[];
  /** Label of the current tab; default none */
  active?: string;
  /** Landmark name; default "Main" */
  label?: string;
  /** Called when a tab is clicked; default none */
  onNavigate?: (item: BottomTabBarItem, event: MouseEvent<HTMLAnchorElement>) => void;
}

/** BottomTabBar is the phone and portal bottom navigation with four or five tabs and badges. */
export const BottomTabBar = forwardRef<HTMLElement, BottomTabBarProps>(function BottomTabBar(
  { items, active, label = 'Main', onNavigate, className, style, ...rest },
  ref
) {
  return (
    <nav
      ref={ref}
      className={cx('co-bnav', className)}
      aria-label={label}
      style={{ gridTemplateColumns: `repeat(${items.length},1fr)`, ...style }}
      {...rest}
    >
      {items.map((it) => {
        const on = it.label === active;
        const hasBadge = it.badge != null && it.badge !== '' && it.badge !== 0;
        return (
          <a
            key={it.label}
            href={it.href ?? '#'}
            className={cx('co-bn', on && 'is-on')}
            aria-current={on ? 'page' : undefined}
            onClick={(e) => {
              if (!it.href) e.preventDefault();
              onNavigate?.(it, e);
            }}
          >
            <span className="co-bn-ic">
              <Icon name={it.icon ?? 'grid'} size={20} />
            </span>
            {it.label}
            {hasBadge ? (
              <>
                <span className="co-bn-bdg" aria-hidden="true">
                  {it.badge}
                </span>
                <span className="co-sr">{`, ${String(it.badge)} new`}</span>
              </>
            ) : null}
          </a>
        );
      })}
    </nav>
  );
});
