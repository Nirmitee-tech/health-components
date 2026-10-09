import { forwardRef, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { useControllableState } from '../../internal/hooks';
import { Icon } from '../Icon/Icon';

export interface FilterChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'type'> {
  /** Label. Required */
  children: ReactNode;
  /** On state (controlled) */
  selected?: boolean;
  /** Initial on state (uncontrolled); default false */
  defaultSelected?: boolean;
  /** Count after the label; default none */
  count?: number;
  /** Show the check icon when on; default true */
  check?: boolean;
  /** Makes a removable (applied) chip with an x button; default none */
  onRemove?: () => void;
  /** Accessible name of the remove button; default "Remove filter <label>" */
  removeLabel?: string;
  /** Called with the new state; default none */
  onChange?: (on: boolean) => void;
}

/**
 * FilterChip toggles a quick filter above a list, such as Rejected or Needs Review, and can show a count.
 * With `onRemove` it is an applied filter with a remove button; the ref then points at that button.
 */
export const FilterChip = forwardRef<HTMLButtonElement, FilterChipProps>(function FilterChip(
  {
    children,
    selected,
    defaultSelected = false,
    count,
    check = true,
    onRemove,
    removeLabel,
    onChange,
    disabled = false,
    className,
    onClick,
    ...rest
  },
  ref
) {
  const [on, setOn] = useControllableState(selected, defaultSelected, onChange);

  if (onRemove) {
    const name = removeLabel ?? `Remove filter ${typeof children === 'string' || typeof children === 'number' ? children : ''}`.trim();
    return (
      <span className={cx('co-chipb is-on co-chip-rm', className)}>
        {children}
        <button
          ref={ref}
          type="button"
          aria-label={name}
          disabled={disabled}
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            onClick?.(e);
            if (!e.defaultPrevented) onRemove();
          }}
          {...rest}
        >
          <Icon name="x" size={14} />
        </button>
      </span>
    );
  }

  return (
    <button
      ref={ref}
      type="button"
      className={cx('co-chipb', on && 'is-on', className)}
      aria-pressed={on}
      disabled={disabled}
      onClick={(e: MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        if (!e.defaultPrevented) setOn(!on);
      }}
      {...rest}
    >
      {on && check ? <Icon name="check" size={14} /> : null}
      {children}
      {count != null ? <span className="co-chipn">{count}</span> : null}
    </button>
  );
});
