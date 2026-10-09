import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../internal/cx';

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Joins the buttons into one attached control (Day / Week / Month); default false */
  attached?: boolean;
  /** 'start' | 'end': 'end' right-aligns a footer; default 'start' */
  align?: 'start' | 'end';
  /** aria-label of the group; default none */
  label?: string;
  /** Buttons; required */
  children: ReactNode;
}

/** ButtonGroup lays out related buttons with the 8px gap the screens use, or joins them into one attached control. */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  { attached = false, align = 'start', label, className, children, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      className={cx('co-bgroup', attached && 'co-bgroup-attached', align === 'end' && 'co-bgroup-end', className)}
      role="group"
      aria-label={label}
      {...rest}
    >
      {children}
    </div>
  );
});
