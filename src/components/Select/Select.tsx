import { forwardRef, type CSSProperties, type SelectHTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { useDomId } from '../../internal/hooks';
import { DEFAULT_LOCK_MESSAGE, Field, fieldDescribedBy } from '../Field/Field';
import { Icon } from '../Icon/Icon';

/** One option of a Select. */
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'style'> {
  /** Visible label; required */
  label: string;
  /** Array<string | {value, label}>; required */
  options: Array<string | SelectOption>;
  /** Text of a first empty option ("Choose one"); default none */
  placeholder?: string;
  /** 'sm' | 'md'; default 'md' */
  size?: 'sm' | 'md';
  /** Error message (as TextField); default none */
  error?: string;
  /** Muted hint under the field (as TextField); default none */
  helper?: string;
  /** Red asterisk plus aria-required (as TextField); default false */
  required?: boolean;
  /** Read-only lock state: the select is disabled and a lock line explains why; default false */
  readOnly?: boolean;
  /** Lock line text when readOnly; default 'Your role can view but not edit' */
  lockMessage?: string;
  /** Inline style of the root */
  style?: CSSProperties;
}

/** Select picks one value from a short fixed list, such as Provider, Location or Status filters. Native select. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    label,
    options,
    placeholder,
    size = 'md',
    error,
    helper,
    required = false,
    readOnly = false,
    lockMessage = DEFAULT_LOCK_MESSAGE,
    disabled,
    className,
    style,
    id: idProp,
    'aria-describedby': describedByProp,
    ...rest
  },
  ref
) {
  const id = useDomId('sel', idProp);
  const opts = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const lock = readOnly ? lockMessage : undefined;
  return (
    <Field id={id} label={label} required={required} error={error} helper={helper} lock={lock} className={className} style={style}>
      <div className="co-selwrap">
        <select
          ref={ref}
          id={id}
          className={cx('co-inp', 'co-sel', size === 'sm' && 'co-inp-sm', error && 'is-bad', readOnly && 'is-ro')}
          disabled={readOnly || disabled}
          aria-invalid={error ? true : undefined}
          aria-required={required || undefined}
          aria-describedby={fieldDescribedBy(id, { error, helper, lock }, describedByProp)}
          {...rest}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {opts.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
        </select>
        <Icon name={readOnly ? 'lock' : 'chevron-down'} size={14} className="co-sel-ic" />
      </div>
    </Field>
  );
});
