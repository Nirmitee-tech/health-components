import { forwardRef, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { useControllableState, useDomId } from '../../internal/hooks';

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'type' | 'role'> {
  /** Visible label. Required */
  label: ReactNode;
  /** On state (controlled) */
  checked?: boolean;
  /** Initial on state (uncontrolled); default false */
  defaultChecked?: boolean;
  /** Help text under the label; default none */
  description?: ReactNode;
  /** Settings-row layout with a top border and 56px height; default false */
  row?: boolean;
  /** Disables the switch; default false */
  disabled?: boolean;
  /** Called with the new state; default none */
  onChange?: (on: boolean) => void;
  /** Class on the wrapping row. */
  className?: string;
}

/** Switch turns a setting on or off immediately, such as "Sidebar starts collapsed" or "Allow online booking". */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { label, checked, defaultChecked = false, description, row = false, disabled = false, onChange, className, id, onClick, ...rest },
  ref
) {
  const baseId = useDomId('co-sw', id);
  const [on, setOn] = useControllableState(checked, defaultChecked, onChange);
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) setOn(!on);
  };
  return (
    <div className={cx('co-swrow', row && 'co-tgl', className)}>
      <span className="co-chk-t">
        <span id={`${baseId}-label`}>{label}</span>
        {description ? (
          <span className="co-help" id={`${baseId}-desc`}>
            {description}
          </span>
        ) : null}
      </span>
      <button
        ref={ref}
        id={id}
        type="button"
        role="switch"
        aria-checked={on}
        aria-labelledby={`${baseId}-label`}
        aria-describedby={description ? `${baseId}-desc` : undefined}
        className={cx('co-sw', on && 'is-on')}
        disabled={disabled}
        onClick={handleClick}
        {...rest}
      >
        <i />
      </button>
    </div>
  );
});
