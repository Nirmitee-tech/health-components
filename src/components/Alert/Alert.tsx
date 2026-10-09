import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { Icon, type IconName } from '../Icon/Icon';
import { IconButton } from '../IconButton/IconButton';

export type AlertTone = 'info' | 'success' | 'warning' | 'error' | 'lock' | 'denied' | 'btg' | 'note' | 'ai';

const ALERT_ICON: Record<AlertTone, IconName | null> = {
  info: 'info',
  success: 'check',
  warning: 'alert',
  error: 'alert-circle',
  lock: 'lock',
  denied: 'lock',
  btg: 'shield',
  note: null,
  ai: 'sparkle',
};

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 'info' | 'success' | 'warning' | 'error' | 'lock' | 'denied' | 'btg' | 'note' | 'ai'; default 'info' */
  tone?: AlertTone;
  /** Bold first line; default none */
  title?: ReactNode;
  /** Body text; default none */
  children?: ReactNode;
  /** Buttons under the body; default none */
  actions?: ReactNode;
  /** Shows a Dismiss (x) button that calls this; default none */
  onDismiss?: () => void;
}

/** Alert is an inline banner for information, success, warnings, errors, the read-only lock, access denied and break-the-glass. */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { tone = 'info', title, children, actions, onDismiss, className, ...rest },
  ref
) {
  const icon = ALERT_ICON[tone];
  return (
    <div
      ref={ref}
      className={cx('co-alert', `co-alert-${tone}`, className)}
      role={tone === 'error' || tone === 'denied' || tone === 'btg' ? 'alert' : 'status'}
      {...rest}
    >
      {icon ? <Icon name={icon} size={tone === 'lock' ? 14 : 16} className="co-alert-ic" /> : null}
      <div className="co-alert-b">
        {title ? <b>{title}</b> : null}
        {children ? <span>{children}</span> : null}
        {actions ? <div className="co-row co-gap-8 co-alert-a">{actions}</div> : null}
      </div>
      {onDismiss ? <IconButton icon="x" label="Dismiss" size="sm" onClick={onDismiss} /> : null}
    </div>
  );
});
