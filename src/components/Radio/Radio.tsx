import {
  forwardRef,
  useRef,
  type FieldsetHTMLAttributes,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../internal/cx';
import { useControllableState, useDomId } from '../../internal/hooks';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Visible label; the whole row is clickable. Required */
  label: ReactNode;
  /** Help text under the label; default none */
  description?: ReactNode;
  /** Disables the radio; default false */
  disabled?: boolean;
}

/** A single radio input with its label. Most screens use RadioGroup instead. */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, description, disabled = false, className, ...rest },
  ref
) {
  return (
    <label className={cx('co-chk', disabled && 'is-dis', className)}>
      <input ref={ref} type="radio" className="co-box co-radio" disabled={disabled} {...rest} />
      <span className="co-chk-t">
        {label}
        {description ? <span className="co-help">{description}</span> : null}
      </span>
    </label>
  );
});

/** One option of a RadioGroup. */
export interface RadioOption {
  /** Value reported by onChange. */
  value: string;
  /** Visible label. */
  label: ReactNode;
  /** Help text under the label; default none */
  description?: ReactNode;
  /** Disables this option; default false */
  disabled?: boolean;
}

export interface RadioGroupProps extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'onChange' | 'defaultValue'> {
  /** Legend text. Required */
  label: ReactNode;
  /** Options: strings or `{value, label, description?, disabled?}`. Required */
  options: ReadonlyArray<string | RadioOption>;
  /** Selected value (controlled) */
  value?: string;
  /** Initially selected value (uncontrolled); default none */
  defaultValue?: string;
  /** Options in a row instead of a column; default false */
  inline?: boolean;
  /** Shows a required asterisk and sets `required` on the inputs; default false */
  required?: boolean;
  /** Error message under the options; default none */
  error?: ReactNode;
  /** Disables every option; default false */
  disabled?: boolean;
  /** Input `name`; default a generated id */
  name?: string;
  /** Called with the newly selected value; default none */
  onChange?: (value: string) => void;
}

const norm = (o: string | RadioOption): RadioOption => (typeof o === 'string' ? { value: o, label: o } : o);

/**
 * RadioGroup chooses exactly one option from a short visible list: a fieldset with a legend.
 * Arrow keys move between options and select them; Tab enters at the selected option.
 */
export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(function RadioGroup(
  {
    label,
    options,
    value,
    defaultValue,
    inline = false,
    required = false,
    error,
    disabled = false,
    name,
    onChange,
    className,
    id,
    onKeyDown,
    ...rest
  },
  ref
) {
  const baseId = useDomId('co-rg', id);
  const groupName = name ?? baseId;
  const errorId = `${baseId}-err`;
  const [current, setCurrent] = useControllableState<string | undefined>(value, defaultValue, (v) => {
    if (v !== undefined) onChange?.(v);
  });
  const opts = options.map(norm);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const enabled = opts.map((o, i) => (!disabled && !o.disabled ? i : -1)).filter((i) => i >= 0);
  const selectedIndex = opts.findIndex((o) => o.value === current);
  const tabStop = selectedIndex >= 0 && enabled.includes(selectedIndex) ? selectedIndex : (enabled[0] ?? -1);

  const handleKeyDown = (e: KeyboardEvent<HTMLFieldSetElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || enabled.length === 0) return;
    const from = inputs.current.findIndex((el) => el === e.target);
    if (from < 0) return;
    const pos = enabled.indexOf(from);
    let next: number | undefined;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = enabled[(pos + 1) % enabled.length];
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = enabled[(pos - 1 + enabled.length) % enabled.length];
    else if (e.key === 'Home') next = enabled[0];
    else if (e.key === 'End') next = enabled[enabled.length - 1];
    if (next === undefined) return;
    e.preventDefault();
    inputs.current[next]?.focus();
    const o = opts[next];
    if (o && o.value !== current) setCurrent(o.value);
  };

  return (
    <fieldset
      ref={ref}
      id={id}
      className={cx('co-fs', inline && 'co-fs-inline', className)}
      aria-describedby={error ? errorId : undefined}
      disabled={disabled || undefined}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      <legend className="co-lbl">
        {label}
        {required ? (
          <span className="co-req" aria-hidden="true">
            {' *'}
          </span>
        ) : null}
      </legend>
      {opts.map((o, i) => (
        <Radio
          key={o.value}
          ref={(el) => {
            inputs.current[i] = el;
          }}
          name={groupName}
          value={o.value}
          label={o.label}
          description={o.description}
          disabled={disabled || o.disabled}
          required={required}
          checked={current === o.value}
          tabIndex={i === tabStop ? 0 : -1}
          onChange={() => setCurrent(o.value)}
        />
      ))}
      {error ? (
        <div className="co-errt" id={errorId} role="alert">
          {error}
        </div>
      ) : null}
    </fieldset>
  );
});
