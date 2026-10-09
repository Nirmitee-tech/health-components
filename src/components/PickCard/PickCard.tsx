import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../internal/cx';

export interface PickCardProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'title'> {
  /** Main line, e.g. "Thu 10/09 9:20 AM" */
  title: string;
  /** Second line (visit type, provider, place); default none */
  meta?: string;
  /** Chosen; sets aria-pressed; default false */
  selected?: boolean;
  /** Not available ("Fully booked"); default false */
  disabled?: boolean;
  /** Extra content under the meta line; default none */
  children?: ReactNode;
}

/** PickCard is a large selectable card for choosing one option on phones, portal and kiosk (appointment, provider, reason). */
export const PickCard = forwardRef<HTMLButtonElement, PickCardProps>(function PickCard(
  { title, meta, selected = false, disabled = false, className, children, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      className={cx('co-pcard', selected && 'is-on', className)}
      aria-pressed={selected}
      disabled={disabled}
      {...rest}
    >
      <b>{title}</b>
      {meta ? <span className="co-mi-s">{meta}</span> : null}
      {children}
    </button>
  );
});
