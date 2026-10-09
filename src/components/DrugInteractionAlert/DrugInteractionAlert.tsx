import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { useControllableState } from '../../internal/hooks';
import { Alert } from '../Alert/Alert';
import { Button } from '../Button/Button';
import { Select } from '../Select/Select';

export type DrugAlertKind = 'interaction' | 'duplicate' | 'allergy';
export type DrugAlertSeverity = 'contraindicated' | 'severe' | 'moderate';

/** Default override reasons. */
export const drugAlertOverrideReasons = [
  'Benefit outweighs risk',
  'Patient tolerated before',
  'Will monitor levels',
  'Allergy is intolerance only',
  'Alert not relevant',
];

const PREFIX: Record<DrugAlertKind, string> = {
  interaction: 'Drug interaction: ',
  duplicate: 'Duplicate therapy: ',
  allergy: 'Allergy alert: ',
};

export interface DrugInteractionAlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 'interaction' | 'duplicate' | 'allergy': sets the title prefix; default 'interaction' */
  kind?: DrugAlertKind;
  /** The drugs involved ("Sertraline + Tramadol"); required */
  title: string;
  /** What the risk is; required */
  body: string;
  /** 'contraindicated' | 'severe' | 'moderate'; contraindicated and severe are red, moderate amber; default 'moderate' */
  severity?: DrugAlertSeverity;
  /** Knowledge base ("First Databank"); default none */
  source?: string;
  /** false: no override, the prescriber must choose another drug; default true */
  overridable?: boolean;
  /** Override reasons; default drugAlertOverrideReasons */
  reasons?: string[];
  /** Chosen override reason (controlled); default undefined (uncontrolled) */
  reason?: string;
  /** Initial override reason (uncontrolled); default "" */
  defaultReason?: string;
  /** Called when the override reason changes; default none */
  onReasonChange?: (reason: string) => void;
  /** Override and Continue clicked, with the reason; default none */
  onOverride?: (reason: string) => void;
  /** Change Order clicked; default none */
  onChangeOrder?: () => void;
}

/**
 * DrugInteractionAlert (and AllergyAlert) stops an order for an interaction, duplicate or allergy and asks for an
 * override reason or a change. Override and Continue stays disabled until a reason is chosen.
 */
export const DrugInteractionAlert = forwardRef<HTMLDivElement, DrugInteractionAlertProps>(function DrugInteractionAlert(
  {
    kind = 'interaction',
    title,
    body,
    severity = 'moderate',
    source,
    overridable = true,
    reasons = drugAlertOverrideReasons,
    reason: reasonProp,
    defaultReason = '',
    onReasonChange,
    onOverride,
    onChangeOrder,
    className,
    ...rest
  },
  ref
) {
  const [reason, setReason] = useControllableState(reasonProp, defaultReason, onReasonChange);
  const tone = severity === 'contraindicated' || severity === 'severe' ? 'error' : 'warning';
  return (
    <Alert
      ref={ref}
      tone={tone}
      title={(PREFIX[kind] ?? PREFIX.interaction) + title}
      className={cx('co-dia', className)}
      {...rest}
    >
      <span>{body}</span>
      {source ? <span className="co-mi-s">{`Source: ${source}`}</span> : null}
      {overridable === false ? (
        <b>This combination cannot be overridden. Choose another drug.</b>
      ) : (
        <span className="co-row co-gap-8 co-dia-row">
          <span className="co-dia-reason">
            <Select
              label="Override reason"
              required
              placeholder="Choose a reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              options={reasons}
            />
          </span>
          <Button size="sm" variant="danger" disabled={!reason} onClick={() => onOverride?.(reason)}>
            Override and Continue
          </Button>
          <Button size="sm" variant="primary" onClick={onChangeOrder}>
            Change Order
          </Button>
        </span>
      )}
    </Alert>
  );
});

export type AllergyAlertProps = DrugInteractionAlertProps;

/** AllergyAlert is DrugInteractionAlert with `kind="allergy"` ("Allergy alert: Amoxicillin"). */
export const AllergyAlert = forwardRef<HTMLDivElement, AllergyAlertProps>(function AllergyAlert(props, ref) {
  return <DrugInteractionAlert ref={ref} kind="allergy" {...props} />;
});
