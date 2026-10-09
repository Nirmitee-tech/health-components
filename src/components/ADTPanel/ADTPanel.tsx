import { forwardRef, type HTMLAttributes } from 'react';
import { RangeContextProvider, type RangeContextId } from '../../clinical';
import { useControllableState, useDomId } from '../../internal/hooks';
import { Alert } from '../Alert/Alert';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { IsolationBadge, type IsolationType } from '../IsolationBadge/IsolationBadge';
import { LevelOfCareBadge, levelsOfCare, type LevelOfCare } from '../LevelOfCareBadge/LevelOfCareBadge';
import { Select } from '../Select/Select';
import { Tabs } from '../Tabs/Tabs';
import { TextField } from '../TextField/TextField';

/** ADT action. */
export type ADTMode = 'admit' | 'transfer' | 'discharge';

/** The patient in an ADT panel. */
export interface ADTPatient {
  /** 'Last, First' */
  name: string;
  /** Medical record number */
  mrn: string;
  /** Current location ('ED Bay 7', '4 West 401A') */
  location: string;
  /** Current level of care; default none */
  level?: LevelOfCare;
  /** Isolation type; default none */
  isolation?: IsolationType;
  /** 'inpatient' enables Transfer and Discharge and disables Admit; anything else ('ed', 'obs') the reverse */
  status?: string;
}

/** What onSubmit receives. */
export interface ADTSubmit {
  /** 'admit' | 'transfer' | 'discharge' */
  mode: ADTMode;
  /** Level of care chosen (admit, transfer) */
  level: string;
  /** Admitting diagnosis, reason for transfer or discharge disposition */
  reason: string;
}

/** Discharge dispositions. */
export const dischargeDispositions: readonly string[] = [
  'Home',
  'Home with home health',
  'Skilled nursing facility',
  'Inpatient rehab',
  'Long-term acute care',
  'Hospice',
  'Left against medical advice',
  'Expired',
  'Transfer to another hospital',
];

const DEFAULT_UNITS = ['4 West Med-Surg', '5 East Telemetry', '3 North Step-down', 'MICU'];
const DEFAULT_ATTENDINGS = [
  'Dr. Priya Raman, Hospital Medicine',
  'Dr. Marcus Feld, Cardiology',
  'Dr. Ana Ortiz, General Surgery',
];
const NO_BLOCKERS: string[] = [];
const LEVEL_OPTIONS = (['icu', 'stepdown', 'tele', 'medsurg', 'obs'] as const).map((k) => ({
  value: k,
  label: levelsOfCare[k].label,
}));
const CTA: Record<ADTMode, string> = {
  admit: 'Admit Patient',
  transfer: 'Request Transfer',
  discharge: 'Discharge Patient',
};
const DONE_TITLE: Record<ADTMode, string> = {
  admit: 'Admission placed',
  transfer: 'Transfer requested',
  discharge: 'Discharge complete',
};

export interface ADTPanelProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'onSubmit'> {
  /** { name, mrn, location, level, isolation, status }; required */
  patient: ADTPatient;
  /** 'admit' | 'transfer' | 'discharge': the starting action (uncontrolled); default 'admit' */
  mode?: ADTMode;
  /** The action (controlled); pair with onModeChange; default uncontrolled */
  modeValue?: ADTMode;
  /** Called with the new action; default none */
  onModeChange?: (mode: ADTMode) => void;
  /** Starting level of care (uncontrolled); default 'medsurg' */
  level?: string;
  /** Level of care (controlled); default uncontrolled */
  levelValue?: string;
  /** Called with the new level of care; default none */
  onLevelChange?: (level: string) => void;
  /** Starting reason, diagnosis or disposition (uncontrolled); default '' */
  reason?: string;
  /** Reason (controlled); default uncontrolled */
  reasonValue?: string;
  /** Called with the new reason; default none */
  onReasonChange?: (reason: string) => void;
  /** string[]: open discharge items that block discharge; default [] */
  blockers?: string[];
  /** string[]: target units for a transfer; default sample list */
  units?: string[];
  /** string[]: attendings; default sample list */
  attendings?: string[];
  /** Discharge date and time shown at start; default '10/09/2026 14:30' */
  dischargeAt?: string;
  /** Shows required-field errors; default false */
  showErrors?: boolean;
  /** Shows the confirmation (already submitted); default false */
  done?: boolean;
  /** View only; default false */
  readOnly?: boolean;
  /** function({ mode, level, reason }) on the main action; default none */
  onSubmit?: (value: ADTSubmit) => void;
  /** function on Cancel; default none */
  onCancel?: () => void;
  /** Which shared reference range flags use; the lab range on a result still wins; default 'inpatient' when no global context is set */
  rangeContext?: RangeContextId;
}

/** ADTPanel admits, transfers and discharges a patient: level of care, attending and reason for admit and transfer, and disposition for discharge. */
export const ADTPanel = forwardRef<HTMLElement, ADTPanelProps>(function ADTPanel(
  {
    patient: pt,
    mode: initialMode = 'admit',
    modeValue,
    onModeChange,
    level: initialLevel = 'medsurg',
    levelValue,
    onLevelChange,
    reason: initialReason = '',
    reasonValue,
    onReasonChange,
    blockers = NO_BLOCKERS,
    units = DEFAULT_UNITS,
    attendings = DEFAULT_ATTENDINGS,
    dischargeAt = '10/09/2026 14:30',
    showErrors = false,
    done: initialDone = false,
    readOnly = false,
    onSubmit,
    onCancel,
    rangeContext,
    id,
    ...rest
  },
  ref
) {
  const base = useDomId('ip-adt', id);
  const [mode, setMode] = useControllableState<ADTMode>(modeValue, initialMode, onModeChange);
  const [lvl, setLvl] = useControllableState(levelValue, initialLevel, onLevelChange);
  const [reason, setReason] = useControllableState(reasonValue, initialReason, onReasonChange);
  const [done, setDone] = useControllableState<boolean>(undefined, initialDone);
  const need = mode === 'discharge' ? (reason ? 0 : 1) + blockers.length : reason ? 0 : 1;
  const inpatient = pt.status === 'inpatient';
  const stepDown =
    mode === 'transfer' &&
    Object.prototype.hasOwnProperty.call(levelsOfCare, lvl) &&
    pt.level != null &&
    (pt.level === 'icu' || pt.level === 'stepdown') &&
    (lvl === 'tele' || lvl === 'medsurg');

  return (
    <RangeContextProvider value={rangeContext}>
      <Card
        ref={ref}
        id={id}
        title="Admit, Transfer, Discharge"
        subtitle={pt.name ? pt.name + ' · MRN ' + pt.mrn + ' · ' + pt.location : undefined}
        actions={
          pt.level || pt.isolation ? (
            <span className="co-row co-gap-6">
              {pt.level ? <LevelOfCareBadge level={pt.level} size="sm" /> : null}
              {pt.isolation ? <IsolationBadge type={pt.isolation} size="sm" compact /> : null}
            </span>
          ) : undefined
        }
        {...rest}
      >
        <Tabs
          id={`${base}-tabs`}
          label="ADT action"
          value={mode}
          items={[
            {
              id: 'admit',
              label: 'Admit',
              disabled: inpatient,
              panelId: `${base}-panel`,
            },
            {
              id: 'transfer',
              label: 'Transfer',
              disabled: !inpatient,
              panelId: `${base}-panel`,
            },
            {
              id: 'discharge',
              label: 'Discharge',
              disabled: !inpatient,
              panelId: `${base}-panel`,
            },
          ]}
          onChange={(v) => {
            setMode(v as ADTMode);
            setReason('');
            setDone(false);
          }}
        />
        <div
          id={`${base}-panel`}
          role="tabpanel"
          aria-labelledby={`${base}-tabs-${mode}`}
          style={{
            paddingTop: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {done ? (
            <Alert tone="success" title={DONE_TITLE[mode]}>
              {mode === 'discharge'
                ? 'Bed ' + pt.location + ' is now dirty and EVS has been paged.'
                : 'Bed Management has the request. You will be told when a bed is assigned.'}
            </Alert>
          ) : null}
          {mode !== 'discharge' ? (
            <div className="ip-form">
              <Select
                label={mode === 'admit' ? 'Level of care' : 'Transfer to level of care'}
                required
                value={lvl}
                options={LEVEL_OPTIONS}
                onChange={(e) => setLvl(e.target.value)}
                readOnly={readOnly}
              />
              {mode === 'admit' ? (
                <Select
                  key={lvl === 'obs' ? 'obs' : 'ip'}
                  label="Admission status"
                  required
                  options={['Inpatient', 'Observation']}
                  defaultValue={lvl === 'obs' ? 'Observation' : 'Inpatient'}
                  readOnly={readOnly}
                />
              ) : (
                <Select label="Target unit" options={units} readOnly={readOnly} />
              )}
              <Select label="Attending" required options={attendings} readOnly={readOnly} />
              <TextField
                label={mode === 'admit' ? 'Admitting diagnosis' : 'Reason for transfer'}
                required
                value={reason}
                onChange={(v) => setReason(v)}
                error={showErrors && !reason ? 'Enter a reason' : undefined}
                readOnly={readOnly}
              />
            </div>
          ) : (
            <div className="ip-form">
              <Select
                label="Discharge disposition"
                required
                placeholder="Choose"
                value={reason}
                options={dischargeDispositions as string[]}
                onChange={(e) => setReason(e.target.value)}
                error={showErrors && !reason ? 'Choose a disposition' : undefined}
                readOnly={readOnly}
              />
              <TextField label="Discharge date and time" defaultValue={dischargeAt} readOnly={readOnly} />
              <Select
                label="Transport"
                options={['Family vehicle', 'Wheelchair van', 'Ambulance, BLS', 'Ambulance, ALS']}
                readOnly={readOnly}
              />
            </div>
          )}
          {stepDown ? (
            <Alert tone="warning" title="Step-down in care">
              Review orders before transfer. ICU-only orders such as drips and q1h neuro checks will not carry over.
            </Alert>
          ) : null}
          {mode === 'discharge' && blockers.length ? (
            <Alert
              tone="error"
              title={'Discharge is blocked by ' + blockers.length + (blockers.length === 1 ? ' item' : ' items')}
            >
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {blockers.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </Alert>
          ) : null}
          {reason === 'Left against medical advice' ? (
            <Alert tone="warning" title="AMA form required">
              Have the patient sign the Against Medical Advice form, or record that they declined to sign.
            </Alert>
          ) : null}
          <div className="co-row co-gap-8" style={{ justifyContent: 'flex-end' }}>
            <Button onClick={onCancel}>Cancel</Button>
            <Button
              variant="primary"
              disabled={readOnly || need > 0 || done}
              onClick={() => {
                setDone(true);
                onSubmit?.({ mode, level: lvl, reason });
              }}
            >
              {CTA[mode]}
            </Button>
          </div>
        </div>
      </Card>
    </RangeContextProvider>
  );
});
