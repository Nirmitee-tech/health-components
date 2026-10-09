import { forwardRef, type HTMLAttributes } from 'react';
import { RangeContextProvider, dose as formatDose, doseNumber, type RangeContextId } from '../../clinical';
import { useControllableState } from '../../internal/hooks';
import { Dose } from '../../internal/inpatientFlow';
import { Alert, type AlertTone } from '../Alert/Alert';
import { Badge, type BadgeTone } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { Icon, type IconName } from '../Icon/Icon';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import { Select } from '../Select/Select';
import { Switch } from '../Switch/Switch';
import { TextField } from '../TextField/TextField';

/** Order priority. */
export type OrderPriority = 'routine' | 'now' | 'stat';

/** Verification status of the order. */
export type OrderVerifyStatus = 'draft' | 'pending' | 'verified' | 'rejected' | 'override';

/** A warning shown with the order. */
export interface OrderWarning {
  /** Alert tone; default 'warning' */
  tone?: AlertTone;
  /** Bold first line; default none */
  title?: string;
  /** Body text */
  text: string;
}

/** The order being written. */
export interface InpatientOrder {
  /** Medication name */
  name?: string;
  /** Dose amount */
  dose?: number;
  /** Dose unit */
  unit?: string;
  /** Route; default 'PO' */
  route?: string;
  /** Frequency; default 'q6h' */
  freq?: string;
  /** As needed; default false */
  prn?: boolean;
  /** PRN reason; default none */
  prnReason?: string;
  /** Maximum dose in 24 hours (PRN); default none */
  maxDaily?: number;
  /** Duration; default '3 days' */
  duration?: string;
  /** Priority; default 'routine' */
  priority?: OrderPriority;
  /** Weight-based dosing note ('15 mg/kg, 83 kg'); default none */
  weightBased?: string;
  /** Warnings shown with the order; default none */
  warnings?: OrderWarning[];
}

/** The parts of the order the prescriber edits here. */
export interface InpatientOrderDraft {
  /** Frequency */
  freq: string;
  /** As needed */
  prn: boolean;
  /** PRN reason ('' when none) */
  prnReason: string;
  /** Priority */
  priority: OrderPriority;
  /** Duration */
  duration: string;
}

/** Frequencies offered. */
export const orderFrequencies: readonly string[] = [
  'Once',
  'Daily',
  'BID',
  'TID',
  'QID',
  'q4h',
  'q6h',
  'q8h',
  'q12h',
  'At bedtime',
  'Continuous',
];
const ROUTES = ['PO', 'SL', 'IV', 'IV push', 'IM', 'SubQ', 'PR', 'Inhaled', 'Topical', 'NG tube'];
const DURATIONS = ['Once', '24 hours', '3 days', '5 days', '7 days', '14 days', 'Until discontinued'];
const PRN_REASONS = [
  'Pain, mild (1 to 3)',
  'Pain, moderate (4 to 6)',
  'Pain, severe (7 to 10)',
  'Nausea or vomiting',
  'Fever above 38.5 °C',
  'Anxiety',
  'Insomnia',
  'Shortness of breath',
  'Constipation',
];
const VERIFY: Record<OrderVerifyStatus, { tone: BadgeTone; label: string; icon?: IconName }> = {
  pending: {
    tone: 'warning',
    label: 'Pending pharmacist verification',
    icon: 'clock',
  },
  verified: { tone: 'success', label: 'Verified by pharmacist', icon: 'check' },
  rejected: {
    tone: 'danger',
    label: 'Returned by pharmacist',
    icon: 'alert-circle',
  },
  draft: { tone: 'neutral', label: 'Not signed' },
  override: {
    tone: 'ai',
    label: 'Override: given before verification',
    icon: 'alert',
  },
};

/** The order sentence: 'Oxycodone 2.5 mg PO q4h PRN Pain, moderate (4 to 6) for 3 days'. */
export function orderSentence(order: InpatientOrder, draft: InpatientOrderDraft): string {
  const { freq, prn, prnReason, priority, duration } = draft;
  return [
    order.name,
    order.dose != null ? formatDose(order.dose, order.unit) : null,
    order.route,
    freq,
    prn ? 'PRN ' + (prnReason || '(reason needed)') : null,
    duration === 'Once' ? null : duration === 'Until discontinued' ? 'until discontinued' : 'for ' + duration,
    priority === 'routine' ? null : priority.toUpperCase(),
  ]
    .filter(Boolean)
    .join(' ');
}

export interface InpatientOrderEntryProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'onChange'> {
  /** { name, dose, unit, route, freq, prn, prnReason, maxDaily, duration, priority, weightBased, warnings: [{ tone, title, text }] }; required */
  order: InpatientOrder;
  /** Frequency, PRN, PRN reason, priority and duration (controlled); default uncontrolled from `order` */
  value?: InpatientOrderDraft;
  /** Called with the new draft when the prescriber changes it; default none */
  onChange?: (draft: InpatientOrderDraft) => void;
  /** 'draft' | 'pending' | 'verified' | 'rejected' | 'override'; default 'draft' */
  status?: OrderVerifyStatus;
  /** 'prescriber' | 'pharmacist'; default 'prescriber' */
  role?: 'prescriber' | 'pharmacist';
  /** Patient line; default none */
  patient?: string;
  /** Pharmacist who verified it; default none */
  verifiedBy?: string;
  /** When it was verified; default none */
  verifiedAt?: string;
  /** Pharmacist who returned it; default 'pharmacy' */
  pharmacist?: string;
  /** Why it was returned; default none */
  pharmacistNote?: string;
  /** Nurse who gave it before verification; default 'the nurse' */
  overrideBy?: string;
  /** Shows required-field errors; default false */
  showErrors?: boolean;
  /** View only; default false */
  readOnly?: boolean;
  /** Called by Sign Order with the draft and the order sentence; default none */
  onSign?: (draft: InpatientOrderDraft, sentence: string) => void;
  /** Called by Verify (pharmacist); default none */
  onVerify?: () => void;
  /** Called by Return to Prescriber (pharmacist); default none */
  onReturn?: () => void;
  /** Called by Cancel; default none */
  onCancel?: () => void;
  /** Which shared reference range flags use; the lab range on a result still wins; default 'inpatient' when no global context is set */
  rangeContext?: RangeContextId;
}

/**
 * InpatientOrderEntry writes one inpatient medication order with dose, route, frequency, duration, PRN reason and
 * priority, shows the order sentence as it is built, and tracks pharmacist verification.
 */
export const InpatientOrderEntry = forwardRef<HTMLElement, InpatientOrderEntryProps>(function InpatientOrderEntry(
  {
    order: d,
    value,
    onChange,
    status = 'draft',
    role = 'prescriber',
    patient,
    verifiedBy,
    verifiedAt,
    pharmacist,
    pharmacistNote,
    overrideBy,
    showErrors = false,
    readOnly = false,
    onSign,
    onVerify,
    onReturn,
    onCancel,
    rangeContext,
    ...rest
  },
  ref
) {
  const [draft, setDraft] = useControllableState<InpatientOrderDraft>(
    value,
    {
      freq: d.freq || 'q6h',
      prn: !!d.prn,
      prnReason: d.prnReason || '',
      priority: d.priority || 'routine',
      duration: d.duration || '3 days',
    },
    onChange
  );
  const update = (patch: Partial<InpatientOrderDraft>) => setDraft({ ...draft, ...patch });
  const { freq, prn, prnReason, priority: pri, duration: dur } = draft;
  const v = VERIFY[status] ?? VERIFY.draft;
  const missing = prn && !prnReason;
  const sentence = orderSentence(d, draft);
  return (
    <RangeContextProvider value={rangeContext}>
      <Card
        ref={ref}
        title="New Inpatient Order"
        subtitle={patient}
        actions={
          <Badge tone={v.tone} icon={v.icon}>
            {v.label}
          </Badge>
        }
        {...rest}
      >
        {status === 'rejected' && pharmacistNote ? (
          <div style={{ marginBottom: 10 }}>
            <Alert tone="error" title={'Returned by ' + (pharmacist || 'pharmacy')}>
              {pharmacistNote}
            </Alert>
          </div>
        ) : null}
        {status === 'override' ? (
          <div style={{ marginBottom: 10 }}>
            <Alert tone="warning" title="Given before pharmacist review">
              {'STAT override documented by ' + (overrideBy || 'the nurse') + '. Pharmacy reviews it retrospectively.'}
            </Alert>
          </div>
        ) : null}
        <div className="ip-form">
          <TextField label="Medication" required defaultValue={d.name} readOnly={readOnly} />
          <TextField
            label="Dose"
            required
            defaultValue={d.dose != null ? doseNumber(d.dose) : ''}
            suffix={d.unit}
            readOnly={readOnly}
            helper={d.weightBased ? 'Weight-based: ' + d.weightBased : undefined}
          />
          <Select label="Route" required defaultValue={d.route || 'PO'} options={ROUTES} readOnly={readOnly} />
          <Select
            label="Frequency"
            required
            value={freq}
            options={orderFrequencies as string[]}
            onChange={(e) => update({ freq: e.target.value })}
            readOnly={readOnly}
          />
          <Select
            label="Duration"
            value={dur}
            options={DURATIONS}
            onChange={(e) => update({ duration: e.target.value })}
            readOnly={readOnly}
          />
          <div>
            <div className="co-lbl" style={{ marginBottom: 6 }} aria-hidden="true">
              Priority
            </div>
            <SegmentedControl
              label="Priority"
              value={pri}
              onChange={(p) => update({ priority: p as OrderPriority })}
              options={[
                { value: 'routine', label: 'Routine', disabled: readOnly },
                { value: 'now', label: 'Now', disabled: readOnly },
                { value: 'stat', label: 'STAT', disabled: readOnly },
              ]}
            />
          </div>
        </div>
        <div
          style={{
            marginTop: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <Switch label="As needed (PRN)" checked={prn} onChange={(on) => update({ prn: on })} disabled={readOnly} />
          {prn ? (
            <div className="ip-form">
              <Select
                label="PRN reason"
                required
                placeholder="Choose a reason"
                value={prnReason}
                onChange={(e) => update({ prnReason: e.target.value })}
                error={missing && showErrors ? 'A PRN order needs a reason' : undefined}
                options={PRN_REASONS}
                readOnly={readOnly}
              />
              {d.maxDaily != null ? (
                <div>
                  <div className="co-lbl" style={{ marginBottom: 6 }}>
                    Maximum in 24 hours
                  </div>
                  <Dose value={d.maxDaily} unit={d.unit} />
                </div>
              ) : null}
            </div>
          ) : null}
          {pri === 'stat' ? (
            <Alert tone="warning" title="STAT">
              Pharmacy and the nurse are paged. Expect the first dose within 30 minutes.
            </Alert>
          ) : null}
          {(d.warnings || []).map((w, i) => (
            <Alert key={i} tone={w.tone || 'warning'} title={w.title}>
              {w.text}
            </Alert>
          ))}
          <div className="co-kl">Order sentence</div>
          <div className="ip-sum" aria-live="polite">
            {sentence}
          </div>
          {status === 'verified' && verifiedBy ? (
            <div className="ip-ver">
              <Icon name="shield" size={14} />
              {'Verified by ' + verifiedBy + (verifiedAt ? ' at ' + verifiedAt : '')}
            </div>
          ) : null}
          <div className="co-row co-gap-8" style={{ justifyContent: 'flex-end' }}>
            <Button onClick={onCancel}>Cancel</Button>
            {role === 'pharmacist' && status === 'pending' ? (
              <>
                <Button variant="danger" onClick={onReturn}>
                  Return to Prescriber
                </Button>
                <Button variant="primary" iconLeft="check" onClick={onVerify}>
                  Verify
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                disabled={readOnly || missing || status !== 'draft'}
                onClick={() => onSign?.(draft, sentence)}
              >
                {pri === 'stat' ? 'Sign STAT Order' : 'Sign Order'}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </RangeContextProvider>
  );
});
