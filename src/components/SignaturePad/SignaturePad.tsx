import { forwardRef, useState, type ButtonHTMLAttributes, type CSSProperties } from 'react';
import { cx } from '../../internal/cx';
import { useControllableState, useDomId } from '../../internal/hooks';
import { Button } from '../Button/Button';

export interface SignaturePadProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'style' | 'onClick'
> {
  /** Label above the pad; default "Signature" */
  label?: string;
  /** Signer's name, drawn as the signature and used in the pad's accessible name; default "patient" */
  name?: string;
  /** Controlled signed state; default undefined (uncontrolled) */
  signed?: boolean;
  /** Initial signed state (uncontrolled); default false */
  defaultSigned?: boolean;
  /** Called when the signed state changes (sign or clear) */
  onSignedChange?: (signed: boolean) => void;
  /** Time stamp shown after signing ("10/09/2026 10:42 AM"); default the time the pad was signed */
  when?: string;
  /** Shorter pad (90px); default false */
  compact?: boolean;
  /** Red asterisk after the label; default false */
  required?: boolean;
  /** Error message under the pad, role alert; default none */
  error?: string;
  /** Called when the signer taps to sign; default none */
  onSign?: () => void;
  /** Called when the signature is cleared; default none */
  onClear?: () => void;
  /** Inline style of the root */
  style?: CSSProperties;
}

function stamp(d: Date): string {
  const p = (n: number) => (n < 10 ? '0' : '') + n;
  const h = d.getHours() % 12 || 12;
  return `${p(d.getMonth() + 1)}/${p(d.getDate())}/${d.getFullYear()} ${h}:${p(d.getMinutes())} ${d.getHours() < 12 ? 'AM' : 'PM'}`;
}

/** SignaturePad captures a patient or provider signature on consent forms, check-in and note signing. */
export const SignaturePad = forwardRef<HTMLButtonElement, SignaturePadProps>(function SignaturePad(
  {
    label = 'Signature',
    name,
    signed: signedProp,
    defaultSigned = false,
    onSignedChange,
    when,
    compact = false,
    required = false,
    error,
    onSign,
    onClear,
    className,
    style,
    id: idProp,
    'aria-describedby': describedByProp,
    ...rest
  },
  ref
) {
  const id = useDomId('sig', idProp);
  const [signed, setSigned] = useControllableState(signedProp, defaultSigned, onSignedChange);
  const [signedAt, setSignedAt] = useState<string | null>(null);
  const signer = name || 'Signed';
  const shownWhen = when ?? signedAt;
  const describedBy = [`${id}-meta`, error ? `${id}-err` : '', describedByProp ?? ''].filter(Boolean).join(' ');
  return (
    <div className={cx('co-field', className)} style={style}>
      <span className="co-lbl" id={`${id}-l`}>
        {label}
        {required ? (
          <span className="co-req" aria-hidden="true">
            {' *'}
          </span>
        ) : null}
      </span>
      <button
        ref={ref}
        id={id}
        type="button"
        className={cx('co-sigpad', signed && 'is-signed', compact && 'co-sigpad-sm', error && 'is-bad')}
        aria-label={`${label}: ${signed ? `Signed by ${signer}. Clear to sign again` : `Tap to sign as ${name || 'patient'}`}`}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        onClick={() => {
          if (signed) return;
          setSignedAt(stamp(new Date()));
          setSigned(true);
          onSign?.();
        }}
        {...rest}
      >
        {signed ? <span className="co-sig-ink">{signer}</span> : <span className="co-sig-ph">Tap to sign</span>}
        <span className="co-sig-line" />
      </button>
      <div className="co-row co-sig-meta">
        <span className="co-help" id={`${id}-meta`}>
          {signed ? (shownWhen ? `Signed ${shownWhen}` : 'Signed') : 'By signing you agree to the consent above.'}
        </span>
        {signed ? (
          <Button
            variant="link"
            aria-label={`Clear ${label.toLowerCase()}`}
            onClick={() => {
              setSigned(false);
              setSignedAt(null);
              onClear?.();
            }}
          >
            Clear
          </Button>
        ) : null}
      </div>
      {error ? (
        <div className="co-errt" id={`${id}-err`} role="alert">
          {error}
        </div>
      ) : null}
    </div>
  );
});
