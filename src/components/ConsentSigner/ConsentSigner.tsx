import { forwardRef, useState, type HTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { useControllableState, useDomId } from '../../internal/hooks';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { Checkbox } from '../Checkbox/Checkbox';
import { SignaturePad } from '../SignaturePad/SignaturePad';
import { TextField } from '../TextField/TextField';

/** What ConsentSigner hands to `onSignConsent`. */
export interface ConsentSignature {
  /** Signer name */
  signer: string;
  /** Relationship to the patient when a guardian signs; undefined for the patient */
  guardian?: string;
}

export interface ConsentSignerProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Consent title ("Consent for Telehealth Services"); also names the document region. Required */
  title: string;
  /** Version and effective date ("Version 3 . effective 01/01/2026"). Required */
  version: string;
  /** Consent text; blank lines separate paragraphs. Required */
  body: string;
  /** Name of the person signing. Required */
  signer: string;
  /** Relationship to the patient; shows the guardian field when set; default none */
  guardian?: string;
  /** Agree box ticked initially (uncontrolled); default false */
  agreed?: boolean;
  /** Agree box state (controlled); default undefined (uncontrolled) */
  agreedValue?: boolean;
  /** Called when the agree box changes; default none */
  onAgreedChange?: (agreed: boolean) => void;
  /** Signature present initially (uncontrolled); default false */
  signed?: boolean;
  /** Called when the signature is added or cleared; default none */
  onSignedChange?: (signed: boolean) => void;
  /** Agree box label; default "I have read and agree to this consent." */
  agreeLabel?: string;
  /** Signature pad label; default "Patient Signature" */
  signerLabel?: string;
  /** Shorter signature pad; default false */
  compact?: boolean;
  /** Called by Sign Consent (enabled once agreed and signed); default none */
  onSignConsent?: (signature: ConsentSignature) => void;
  /** Called by Decline; default none */
  onDecline?: () => void;
}

/** ConsentSigner shows a consent document in a scroll box with agree, signature and guardian fields. */
export const ConsentSigner = forwardRef<HTMLElement, ConsentSignerProps>(function ConsentSigner(
  {
    title,
    version,
    body,
    signer,
    guardian,
    agreed = false,
    agreedValue,
    onAgreedChange,
    signed = false,
    onSignedChange,
    agreeLabel = 'I have read and agree to this consent.',
    signerLabel = 'Patient Signature',
    compact = false,
    onSignConsent,
    onDecline,
    className,
    id,
    ...rest
  },
  ref
) {
  const base = useDomId('consent', id);
  const [ok, setOk] = useControllableState(agreedValue, agreed, onAgreedChange);
  const [isSigned, setSigned] = useState(signed);
  const [relation, setRelation] = useState(guardian ?? '');
  const isGuardian = guardian !== undefined;
  const ready = ok && isSigned && (!isGuardian || relation.trim() !== '');

  return (
    <Card ref={ref} id={id} title={title} subtitle={version} className={cx('co-consent', className)} {...rest}>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- scrollable document must be keyboard focusable so it can be scrolled (axe scrollable-region-focusable). */}
      <div className="co-consentdoc" tabIndex={0} role="document" aria-label={title} id={`${base}-doc`}>
        {body}
      </div>
      <Checkbox label={agreeLabel} checked={ok} onChange={(e) => setOk(e.target.checked)} />
      <SignaturePad
        label={signerLabel}
        name={signer}
        defaultSigned={signed}
        onSignedChange={(s) => {
          setSigned(s);
          onSignedChange?.(s);
        }}
        required
        compact={compact}
      />
      {isGuardian ? (
        <TextField label="Relationship to patient" value={relation} onChange={(v) => setRelation(v)} required />
      ) : null}
      <div className="co-row co-gap-8">
        <Button
          variant="primary"
          disabled={!ready}
          onClick={() => onSignConsent?.({ signer, guardian: isGuardian ? relation : undefined })}
        >
          Sign Consent
        </Button>
        <Button variant="tertiary" onClick={onDecline}>
          Decline
        </Button>
      </div>
    </Card>
  );
});
