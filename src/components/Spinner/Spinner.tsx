import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../internal/cx';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /** 'sm' | 'lg'; default 'sm' */
  size?: 'sm' | 'lg';
  /** 'primary' | 'ai'; default 'primary' */
  tone?: 'primary' | 'ai';
  /** Accessible name announced by screen readers; default "Loading" */
  label?: string;
}

/** Spinner is a short loading indicator with role status. */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = 'sm', tone = 'primary', label = 'Loading', className, ...rest },
  ref
) {
  return (
    <span
      ref={ref}
      className={cx('co-spin', size === 'lg' && 'co-spin-lg', tone === 'ai' && 'co-spin-ai', className)}
      role="status"
      aria-label={label}
      {...rest}
    />
  );
});
