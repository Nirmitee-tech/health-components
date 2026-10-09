import { Children, cloneElement, isValidElement, useEffect, useState, type ReactElement } from 'react';
import { cx } from '../../internal/cx';
import { useDomId } from '../../internal/hooks';

export type TooltipPlacement = 'top' | 'bottom' | 'right';

export interface TooltipProps {
  /** Tooltip text; required */
  label: string;
  /** One focusable element (Button, IconButton, link); required */
  children: ReactElement<{ 'aria-describedby'?: string }>;
  /** 'top' | 'bottom' | 'right'; default 'top' */
  placement?: TooltipPlacement;
  /** Keeps the tooltip shown (docs, onboarding); default false */
  open?: boolean;
  /** id of the tooltip element; default generated */
  id?: string;
  /** Class on the wrapper */
  className?: string;
}

/**
 * Tooltip shows a short text label on hover and focus, linked to its trigger with aria-describedby.
 * Escape hides it (WCAG 1.4.13).
 */
export function Tooltip({
  label,
  children,
  placement = 'top',
  open: forced = false,
  id: idProp,
  className,
}: TooltipProps) {
  const id = useDomId('tip', idProp);
  const [shown, setShown] = useState(false);
  const open = forced || shown;
  const child = Children.only(children);

  useEffect(() => {
    if (!shown) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShown(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [shown]);

  const existing = isValidElement(child) ? child.props['aria-describedby'] : undefined;
  return (
    <span
      className={cx('co-tipwrap', className)}
      onMouseEnter={() => setShown(true)}
      onMouseLeave={() => setShown(false)}
      onFocus={() => setShown(true)}
      onBlur={() => setShown(false)}
    >
      {cloneElement(child, { 'aria-describedby': existing ? `${existing} ${id}` : id })}
      <span id={id} role="tooltip" className={cx('co-tip', `co-tip-${placement}`, open && 'is-open')}>
        {label}
      </span>
    </span>
  );
}
