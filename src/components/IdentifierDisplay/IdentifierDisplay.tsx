import { forwardRef, useEffect, useRef, useState, type HTMLAttributes } from 'react';
import { identifier, idType, type IdTypeKey } from '../../clinical';
import { cx } from '../../internal/cx';
import { Icon } from '../Icon/Icon';
import { IconButton } from '../IconButton/IconButton';

export type IdentifierType = IdTypeKey;

export interface IdentifierDisplayProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** 'ssn' | 'mrn' | 'npi' | 'dea' | 'member' | 'other'; required */
  type: IdentifierType;
  /** Full value; required */
  value: string;
  /** Mask all but the last 4; default by type (SSN, DEA and member ID masked) */
  masked?: boolean;
  /** Eye button that reveals a masked value; default false */
  revealable?: boolean;
  /** Called each time a masked value is revealed: log it for audit; default none */
  onReveal?: () => void;
  /** Copy button (copies the full value without spaces); default true */
  copyable?: boolean;
  /** Label; default the type label (SSN, MRN, NPI, DEA, Member ID) */
  label?: string;
  /** Shows the label; default true */
  showLabel?: boolean;
}

/**
 * IdentifierDisplay shows SSN, MRN, NPI, DEA and member IDs in a monospace face, masking the sensitive ones, with
 * reveal and copy buttons and a check-digit warning. A passing check digit only rules out typing errors.
 */
export const IdentifierDisplay = forwardRef<HTMLSpanElement, IdentifierDisplayProps>(function IdentifierDisplay(
  { type, value, masked: maskedProp, revealable = false, onReveal, copyable = true, label, showLabel = true, className, ...rest },
  ref
) {
  const t = idType(type);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const maskable = maskedProp != null ? maskedProp : t.masked;
  const masked = maskable && !revealed;
  const text = identifier(type, value, masked);
  const bad = !!t.check && !!value && !t.check(value);
  const name = label || t.label;

  const copy = () => {
    const clip = typeof navigator !== 'undefined' ? navigator.clipboard : undefined;
    if (!clip) return;
    clip.writeText(String(value).replace(/\s/g, '')).then(
      () => {
        setCopied(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), 1500);
      },
      () => undefined
    );
  };

  return (
    <span ref={ref} className={cx('co-id', className)} {...rest}>
      {showLabel ? <span className="co-id-l">{name}</span> : null}
      {masked ? (
        <span className="co-mono">
          <span aria-hidden="true">{text}</span>
          <span className="co-cv-sr">{name + ' ending ' + String(value).slice(-4)}</span>
        </span>
      ) : (
        <span className="co-mono">{text}</span>
      )}
      {bad ? (
        <span className="co-af co-af-warning" title="Check digit does not match: likely a typing error">
          <Icon name="alert-circle" size={11} />
          Check digit fails
        </span>
      ) : null}
      {revealable && maskable ? (
        <IconButton
          icon="eye"
          size="sm"
          label={revealed ? 'Hide ' + name : 'Show ' + name}
          aria-pressed={revealed}
          onClick={() => {
            const next = !revealed;
            setRevealed(next);
            if (next) onReveal?.();
          }}
        />
      ) : null}
      {copyable ? (
        <IconButton icon={copied ? 'check' : 'file'} size="sm" label={copied ? 'Copied' : 'Copy ' + name} onClick={copy} />
      ) : null}
    </span>
  );
});
