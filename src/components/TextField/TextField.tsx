import { forwardRef, type ChangeEvent, type CSSProperties, type HTMLAttributes, type InputHTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { useControllableState, useDomId } from '../../internal/hooks';
import { DEFAULT_LOCK_MESSAGE, Field, fieldDescribedBy } from '../Field/Field';
import { Icon, type IconName } from '../Icon/Icon';

export type MaskKind = 'phone' | 'ssn' | 'npi' | 'zip' | 'ein' | 'date';

/** One input mask: `#` is a digit, everything else is a literal. */
export interface MaskSpec {
  pattern: string;
  placeholder: string;
  inputMode: HTMLAttributes<HTMLInputElement>['inputMode'];
  /** Default helper text under the field */
  help: string;
}

/** The masks TextField knows. */
export const masks: Record<MaskKind, MaskSpec> = {
  phone: { pattern: '(###) ###-####', placeholder: '(312) 555-0142', inputMode: 'tel', help: 'US phone, 10 digits' },
  ssn: {
    pattern: '###-##-####',
    placeholder: '###-##-####',
    inputMode: 'numeric',
    help: '9 digits. Shown as ***-**-1234 after save',
  },
  npi: { pattern: '##########', placeholder: '1234567893', inputMode: 'numeric', help: '10 digits' },
  zip: { pattern: '#####-####', placeholder: '60614', inputMode: 'numeric', help: '5 digits, or ZIP+4' },
  ein: { pattern: '##-#######', placeholder: '12-3456789', inputMode: 'numeric', help: 'Enter the EIN as XX-XXXXXXX.' },
  date: { pattern: '##/##/####', placeholder: 'MM/DD/YYYY', inputMode: 'numeric', help: 'MM/DD/YYYY' },
};

/**
 * Arranges the digits of `raw` into the mask pattern. It proves the shape, never that the number is
 * real (an NPI check digit, a live ZIP). Without a known mask it returns `raw` unchanged.
 */
export function formatMask(raw: string | null | undefined, kind?: MaskKind): string {
  const m = kind ? masks[kind] : undefined;
  if (!m) return raw ?? '';
  const d = String(raw ?? '').replace(/\D/g, '');
  let out = '';
  let j = 0;
  for (let i = 0; i < m.pattern.length && j < d.length; i++) {
    if (m.pattern[i] === '#') out += d[j++];
    else out += m.pattern[i];
  }
  if (kind === 'zip' && d.length <= 5) out = d.slice(0, 5);
  return out;
}

export type TextFieldSize = 'sm' | 'md' | 'lg';

export interface TextFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'onChange' | 'size' | 'style'
> {
  /** Visible label; required */
  label: string;
  /** 'phone' | 'ssn' | 'npi' | 'zip' | 'ein' | 'date'; default none */
  mask?: MaskKind;
  /** Controlled value; default undefined (uncontrolled) */
  value?: string;
  /** Initial value (uncontrolled), formatted with the mask; default "" */
  defaultValue?: string;
  /** Called with the (masked) value and the change event; default none */
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  /** Error message: red border, message under the field with role alert, aria-invalid; default none */
  error?: string;
  /** Muted hint under the field; default the mask hint */
  helper?: string;
  /** Red asterisk plus aria-required; default false */
  required?: boolean;
  /** Read-only lock state: grey fill, lock icon and lock message; default false */
  readOnly?: boolean;
  /** Lock line text when readOnly; default 'Your role can view but not edit' */
  lockMessage?: string;
  /** 'sm' 30px | 'md' 36px | 'lg' 48px (kiosk); default 'md' */
  size?: TextFieldSize;
  /** Icon inside the input on the left; default none */
  iconLeft?: IconName;
  /** Unit text inside the input on the right, such as "units"; default none */
  suffix?: string;
  /** Inline style of the root */
  style?: CSSProperties;
}

/** TextField is a labelled one-line input with masks for phone, SSN, NPI, ZIP and EIN, plus error, helper, required and read-only lock states. */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
    label,
    mask,
    value: valueProp,
    defaultValue,
    onChange,
    error,
    helper,
    required = false,
    readOnly = false,
    lockMessage = DEFAULT_LOCK_MESSAGE,
    size = 'md',
    iconLeft,
    suffix,
    className,
    style,
    id: idProp,
    placeholder,
    inputMode,
    'aria-describedby': describedByProp,
    ...rest
  },
  ref
) {
  const id = useDomId('tf', idProp);
  const m = mask ? masks[mask] : undefined;
  const [value, setValue] = useControllableState<string>(
    valueProp,
    defaultValue != null ? formatMask(defaultValue, mask) : ''
  );
  const help = helper || (m && !error ? m.help : undefined);
  const lock = readOnly ? lockMessage : undefined;
  return (
    <Field
      id={id}
      label={label}
      required={required}
      error={error}
      helper={help}
      lock={lock}
      className={className}
      style={style}
    >
      <div className={cx('co-inpwrap', iconLeft && 'has-icon')}>
        {iconLeft ? <Icon name={iconLeft} size={16} className="co-inp-ic" /> : null}
        <input
          ref={ref}
          id={id}
          className={cx(
            'co-inp',
            size === 'sm' && 'co-inp-sm',
            size === 'lg' && 'co-inp-lg',
            error && 'is-bad',
            readOnly && 'is-ro'
          )}
          value={value}
          readOnly={readOnly}
          aria-invalid={error ? true : undefined}
          aria-required={required || undefined}
          aria-describedby={fieldDescribedBy(id, { error, helper: help, lock }, describedByProp)}
          placeholder={placeholder ?? m?.placeholder}
          inputMode={inputMode ?? m?.inputMode}
          onChange={(e) => {
            const next = mask ? formatMask(e.target.value, mask) : e.target.value;
            setValue(next);
            onChange?.(next, e);
          }}
          {...rest}
        />
        {readOnly ? <Icon name="lock" size={14} className="co-inp-lock" /> : null}
        {suffix ? <span className="co-inp-suf">{suffix}</span> : null}
      </div>
    </Field>
  );
});
