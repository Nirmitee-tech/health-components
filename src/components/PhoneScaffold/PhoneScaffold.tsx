import { forwardRef, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { Alert } from '../Alert/Alert';
import { BottomTabBar, type BottomTabBarItem } from '../BottomTabBar/BottomTabBar';
import { MobileHeader } from '../MobileHeader/MobileHeader';

export interface PhoneScaffoldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Screen title. Required */
  title: ReactNode;
  /** Patient or date line; default none */
  subtitle?: ReactNode;
  /** Back link href; default none */
  back?: string;
  /** Called when the back link is clicked (client-side routing); default none */
  onBack?: (event: MouseEvent<HTMLAnchorElement>) => void;
  /** One small header action on the right; default none */
  action?: ReactNode;
  /** BottomTabBar items; default none (no tab bar) */
  tabs?: BottomTabBarItem[];
  /** Label of the current tab; default none */
  active?: string;
  /** Called when a tab is clicked; default none */
  onNavigate?: (item: BottomTabBarItem, event: MouseEvent<HTMLAnchorElement>) => void;
  /** Read-only lock banner at the top of the body; default none */
  lockText?: ReactNode;
  /** Body. */
  children?: ReactNode;
}

/** PhoneScaffold is the frame for every phone and portal screen: header, scrolling body with 44px targets, optional lock banner and bottom tabs. */
export const PhoneScaffold = forwardRef<HTMLDivElement, PhoneScaffoldProps>(function PhoneScaffold(
  { title, subtitle, back, onBack, action, tabs, active, onNavigate, lockText, children, className, ...rest },
  ref
) {
  return (
    <div ref={ref} className={cx('co-phone', className)} {...rest}>
      <MobileHeader title={title} subtitle={subtitle} back={back} onBack={onBack} action={action} />
      <div className="co-pbody">
        {lockText ? <Alert tone="lock">{lockText}</Alert> : null}
        {children}
      </div>
      {tabs ? <BottomTabBar items={tabs} active={active} onNavigate={onNavigate} /> : null}
    </div>
  );
});
