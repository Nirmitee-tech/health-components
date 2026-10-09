import { forwardRef, type AnchorHTMLAttributes, type HTMLAttributes, type MouseEvent, type ReactNode, type Ref } from 'react';
import { cx } from '../../internal/cx';
import { Icon } from '../Icon/Icon';

export interface ListRowProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'onClick'> {
  /** Main line */
  title: string;
  /** Second line; default none */
  meta?: string;
  /** Before the text (Avatar, Icon); default none */
  leading?: ReactNode;
  /** After the text (StatusTag, time); must not be interactive when the row is; default none */
  trailing?: ReactNode;
  /** Makes the row a button with a chevron; default none */
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  /** Makes the row a link with a chevron; default none */
  href?: string;
  /** Link target when `href` is set */
  target?: AnchorHTMLAttributes<HTMLAnchorElement>['target'];
}

/** ListRow is the 56px tappable row used for lists on phone and portal screens. */
export const ListRow = forwardRef<HTMLElement, ListRowProps>(function ListRow(
  { title, meta, leading, trailing, onClick, href, target, className, ...rest },
  ref
) {
  const cls = cx('co-li', 'co-rowb', className);
  const interactive = !!onClick || href !== undefined;
  const body = (Tag: 'div' | 'span') => (
    <>
      {leading}
      <Tag className="co-li-b">
        <b>{title}</b>
        {meta ? <span className="co-mi-s">{meta}</span> : null}
      </Tag>
      {trailing}
      {interactive ? <Icon name="chevron-right" size={16} /> : null}
    </>
  );
  if (href !== undefined) {
    return (
      <a
        ref={ref as Ref<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        className={cls}
        onClick={onClick}
        {...rest}
      >
        {body('span')}
      </a>
    );
  }
  if (onClick) {
    return (
      <button ref={ref as Ref<HTMLButtonElement>} type="button" className={cls} onClick={onClick} {...rest}>
        {body('span')}
      </button>
    );
  }
  return (
    <div ref={ref as Ref<HTMLDivElement>} className={cls} {...rest}>
      {body('div')}
    </div>
  );
});
