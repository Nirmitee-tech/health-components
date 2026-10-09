import { forwardRef, useEffect, useRef, useState, type HTMLAttributes } from 'react';
import type { RangeContextId } from '../../clinical';
import { cx } from '../../internal/cx';
import { useControllableState, useDomId } from '../../internal/hooks';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';

/** What is scanned. */
export type BarcodeScanTarget = 'patient' | 'medication' | 'witness';
/** Scan state: waiting for a scan, matched, mismatched, or skipped with a reason. */
export type BarcodeScanState = 'waiting' | 'matched' | 'mismatch' | 'override';

export interface BarcodeScanPromptProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onReset'> {
  /** 'patient' (wristband) | 'medication' | 'witness' (badge); default 'medication' */
  target?: BarcodeScanTarget;
  /** Code to match (compared trimmed and case-insensitive); default none (any scan matches) */
  expected?: string;
  /** What it should be ('Marcus Hill, DOB 03/14/1959'); default none */
  expectedLabel?: string;
  /** Step number shown before the prompt; default none */
  step?: number;
  /** Controlled state: 'waiting' | 'matched' | 'mismatch' | 'override'; default uncontrolled */
  state?: BarcodeScanState;
  /** Initial state (uncontrolled); default 'waiting' */
  defaultState?: BarcodeScanState;
  /** Called when the state changes (a scan is checked, Cannot scan, Rescan); default none */
  onStateChange?: (state: BarcodeScanState) => void;
  /** Scanned code shown in the field and the status line; default '' */
  defaultCode?: string;
  /** Shows a Cannot scan button; default false */
  allowOverride?: boolean;
  /** Reason shown in the override state; default 'barcode damaged' */
  overrideReason?: string;
  /** Focuses the field on mount (the scanner types into it); default false */
  autoFocus?: boolean;
  /** Replaces the matched message; default 'Scan matches <expectedLabel>' */
  matchedText?: string;
  /** Replaces the mismatch message; default 'Scan does not match. Do not give...' */
  mismatchText?: string;
  /** Called with the code and whether it matched when a scan is checked; default none */
  onScan?: (code: string, ok: boolean) => void;
  /** Called on Cannot scan; default none */
  onOverride?: () => void;
  /** Shows Rescan in the matched state and is called by it; default none */
  onReset?: () => void;
  /** Accepted for API consistency with the nursing set (no values are flagged here); default 'inpatient' */
  rangeContext?: RangeContextId;
}

/**
 * BarcodeScanPrompt asks for one barcode scan (wristband, medication or witness badge), checks it against the
 * expected code and shows match, mismatch or skipped.
 */
export const BarcodeScanPrompt = forwardRef<HTMLDivElement, BarcodeScanPromptProps>(function BarcodeScanPrompt(
  {
    target = 'medication',
    expected,
    expectedLabel,
    step,
    state,
    defaultState = 'waiting',
    onStateChange,
    defaultCode = '',
    allowOverride = false,
    overrideReason,
    autoFocus = false,
    matchedText,
    mismatchText,
    onScan,
    onOverride,
    onReset,
    rangeContext: _rangeContext,
    className,
    id,
    ...rest
  },
  ref
) {
  const titleId = useDomId('co-scan', id ? `${id}-title` : undefined);
  const [cur, setState] = useControllableState<BarcodeScanState>(state, defaultState, onStateChange);
  const [code, setCode] = useState(defaultCode);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
    // Only on mount, like the autofocus attribute.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = (c: string) => {
    const ok = !expected || c.trim().toUpperCase() === expected.trim().toUpperCase();
    setState(ok ? 'matched' : 'mismatch');
    onScan?.(c, ok);
  };

  const what = target === 'patient' ? 'patient wristband' : target === 'witness' ? 'witness badge' : 'medication barcode';
  const msg =
    cur === 'matched'
      ? matchedText || 'Scan matches ' + (expectedLabel || 'the order')
      : cur === 'mismatch'
        ? mismatchText || 'Scan does not match. Do not give. Check the ' + what + ' again.'
        : cur === 'override'
          ? 'Scan skipped with reason: ' + (overrideReason || 'barcode damaged')
          : 'Scan the ' + what + (expectedLabel ? ' for ' + expectedLabel : '');
  const scanned = code || defaultCode;
  const status =
    cur === 'matched'
      ? 'Scanned ' + scanned
      : cur === 'mismatch'
        ? (scanned ? 'Scanned ' + scanned : 'Scanned code did not match') + (expected ? ', expected ' + expected : '')
        : 'The scanner types into this field. You can also type the code.';

  return (
    <div
      ref={ref}
      id={id}
      className={cx('nu-scan', cur === 'matched' && 'is-ok', cur === 'mismatch' && 'is-bad', cur === 'waiting' && 'is-wait', className)}
      role="group"
      aria-labelledby={titleId}
      {...rest}
    >
      <div className="nu-ico" aria-hidden="true">
        <Icon name={cur === 'matched' ? 'check' : cur === 'mismatch' ? 'x' : target === 'patient' ? 'user' : 'pill'} size={20} />
      </div>
      <div className="nu-scan-body">
        <div id={titleId} className="nu-scan-title">
          {step ? 'Step ' + step + ': ' : ''}
          {msg}
        </div>
        <div role="status" aria-live="polite" className="nu-muted">
          {status}
        </div>
        {cur === 'waiting' || cur === 'mismatch' ? (
          <form
            className="nu-row nu-scan-form"
            onSubmit={(e) => {
              e.preventDefault();
              submit(code);
            }}
          >
            <input
              ref={inputRef}
              aria-label={'Barcode for ' + what}
              value={code}
              placeholder="Waiting for scan"
              autoComplete="off"
              spellCheck={false}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button size="sm" type="submit">
              Check
            </Button>
            {allowOverride ? (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setState('override');
                  onOverride?.();
                }}
              >
                Cannot scan
              </Button>
            ) : null}
          </form>
        ) : null}
      </div>
      {cur === 'matched' && onReset ? (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setState('waiting');
            setCode('');
            onReset();
          }}
        >
          Rescan
        </Button>
      ) : null}
    </div>
  );
});
