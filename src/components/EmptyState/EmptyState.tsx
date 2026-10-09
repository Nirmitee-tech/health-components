import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { Icon, type IconName } from '../Icon/Icon';

export type EmptyStateKind = 'empty' | 'noresults' | 'denied' | 'error';

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 'empty' | 'noresults' | 'denied' | 'error'; default 'empty' */
  kind?: EmptyStateKind;
  /** Heading (h2). Required */
  title: ReactNode;
  /** Body text: what to do next; default none */
  children?: ReactNode;
  /** Buttons under the body; default none */
  actions?: ReactNode;
  /** Icon; default by kind (inbox, search, lock, alert-circle) */
  icon?: IconName;
  /** Less padding, for cards and table bodies; default false */
  compact?: boolean;
}

const KIND_ICON: Record<EmptyStateKind, IconName> = {
  empty: 'inbox',
  noresults: 'search',
  denied: 'lock',
  error: 'alert-circle',
};

/** EmptyState fills a screen or card that has nothing to show, including the access-denied screen. */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { kind = 'empty', title, children, actions, icon, compact = false, className, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      className={cx('co-empty', `co-empty-${kind}`, compact && 'co-empty-compact', className)}
      role={kind === 'denied' || kind === 'error' ? 'alert' : undefined}
      {...rest}
    >
      <div className="co-empty-ic">
        <Icon name={icon ?? KIND_ICON[kind]} size={26} />
      </div>
      <h2>{title}</h2>
      {children ? <div className="co-muted co-empty-b">{children}</div> : null}
      {actions ? <div className="co-row co-gap-8 co-center-row">{actions}</div> : null}
    </div>
  );
});
