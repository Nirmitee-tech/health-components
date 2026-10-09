import { forwardRef, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { Icon, type IconName } from '../Icon/Icon';

/** A rail icon. */
export interface IconRailLink {
  /** Name, used as the aria-label and tooltip; also what `active` matches */
  label: string;
  /** Icon; default 'grid' */
  icon?: IconName;
  /** Link; default none (click only calls `onNavigate`) */
  href?: string;
  /** Count bubble; default none */
  badge?: ReactNode;
  separator?: never;
}

/** A separator between groups. */
export interface IconRailSeparator {
  separator: true;
}

export type IconRailItem = IconRailLink | IconRailSeparator;

export interface IconRailProps extends HTMLAttributes<HTMLElement> {
  /** Icons and separators, in the sidebar's group order. Required. */
  items: IconRailItem[];
  /** Label of the current item; default none */
  active?: string;
  /** Force one tooltip open, for docs; default none */
  showTip?: string;
  /** Called when an item is clicked; default none */
  onNavigate?: (item: IconRailLink, event: MouseEvent<HTMLAnchorElement>) => void;
  /** Rounded and bordered, for docs; default false */
  inline?: boolean;
}

/** IconRail is the Focus Rail style's 64px slate icon rail with tooltips, leaving the most room for the chart. */
export const IconRail = forwardRef<HTMLElement, IconRailProps>(function IconRail(
  { items, active, showTip, onNavigate, inline = false, className, ...rest },
  ref
) {
  return (
    <nav ref={ref} className={cx('co-rail', inline && 'co-inline', className)} aria-label="Main" {...rest}>
      <span className="co-logo-m co-rail-logo" aria-hidden="true">
        C
      </span>
      {items.map((it, i) => {
        if ('separator' in it && it.separator) return <span key={`s${i}`} className="co-rail-sep" role="separator" />;
        const link = it as IconRailLink;
        const on = link.label === active;
        const hasBadge = link.badge != null && link.badge !== '' && link.badge !== 0;
        return (
          <a
            key={link.label}
            href={link.href ?? '#'}
            className={cx('co-ri', on && 'is-on')}
            aria-label={hasBadge ? `${link.label}, ${String(link.badge)} new` : link.label}
            aria-current={on ? 'page' : undefined}
            onClick={(e) => {
              if (!link.href) e.preventDefault();
              onNavigate?.(link, e);
            }}
          >
            <Icon name={link.icon ?? 'grid'} size={20} />
            {hasBadge ? (
              <span className="co-count" aria-hidden="true">
                {link.badge}
              </span>
            ) : null}
            <span className={cx('co-rtip', showTip === link.label && 'is-open')} aria-hidden="true">
              {link.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
});
