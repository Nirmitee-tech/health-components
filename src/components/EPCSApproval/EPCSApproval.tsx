import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { useControllableState } from '../../internal/hooks';
import { Alert } from '../Alert/Alert';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { DescriptionList } from '../DescriptionList/DescriptionList';
import { PinEntry } from '../PinEntry/PinEntry';
import { TextField } from '../TextField/TextField';

export type EPCSState = 'pin' | 'done' | 'locked';

/** The two factors entered for signing. */
export interface EPCSFactors {
  pin: string;
  code: string;
}

const FACTOR_LENGTH = 6;

export interface EPCSApprovalProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Drug, strength and form; required */
  drug: string;
  /** DEA schedule ("C-II"); required */
  schedule: string;
  /** Directions; required */
  sig: string;
  /** Quantity; required */
  qty: string | number;
  /** Prescriber name; required */
  prescriber: string;
  /** Prescriber DEA number; required */
  dea: string;
  /** PDMP check result; default "Checked today 10:02 AM, no concerns" */
  pdmp?: string;
  /** Pharmacy, in the done message; default "the pharmacy" */
  pharmacy?: string;
  /** Audit record number, in the done message; default "000123" */
  audit?: string;
  /** 'pin' (waiting for factors) | 'done' (signed and sent) | 'locked' (too many failures); default 'pin' */
  state?: EPCSState;
  /** Signing PIN (controlled); default undefined (uncontrolled, starts empty: never prefill factors) */
  pin?: string;
  /** Called as PIN digits are entered or deleted; default none */
  onPinChange?: (pin: string) => void;
  /** One-time token code (controlled); default undefined (uncontrolled, starts empty) */
  code?: string;
  /** Called as the token code changes; default none */
  onCodeChange?: (code: string) => void;
  /** Error under the PIN dots ("Wrong PIN. 2 tries left."); default none */
  error?: string;
  /** Sign and Send clicked with both factors complete; default none */
  onSign?: (factors: EPCSFactors) => void;
}

/** EPCSApproval is the two-factor signing step for controlled-substance e-prescriptions: summary, PDMP check, PIN and token code. */
export const EPCSApproval = forwardRef<HTMLElement, EPCSApprovalProps>(function EPCSApproval(
  {
    drug,
    schedule,
    sig,
    qty,
    prescriber,
    dea,
    pdmp,
    pharmacy,
    audit,
    state = 'pin',
    pin: pinProp,
    onPinChange,
    code: codeProp,
    onCodeChange,
    error,
    onSign,
    className,
    ...rest
  },
  ref
) {
  const [pin, setPin] = useControllableState(pinProp, '', onPinChange);
  const [code, setCode] = useControllableState(codeProp, '', onCodeChange);
  const complete = pin.length === FACTOR_LENGTH && code.length === FACTOR_LENGTH;
  return (
    <Card
      ref={ref}
      title="Sign controlled substance prescription"
      subtitle="EPCS two-factor signing (DEA 21 CFR 1311)"
      className={cx('co-epcs', className)}
      {...rest}
    >
      <DescriptionList
        items={[
          ['Drug', drug],
          ['Schedule', schedule],
          ['Sig', sig],
          ['Quantity', schedule === 'C-II' ? `${qty} (no refills for C-II)` : String(qty)],
          ['Prescriber', `${prescriber} . DEA ${dea}`],
          ['PDMP', pdmp || 'Checked today 10:02 AM, no concerns'],
        ]}
      />
      {state === 'done' ? (
        <Alert tone="success" title={`Signed and sent to ${pharmacy || 'the pharmacy'}`}>
          {`Audit record EPCS-${audit || '000123'} written.`}
        </Alert>
      ) : state === 'locked' ? (
        <Alert tone="error" title="Signing locked">
          Too many failed attempts. Ask the EPCS admin to reset your token.
        </Alert>
      ) : (
        <div className="co-row co-epcs-row">
          <PinEntry length={FACTOR_LENGTH} label="Enter your signing PIN" value={pin} onChange={setPin} error={error} />
          <div className="co-dt co-epcs-f">
            <TextField
              label="One-time code from your token"
              placeholder="6 digits"
              required
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={FACTOR_LENGTH}
              value={code}
              onChange={(v) => setCode(v.replace(/\D/g, '').slice(0, FACTOR_LENGTH))}
            />
            <Button variant="primary" full disabled={!complete} onClick={() => onSign?.({ pin, code })}>
              Sign and Send
            </Button>
            <span className="co-help">Both factors are required. Nobody else may enter them for you.</span>
          </div>
        </div>
      )}
    </Card>
  );
});
