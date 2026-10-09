import { forwardRef, type ChangeEvent, type CSSProperties, type TextareaHTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { useControllableState, useDomId } from '../../internal/hooks';
import { DEFAULT_LOCK_MESSAGE, Field, fieldDescribedBy } from '../Field/Field';

export interface TextAreaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'value' | 'defaultValue' | 'onChange' | 'style'
> {
  /** Visible label; required */
  label: string;
  /** Visible rows; default 3 */
  rows?: number;
  /** Maximum characters; shows a live "n / max" counter; default none */
  maxLength?: number;
  /** Controlled value; default undefined (uncontrolled) */
  value?: string;
  /** Initial value (uncontrolled); default "" */
  defaultValue?: string;
  /** Called with the value and the change event; default none */
  onChange?: (value: string, event: ChangeEvent<HTMLTextAreaElement>) => void;
  /** Error message (as TextField); default none */
  error?: string;
  /** Muted hint under the field (as TextField); default none */
  helper?: string;
  /** Red asterisk plus aria-required (as TextField); default false */
  required?: boolean;
  /** Read-only lock state (as TextField); default false */
  readOnly?: boolean;
  /** Lock line text when readOnly; default 'Your role can view but not edit' */
  lockMessage?: string;
  /** Inline style of the root */
  style?: CSSProperties;
}

/** TextArea takes multi-line text such as a reason for visit, a denial note or a message to the patient. */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  {
    label,
    rows = 3,
    maxLength,
    value: valueProp,
    defaultValue,
    onChange,
    error,
    helper,
    required = false,
    readOnly = false,
    lockMessage = DEFAULT_LOCK_MESSAGE,
    className,
    style,
    id: idProp,
    'aria-describedby': describedByProp,
    ...rest
  },
  ref
) {
  const id = useDomId('ta', idProp);
  const [value, setValue] = useControllableState<string>(valueProp, defaultValue ?? '');
  const lock = readOnly ? lockMessage : undefined;
  const countId = `${id}-count`;
  return (
    <Field
      id={id}
      label={label}
      required={required}
      error={error}
      helper={helper}
      lock={lock}
      className={className}
      style={style}
    >
      <textarea
        ref={ref}
        id={id}
        className={cx('co-inp', 'co-ta', error && 'is-bad', readOnly && 'is-ro')}
        rows={rows}
        value={value}
        maxLength={maxLength}
        readOnly={readOnly}
        aria-invalid={error ? true : undefined}
        aria-required={required || undefined}
        aria-describedby={fieldDescribedBy(
          id,
          { error, helper, lock },
          [maxLength ? countId : '', describedByProp].filter(Boolean).join(' ') || undefined
        )}
        onChange={(e) => {
          setValue(e.target.value);
          onChange?.(e.target.value, e);
        }}
        {...rest}
      />
      {maxLength ? (
        <div className="co-help co-count-r" id={countId} aria-live="polite">
          {`${value.length} / ${maxLength}`}
        </div>
      ) : null}
    </Field>
  );
});
