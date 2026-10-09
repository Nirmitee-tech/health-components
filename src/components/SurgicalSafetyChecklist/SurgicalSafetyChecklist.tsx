import { forwardRef, useState, type HTMLAttributes } from 'react';
import { RangeContextProvider, type RangeContextId } from '../../clinical';
import { cx } from '../../internal/cx';
import { useControllableState, useDomId } from '../../internal/hooks';
import { Alert } from '../Alert/Alert';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { Checkbox } from '../Checkbox/Checkbox';

/** A WHO checklist phase. */
export type SafetyPhase = 'signin' | 'timeout' | 'signout';

/** One phase: title, when it is done, and the items the team confirms aloud. */
export interface SafetyPhaseDef {
  title: string;
  when: string;
  items: readonly string[];
}

/** WHO Surgical Safety Checklist (2009), adapted. */
export const SURGICAL_SAFETY_PHASES: Readonly<Record<SafetyPhase, SafetyPhaseDef>> = {
  signin: {
    title: 'Sign In',
    when: 'Before induction of anesthesia',
    items: [
      'Patient has confirmed identity, site, procedure and consent',
      'Site marked, or not applicable',
      'Anesthesia machine and medication check complete',
      'Pulse oximeter on the patient and working',
      'Known allergy reviewed',
      'Difficult airway or aspiration risk assessed, equipment available',
      'Risk of blood loss over 500 mL (7 mL/kg in children) assessed, IV access and fluids planned',
    ],
  },
  timeout: {
    title: 'Time Out',
    when: 'Before skin incision',
    items: [
      'All team members introduced by name and role',
      'Surgeon, anesthesia and nurse confirm patient, site and procedure',
      'Antibiotic prophylaxis given within the last 60 minutes, or not applicable',
      'Surgeon reviewed critical or unexpected steps, duration, expected blood loss',
      'Anesthesia reviewed patient-specific concerns',
      'Nursing confirmed sterility, including indicator results, and equipment issues',
      'Essential imaging displayed, or not applicable',
    ],
  },
  signout: {
    title: 'Sign Out',
    when: 'Before the patient leaves the operating room',
    items: [
      'Nurse confirms the name of the procedure recorded',
      'Instrument, sponge and needle counts complete',
      'Specimen labelled, including patient name, or no specimen',
      'Equipment problems to be addressed, or none',
      'Surgeon, anesthesia and nurse reviewed key concerns for recovery',
    ],
  },
};

const ORDER: SafetyPhase[] = ['signin', 'timeout', 'signout'];

/** Confirmation time 'HH:MM' per confirmed phase. */
export type SafetyConfirmations = Partial<Record<SafetyPhase, string>>;

function nowHHMM(): string {
  const d = new Date();
  return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
}

export interface SurgicalSafetyChecklistProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'defaultChecked'> {
  /** Checked items (controlled), keyed phase + index ('signin0'); default uncontrolled */
  checked?: Record<string, boolean>;
  /** Initially checked items (uncontrolled), keyed phase + index ('signin0'); default {} */
  defaultChecked?: Record<string, boolean>;
  /** Called with every checked item when one changes; default none */
  onCheckedChange?: (checked: Record<string, boolean>) => void;
  /** Phases already confirmed, with their time 'HH:MM' (initial state); default {} */
  confirmed?: SafetyConfirmations;
  /** Time 'HH:MM' stamped on a new confirmation; default the device clock */
  clock?: string;
  /** Site or procedure mismatch: shows a red stop alert; default none */
  mismatch?: string;
  /** Review only: nothing can be checked or confirmed; default false */
  readOnly?: boolean;
  /** Line under the title; default 'WHO checklist, adapted. Each phase is confirmed aloud by the team.' */
  subtitle?: string;
  /** Called when the team confirms a phase, with the time stamped; default none */
  onConfirm?: (phase: SafetyPhase, time: string) => void;
  /** Which shared reference range flags use; the lab range on a result still wins; default 'ed' when no global context is set */
  rangeContext?: RangeContextId;
}

/**
 * SurgicalSafetyChecklist runs the WHO Surgical Safety Checklist in its three phases, Sign In, Time Out and Sign Out,
 * each confirmed by the team before the next unlocks.
 */
export const SurgicalSafetyChecklist = forwardRef<HTMLElement, SurgicalSafetyChecklistProps>(function SurgicalSafetyChecklist(
  {
    checked: checkedProp,
    defaultChecked,
    onCheckedChange,
    confirmed,
    clock,
    mismatch,
    readOnly = false,
    subtitle = 'WHO checklist, adapted. Each phase is confirmed aloud by the team.',
    onConfirm,
    rangeContext,
    id,
    ...rest
  },
  ref
) {
  const [chk, setChk] = useControllableState<Record<string, boolean>>(checkedProp, defaultChecked || {}, onCheckedChange);
  const [conf, setConf] = useState<SafetyConfirmations>(() => ({ ...(confirmed || {}) }));
  const base = useDomId('co-ssc', id);
  const active = ORDER.find((k) => !conf[k]);

  return (
    <Card ref={ref} id={id} title="Surgical Safety Checklist" subtitle={subtitle} {...rest}>
      <RangeContextProvider value={rangeContext}>
        {mismatch ? (
          <Alert tone="error" title="Stop: site mismatch">
            {mismatch}
          </Alert>
        ) : null}
        <div className="co-ssc-grid">
          {ORDER.map((k) => {
            const ph = SURGICAL_SAFETY_PHASES[k];
            const done = !!conf[k];
            const isActive = k === active;
            const locked = !done && !isActive;
            const n = ph.items.filter((_, i) => chk[k + i]).length;
            const all = n === ph.items.length;
            const headId = `${base}-${k}`;
            const helpId = `${base}-${k}-help`;
            return (
              <section
                key={k}
                aria-labelledby={headId}
                className={cx('co-ssc-ph', isActive && 'is-active', done && 'is-done', locked && 'is-locked')}
              >
                <div className="co-row co-ssc-h">
                  <h3 id={headId}>{ph.title}</h3>
                  {done ? (
                    <Badge tone="success" size="sm" icon="check">
                      {'Confirmed ' + conf[k]}
                    </Badge>
                  ) : locked ? (
                    <Badge tone="neutral" size="sm" icon="lock">
                      Locked
                    </Badge>
                  ) : (
                    <Badge tone="info" size="sm">
                      <span className="co-ac-num">{n + ' of ' + ph.items.length}</span>
                    </Badge>
                  )}
                </div>
                <div className="co-mi-s co-ssc-when">{ph.when}</div>
                <div className="co-ssc-items">
                  {ph.items.map((it, i) => (
                    <Checkbox
                      key={i}
                      label={it}
                      checked={!!chk[k + i] || done}
                      disabled={done || locked || readOnly}
                      onChange={(e) => setChk({ ...chk, [k + i]: e.target.checked })}
                    />
                  ))}
                </div>
                {!done && !locked && !readOnly ? (
                  <div className="co-ssc-act">
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={!all}
                      aria-describedby={all ? undefined : helpId}
                      onClick={() => {
                        const t = clock || nowHHMM();
                        setConf((c) => ({ ...c, [k]: t }));
                        onConfirm?.(k, t);
                      }}
                    >
                      {'Confirm ' + ph.title}
                    </Button>
                    {all ? null : (
                      <div className="co-help" id={helpId}>
                        Check every item to confirm.
                      </div>
                    )}
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>
      </RangeContextProvider>
    </Card>
  );
});
