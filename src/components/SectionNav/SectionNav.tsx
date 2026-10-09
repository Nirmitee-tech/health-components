import { forwardRef, type HTMLAttributes, type MouseEvent } from 'react';
import { cx } from '../../internal/cx';

/** A section: a plain label, or a label with a link and a count. */
export type SectionNavItem = string | { label: string; href?: string; count?: number | string };

export interface SectionNavProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Sections, in the same order for every record. Required. */
  items: SectionNavItem[];
  /** Label of the current section; default none */
  active?: string;
  /** Landmark name; default "Section menu" */
  label?: string;
  /** Called with the clicked section label. Items without `href` do not navigate; default none */
  onChange?: (label: string) => void;
}

/** SectionNav is the left list of sections inside a record, such as the 20 sections of a patient chart. */
export const SectionNav = forwardRef<HTMLElement, SectionNavProps>(function SectionNav(
  { items, active, label = 'Section menu', onChange, className, ...rest },
  ref
) {
  return (
    <nav ref={ref} className={cx('co-snavs', className)} aria-label={label} {...rest}>
      {items.map((it) => {
        const o = typeof it === 'string' ? { label: it } : it;
        const on = o.label === active;
        return (
          <a
            key={o.label}
            href={o.href ?? '#'}
            className={cx('co-snav', on && 'is-on')}
            aria-current={on ? 'page' : undefined}
            onClick={(e: MouseEvent<HTMLAnchorElement>) => {
              if (!o.href) e.preventDefault();
              onChange?.(o.label);
            }}
          >
            {o.label}
            {o.count != null ? <span className="co-tabn">{o.count}</span> : null}
          </a>
        );
      })}
    </nav>
  );
});
