import { forwardRef, type HTMLAttributes, type KeyboardEvent } from 'react';
import { cx } from '../../internal/cx';
import { useControllableState } from '../../internal/hooks';
import { Icon } from '../Icon/Icon';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'bio', '0', 'del'] as const;

export interface PinEntryProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Number of digits, 4 to 6; default 4 */
  length?: number;
  /** Controlled digits entered; default undefined (uncontrolled) */
  value?: string;
  /** Initial digits (uncontrolled); default "" */
  defaultValue?: string;
  /** Called with the digits after every key; default none */
  onChange?: (pin: string) => void;
  /** Label above the dots ("Enter your PIN"); default none */
  label?: string;
  /** Error message, role alert; the dots turn red; default none */
  error?: string;
  /** Shows the Face ID key; default false */
  biometric?: boolean;
  /** Text of the biometric key; default 'Face ID' */
  biometricLabel?: string;
  /** Locks the keypad after too many tries; default false */
  locked?: boolean;
  /** Text under a locked keypad; default 'Too many tries. Sign in with your password.' */
  lockedText?: string;
  /** Called with the PIN when the last digit is entered; default none */
  onComplete?: (pin: string) => void;
  /** Called when the biometric key is pressed; default none */
  onBiometric?: () => void;
}

/**
 * PinEntry is a 4 to 6 digit keypad with dots, for mobile sign-in and quick re-authentication.
 * A hardware keyboard works too: digits type, Backspace deletes.
 */
export const PinEntry = forwardRef<HTMLDivElement, PinEntryProps>(function PinEntry(
  {
    length = 4,
    value: valueProp,
    defaultValue = '',
    onChange,
    label,
    error,
    biometric = false,
    biometricLabel = 'Face ID',
    locked = false,
    lockedText = 'Too many tries. Sign in with your password.',
    onComplete,
    onBiometric,
    className,
    onKeyDown,
    ...rest
  },
  ref
) {
  const n = Math.max(1, length);
  const [value, setValue] = useControllableState(valueProp, defaultValue, onChange);

  const press = (k: string) => {
    if (locked) return;
    const next = k === 'del' ? value.slice(0, -1) : (value + k).slice(0, n);
    if (next === value) return;
    setValue(next);
    if (next.length === n && k !== 'del') onComplete?.(next);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      press(e.key);
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      press('del');
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- accepts digits and Backspace from a hardware keyboard while focus is on any key.
    <div ref={ref} className={cx('co-pinbox', className)} onKeyDown={handleKeyDown} {...rest}>
      {label ? <div className="co-lbl co-center">{label}</div> : null}
      <div className="co-pin-dots" role="status" aria-label={`${value.length} of ${n} digits entered`}>
        {Array.from({ length: n }, (_, i) => (
          <span key={i} className={cx('co-pin-dot', i < value.length && 'is-on', error && 'is-bad')} />
        ))}
      </div>
      {error ? (
        <div className="co-errt co-center" role="alert">
          {error}
        </div>
      ) : null}
      <div className="co-pin" role="group" aria-label={label ? `${label} keypad` : 'PIN keypad'}>
        {KEYS.map((k) => {
          if (k === 'bio') {
            return biometric ? (
              <button key={k} type="button" className="co-pk co-pk-alt" disabled={locked} onClick={onBiometric}>
                {biometricLabel}
              </button>
            ) : (
              <span key={k} />
            );
          }
          return (
            <button
              key={k}
              type="button"
              className={cx('co-pk', k === 'del' && 'co-pk-alt')}
              aria-label={k === 'del' ? 'Delete last digit' : k}
              disabled={locked}
              onClick={() => press(k)}
            >
              {k === 'del' ? <Icon name="chevron-left" size={20} /> : k}
            </button>
          );
        })}
      </div>
      {locked ? <div className="co-help co-center">{lockedText}</div> : null}
    </div>
  );
});
