import { Fragment, forwardRef, type HTMLAttributes, type MouseEvent } from 'react';
import { cx } from '../../internal/cx';
import { Icon } from '../Icon/Icon';

/** One level of the path. The last item is the current page and is not a link. */
export interface BreadcrumbItem {
  /** Level name */
  label: string;
  /** Link to the level; default "#" */
  href?: string;
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  /** Path from the top level to the current page. Required. */
  items: BreadcrumbItem[];
  /** Landmark name; default "Breadcrumb" */
  label?: string;
  /** Called when a level is clicked (client-side routing); default none */
  onNavigate?: (item: BreadcrumbItem, event: MouseEvent<HTMLAnchorElement>) => void;
}

/** Breadcrumb shows where a deep screen sits and links back up the path. */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { items, label = 'Breadcrumb', onNavigate, className, ...rest },
  ref
) {
  return (
    <nav ref={ref} className={cx('co-crumb', className)} aria-label={label} {...rest}>
      <ol>
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${i}-${it.label}`}>
              {last ? (
                <span aria-current="page">{it.label}</span>
              ) : (
                <Fragment>
                  <a href={it.href ?? '#'} onClick={onNavigate ? (e) => onNavigate(it, e) : undefined}>
                    {it.label}
                  </a>
                  <Icon name="chevron-right" size={14} />
                </Fragment>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});
