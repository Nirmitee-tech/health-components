import { forwardRef, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { Icon } from '../Icon/Icon';

export type MobileHeaderVariant = 'phone' | 'kiosk';

export interface MobileHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Screen title. Required. */
  title: ReactNode;
  /** Patient or date line; default none */
  subtitle?: ReactNode;
  /** Back link href; shows the chevron back link; default none */
  back?: string;
  /** Called when the back link is clicked (client-side routing); default none */
  onBack?: (event: MouseEvent<HTMLAnchorElement>) => void;
  /** One small action on the right; default none */
  action?: ReactNode;
  /** 'phone' | 'kiosk' (wider, 19px title); default 'phone' */
  variant?: MobileHeaderVariant;
}

/** MobileHeader is the dark bar at the top of phone, portal and kiosk screens, with back, title, subtitle and one action. */
export const MobileHeader = forwardRef<HTMLElement, MobileHeaderProps>(function MobileHeader(
  { title, subtitle, back, onBack, action, variant = 'phone', className, ...rest },
  ref
) {
  return (
    <header ref={ref} className={cx('co-ptop', variant === 'kiosk' && 'co-ktop', className)} {...rest}>
      {back ? (
        <a className="co-pback" href={back} aria-label="Back" onClick={onBack}>
          <Icon name="chevron-left" size={22} />
        </a>
      ) : null}
      <div className="co-ptop-t">
        <div className="co-pt-title">{title}</div>
        {subtitle ? <div className="co-pt-sub">{subtitle}</div> : null}
      </div>
      {action ? <div className="co-ml">{action}</div> : null}
    </header>
  );
});
