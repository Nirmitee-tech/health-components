import { forwardRef, type ElementType, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { useDomId } from '../../internal/hooks';

export type CardPadding = 'default' | 'compact' | 'none';

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Heading, rendered as an h2; default none */
  title?: ReactNode;
  /** Line under the title; default none */
  subtitle?: ReactNode;
  /** Header actions (one primary at most); default none */
  actions?: ReactNode;
  /** Footer content; default none */
  footer?: ReactNode;
  /** Border instead of shadow; default false */
  flat?: boolean;
  /** 'default' | 'compact' (10px) | 'none' (edge-to-edge tables); default 'default' */
  padding?: CardPadding;
  /** Root tag name; default 'section' */
  as?: ElementType;
  /** Card body. */
  children?: ReactNode;
}

const LANDMARK_TAGS = ['section', 'article', 'aside', 'form'];

/** Card is the white container every screen section sits in, with an optional title, actions and footer. */
export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  { title, subtitle, actions, footer, flat = false, padding = 'default', as: Tag = 'section', className, children, id, ...rest },
  ref
) {
  const titleId = useDomId('co-card-title', id ? `${id}-title` : undefined);
  const hasTitle = title != null && title !== '';
  const landmark = typeof Tag === 'string' && LANDMARK_TAGS.includes(Tag);
  return (
    <Tag
      ref={ref}
      id={id}
      className={cx(
        'co-card',
        flat && 'co-card-flat',
        padding === 'none' && 'co-card-np',
        padding === 'compact' && 'co-card-compact',
        className
      )}
      aria-labelledby={landmark && hasTitle && rest['aria-label'] === undefined ? titleId : undefined}
      {...rest}
    >
      {hasTitle || actions ? (
        <div className="co-card-h">
          <div>
            {hasTitle ? <h2 id={titleId}>{title}</h2> : null}
            {subtitle ? <div className="co-sub">{subtitle}</div> : null}
          </div>
          {actions ? <div className="co-row co-gap-8">{actions}</div> : null}
        </div>
      ) : null}
      {children}
      {footer ? <div className="co-card-f">{footer}</div> : null}
    </Tag>
  );
});
