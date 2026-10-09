import { forwardRef, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { useControllableState } from '../../internal/hooks';
import { Icon, type IconName } from '../Icon/Icon';

/** One navigation item. */
export interface SidebarNavItem {
  /** Item label; also what `active` matches */
  label: string;
  /** Icon; default 'grid' */
  icon?: IconName;
  /** Link; without it the click only calls `onNavigate`; default none */
  href?: string;
  /** Count, such as unread Inbox items; default none */
  badge?: ReactNode;
  /** The role can only view this area: shows a lock; default false */
  locked?: boolean;
}

/** A labelled group: Clinical, Front office, Revenue, Insights, Admin. */
export interface SidebarNavGroup {
  /** Group label, shown in small caps when expanded */
  label: string;
  /** Items in the group */
  items: SidebarNavItem[];
}

export interface SidebarNavProps extends HTMLAttributes<HTMLElement> {
  /** Groups in a fixed order; only the items change per role. Required. */
  groups: SidebarNavGroup[];
  /** Label of the current item; default none */
  active?: string;
  /** Collapsed to the 64px icon strip (controlled); default uncontrolled */
  collapsed?: boolean;
  /** Initially collapsed when uncontrolled; default false */
  defaultCollapsed?: boolean;
  /** Product name next to the logo mark; default "CareOS" */
  product?: string;
  /** Called with the new collapsed state; default none */
  onCollapse?: (collapsed: boolean) => void;
  /** Called when an item is clicked; default none */
  onNavigate?: (item: SidebarNavItem, event: MouseEvent<HTMLAnchorElement>) => void;
  /** Bordered, for docs; default false */
  inline?: boolean;
}

/** SidebarNav is the Clinical Sidebar style's grouped left navigation, 240px wide, collapsing to a 64px icon strip. */
export const SidebarNav = forwardRef<HTMLElement, SidebarNavProps>(function SidebarNav(
  {
    groups,
    active,
    collapsed,
    defaultCollapsed = false,
    product = 'CareOS',
    onCollapse,
    onNavigate,
    inline = false,
    className,
    ...rest
  },
  ref
) {
  const [col, setCol] = useControllableState(collapsed, defaultCollapsed, onCollapse);
  return (
    <nav
      ref={ref}
      className={cx('co-side', col && 'is-col', inline && 'co-inline', className)}
      aria-label="Main"
      {...rest}
    >
      <div className="co-side-h">
        <span className="co-logo-m" aria-hidden="true">
          C
        </span>
        {col ? null : <span className="co-logo">{product}</span>}
      </div>
      {groups.map((g) => (
        <div key={g.label} className="co-grp">
          {col ? null : <div className="co-gl">{g.label}</div>}
          {g.items.map((it) => {
            const on = it.label === active;
            return (
              <a
                key={it.label}
                href={it.href ?? '#'}
                className={cx('co-ni', on && 'is-on')}
                aria-current={on ? 'page' : undefined}
                title={col ? it.label : undefined}
                onClick={(e) => {
                  if (!it.href) e.preventDefault();
                  onNavigate?.(it, e);
                }}
              >
                <Icon name={it.icon ?? 'grid'} size={18} />
                {col ? <span className="co-sr">{it.label}</span> : <span className="co-nl">{it.label}</span>}
                {it.badge != null && it.badge !== '' && it.badge !== 0 && !col ? (
                  <span className="co-ni-b">{it.badge}</span>
                ) : null}
                {it.locked && !col ? <Icon name="lock" size={12} className="co-ml" label="View only" /> : null}
              </a>
            );
          })}
        </div>
      ))}
      <button
        type="button"
        className="co-colb"
        aria-label={col ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-expanded={!col}
        onClick={() => setCol(!col)}
      >
        <Icon name={col ? 'expand' : 'collapse'} size={16} />
        {col ? null : 'Collapse'}
      </button>
    </nav>
  );
});
