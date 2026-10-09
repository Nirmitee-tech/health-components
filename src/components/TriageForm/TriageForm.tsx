import { forwardRef, useState, type HTMLAttributes } from 'react';
import { RangeContextProvider, type RangeContextId } from '../../clinical';
import { AcuteValue, esiLevel, type AcuteMeasureKey, type ESIResult } from '../../internal/acute';
import { Alert } from '../Alert/Alert';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { Checkbox } from '../Checkbox/Checkbox';
import { ESIBadge, type ESILevel } from '../EDTrackingBoard/EDTrackingBoard';
import { Select } from '../Select/Select';
import { TextField } from '../TextField/TextField';

export { dangerZone, esiLevel } from '../../internal/acute';
export type { ESIInput, ESIResult } from '../../internal/acute';

/** Expected ESI resources: none, one, or two or more. */
export type TriageResources = 0 | 1 | '2+';
type VitalKey = 'hr' | 'sbp' | 'dbp' | 'rr' | 'spo2' | 'temp' | 'pain' | 'glucose';

/** Triage answers. Vitals are numbers; a blank vital is null. */
export interface TriageValues {
  /** Chief complaint in the patient's words */
  complaint?: string;
  /** 'Walk-in' | 'EMS ground' | 'EMS air' | 'Police' | 'Transfer' */
  arrival?: string;
  hr?: number | null;
  sbp?: number | null;
  dbp?: number | null;
  rr?: number | null;
  spo2?: number | null;
  temp?: number | null;
  pain?: number | null;
  glucose?: number | null;
  /** A: needs an immediate life-saving intervention */
  lifeSaving?: boolean;
  /** B: high-risk situation */
  highRisk?: boolean;
  /** B: new confusion, lethargy or disorientation */
  confused?: boolean;
  /** B: severe pain or distress */
  severePain?: boolean;
  /** C: resources expected */
  resources?: TriageResources | null;
  /** Nurse override level '1' to '5'; '' accepts the suggestion */
  override?: string;
}

/** What onSubmit and onSaveDraft receive. */
export interface TriageSubmitValues extends TriageValues {
  /** Final ESI level: the override, else the suggestion; null when no suggestion yet (drafts) */
  esi: ESILevel | null;
  /** The suggested level and its decision point; null when not enough is answered */
  suggestion: ESIResult | null;
}

export interface TriageFormProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'onSubmit'> {
  /** Initial answers (the form is uncontrolled); default {} */
  defaultValues?: TriageValues;
  /** Positive isolation screen name, shown as a warning; default none */
  isolation?: string;
  /** Marks a missing chief complaint; default false */
  showErrors?: boolean;
  /** Signed triage: every field locked, no actions; default false */
  readOnly?: boolean;
  /** Card subtitle (patient, arrival time); default none */
  subtitle?: string;
  /** Called by Complete Triage with the values and the final ESI; default none */
  onSubmit?: (values: TriageSubmitValues) => void;
  /** Called by Save Draft; default none */
  onSaveDraft?: (values: TriageSubmitValues) => void;
  /** Which shared reference range flags use; the lab range on a result still wins; default 'ed' when no global context is set */
  rangeContext?: RangeContextId;
}

interface Draft {
  complaint: string;
  arrival: string;
  vitals: Record<VitalKey, string>;
  lifeSaving: boolean;
  highRisk: boolean;
  confused: boolean;
  severePain: boolean;
  resources: string;
  override: string;
}

const VITALS: ReadonlyArray<[VitalKey, string, string]> = [
  ['hr', 'Heart rate', 'bpm'],
  ['sbp', 'Systolic', 'mmHg'],
  ['dbp', 'Diastolic', 'mmHg'],
  ['rr', 'Resp rate', '/min'],
  ['spo2', 'SpO2', '%'],
  ['temp', 'Temp', '°C'],
  ['pain', 'Pain', '/10'],
  ['glucose', 'Glucose', 'mg/dL'],
];

const toNum = (s: string): number | null => (s.trim() === '' || Number.isNaN(Number(s)) ? null : Number(s));
const str = (v: number | null | undefined) => (v == null ? '' : String(v));

function initDraft(d: TriageValues): Draft {
  const vitals = {} as Record<VitalKey, string>;
  for (const [k] of VITALS) vitals[k] = str(d[k]);
  return {
    complaint: d.complaint || '',
    arrival: d.arrival || 'Walk-in',
    vitals,
    lifeSaving: !!d.lifeSaving,
    highRisk: !!d.highRisk,
    confused: !!d.confused,
    severePain: !!d.severePain,
    resources: d.resources != null ? String(d.resources) : '',
    override: d.override || '',
  };
}

/** The ESI suggestion for a draft; null until A, B or C is answered. */
function suggest(v: Draft): ESIResult | null {
  if (v.resources === '' && !v.lifeSaving && !v.highRisk && !v.confused && !v.severePain) return null;
  return esiLevel({
    lifeSaving: v.lifeSaving,
    highRisk: v.highRisk,
    confused: v.confused,
    severePain: v.severePain,
    resources: v.resources === '2+' ? 2 : Number(v.resources) || 0,
    vitals: { hr: toNum(v.vitals.hr), rr: toNum(v.vitals.rr), spo2: toNum(v.vitals.spo2) },
  });
}

/**
 * TriageForm records the chief complaint, arrival mode and triage vitals, and suggests an Emergency Severity Index
 * (ESI v4) level that the nurse confirms or overrides.
 */
export const TriageForm = forwardRef<HTMLElement, TriageFormProps>(function TriageForm(
  { defaultValues, isolation, showErrors = false, readOnly = false, subtitle, onSubmit, onSaveDraft, rangeContext, ...rest },
  ref
) {
  const [v, setV] = useState<Draft>(() => initDraft(defaultValues || {}));
  const res = suggest(v);
  const ro = readOnly;
  const finalEsi: ESILevel | null = v.override ? (Number(v.override) as ESILevel) : res ? res.level : null;
  const patch = (p: Partial<Draft>) => setV((cur) => ({ ...cur, ...p }));
  const setVital = (k: VitalKey, s: string) => setV((cur) => ({ ...cur, vitals: { ...cur.vitals, [k]: s } }));

  const values = (): TriageSubmitValues => {
    const out: TriageSubmitValues = {
      complaint: v.complaint,
      arrival: v.arrival,
      lifeSaving: v.lifeSaving,
      highRisk: v.highRisk,
      confused: v.confused,
      severePain: v.severePain,
      resources: v.resources === '' ? null : v.resources === '2+' ? '2+' : (Number(v.resources) as 0 | 1),
      override: v.override,
      esi: finalEsi,
      suggestion: res,
    };
    for (const [k] of VITALS) out[k] = toNum(v.vitals[k]);
    return out;
  };

  return (
    <Card
      ref={ref}
      title="Triage"
      subtitle={subtitle}
      actions={
        ro ? (
          <Badge tone="neutral" icon="lock">
            Signed
          </Badge>
        ) : null
      }
      {...rest}
    >
      <RangeContextProvider value={rangeContext}>
        {isolation ? (
          <Alert tone="warning" title={'Screen positive: ' + isolation}>
            Mask the patient and room in isolation before vitals.
          </Alert>
        ) : null}
        <div className="co-tri-top">
          <TextField
            label="Chief complaint"
            required
            value={v.complaint}
            onChange={(s) => patch({ complaint: s })}
            readOnly={ro}
            error={showErrors && !v.complaint ? "Enter the chief complaint in the patient's words" : undefined}
          />
          <Select
            label="Arrival"
            value={v.arrival}
            onChange={(e) => patch({ arrival: e.target.value })}
            readOnly={ro}
            options={['Walk-in', 'EMS ground', 'EMS air', 'Police', 'Transfer']}
          />
        </div>
        <h3 className="co-h co-ac-h3">Vitals</h3>
        <div className="co-tri-vitals">
          {VITALS.map(([k, label, unit]) => (
            <div key={k} className="co-tri-vf">
              <TextField
                label={label}
                value={v.vitals[k]}
                onChange={(s) => setVital(k, s)}
                suffix={unit}
                inputMode="decimal"
                readOnly={ro}
                size="sm"
              />
              <div className="co-tri-vf-v">
                {v.vitals[k] === '' ? null : <AcuteValue measure={k as AcuteMeasureKey} value={toNum(v.vitals[k])} />}
              </div>
            </div>
          ))}
        </div>
        <h3 className="co-h co-ac-h3">Emergency Severity Index</h3>
        <div className="co-tri-esi">
          <Checkbox
            label="A. Needs an immediate life-saving intervention"
            description="Airway, emergency medications, or hemodynamic support now."
            checked={v.lifeSaving}
            onChange={(e) => patch({ lifeSaving: e.target.checked })}
            disabled={ro}
          />
          <Checkbox
            label="B. High-risk situation"
            description="Such as chest pain concerning for ACS, stroke symptoms, ectopic pregnancy."
            checked={v.highRisk}
            onChange={(e) => patch({ highRisk: e.target.checked })}
            disabled={ro}
          />
          <Checkbox
            label="B. New confusion, lethargy or disorientation"
            checked={v.confused}
            onChange={(e) => patch({ confused: e.target.checked })}
            disabled={ro}
          />
          <Checkbox
            label="B. Severe pain or distress (7/10 or more)"
            checked={v.severePain}
            onChange={(e) => patch({ severePain: e.target.checked })}
            disabled={ro}
          />
          <div className="co-tri-res">
            <Select
              label="C. Resources expected"
              value={v.resources}
              onChange={(e) => patch({ resources: e.target.value })}
              readOnly={ro}
              options={[
                { value: '', label: 'Choose' },
                { value: '0', label: 'None' },
                { value: '1', label: 'One (such as labs, or an X-ray)' },
                { value: '2+', label: 'Two or more' },
              ]}
            />
          </div>
        </div>
        <div className="co-ac-status">
          <div role="status" aria-live="polite" className="co-row co-gap-8 co-ac-wrap co-tri-reason">
            {res ? (
              <>
                <ESIBadge level={finalEsi} showLabel />
                <span className="co-muted co-tri-reason">
                  {v.override ? 'Nurse override from suggested ESI ' + res.level + '. ' + res.reason : 'Suggested. ' + res.reason}
                </span>
              </>
            ) : (
              <span className="co-muted">Answer A, B and C to get a suggested ESI level. The triage nurse confirms it.</span>
            )}
          </div>
          {res && !ro ? (
            <div className="co-tri-ovr">
              <Select
                label="Nurse override"
                size="sm"
                value={v.override}
                onChange={(e) => patch({ override: e.target.value })}
                options={[{ value: '', label: 'Accept suggestion' }, '1', '2', '3', '4', '5']}
              />
            </div>
          ) : null}
        </div>
        {ro ? null : (
          <div className="co-row co-gap-8 co-tri-actions">
            <Button variant="primary" disabled={!res || !v.complaint} onClick={() => onSubmit?.(values())}>
              Complete Triage
            </Button>
            <Button onClick={() => onSaveDraft?.(values())}>Save Draft</Button>
          </div>
        )}
      </RangeContextProvider>
    </Card>
  );
});
