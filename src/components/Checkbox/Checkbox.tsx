import { forwardRef, useCallback, useEffect, useRef, type InputHTMLAttributes, type ReactNode, type Ref } from 'react';
import { cx } from '../../internal/cx';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Visible label; the whole row is clickable. Required */
  label: ReactNode;
  /** Checked state (controlled); pair with `onChange` */
  checked?: boolean;
  /** Initial checked state (uncontrolled); default false */
  defaultChecked?: boolean;
  /** Mixed state, for "select all" when only some items are selected; default false */
  indeterminate?: boolean;
  /** Help text under the label; default none */
  description?: ReactNode;
  /** Marks the input invalid (aria-invalid); default false */
  error?: boolean;
  /** Disables the checkbox; default false */
  disabled?: boolean;
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') ref(value);
  else if (ref) (ref as { current: T | null }).current = value;
}

/** Checkbox turns one option on or off, alone or in a list; it also has an indeterminate state for select-all. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, indeterminate = false, error = false, disabled = false, className, ...rest },
  ref
) {
  const inner = useRef<HTMLInputElement | null>(null);
  const setRef = useCallback(
    (el: HTMLInputElement | null) => {
      inner.current = el;
      assignRef(ref, el);
    },
    [ref]
  );
  useEffect(() => {
    if (inner.current) inner.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return (
    <label className={cx('co-chk', disabled && 'is-dis', className)}>
      <input
        type="checkbox"
        ref={setRef}
        className="co-box"
        aria-invalid={error || undefined}
        disabled={disabled}
        {...rest}
      />
      <span className="co-chk-t">
        {label}
        {description ? <span className="co-help">{description}</span> : null}
      </span>
    </label>
  );
});
