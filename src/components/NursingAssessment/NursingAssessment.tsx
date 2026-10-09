import { forwardRef, useState, type ForwardedRef, type HTMLAttributes } from 'react';
import type { RangeContextId } from '../../clinical';
import { RadioButtons } from '../../internal/nursing';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { ProgressBar } from '../ProgressBar/ProgressBar';

/** One body system of the assessment. */
export interface NursingSystem {
  /** Key in the values record */
  id: string;
  /** System name ('Neurological') */
  label: string;
  /** What Within Defined Limits means for this system */
  wdl: string;
  /** Finding chips offered for an exception */
  options?: string[];
}

/** The answer for one system: WDL (true), Exception (false) or not assessed (null). */
export interface NursingSystemValue {
  wdl: boolean | null;
  findings: string[];
  note: string;
}

export interface NursingAssessmentProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'onChange'> {
  /** Body systems; default DEFAULT_NURSING_SYSTEMS (eight systems) */
  systems?: NursingSystem[];
  /** Saved answers by system id (initial); default none (not assessed) */
  values?: Record<string, NursingSystemValue>;
  /** Signed, view only; default false */
  readOnly?: boolean;
  /** Called with the system id and its new answer */
  onChange?: (id: string, value: NursingSystemValue) => void;
  /** Card title; default 'Head-to-toe Assessment' */
  title?: string;
  /** Shift line; default none */
  subtitle?: string;
  /** Accepted for API consistency with the nursing set; default 'inpatient' */
  rangeContext?: RangeContextId;
}

/** The eight default body systems with their WDL definitions. */
export const DEFAULT_NURSING_SYSTEMS: readonly NursingSystem[] = [
  { id: 'neuro', label: 'Neurological', wdl: 'Alert, oriented x4, speech clear, moves all extremities equally, PERRLA.' },
  { id: 'cardio', label: 'Cardiovascular', wdl: 'Regular rate and rhythm, cap refill under 3 s, pulses palpable, no edema.' },
  { id: 'resp', label: 'Respiratory', wdl: 'Even, unlabored, lungs clear bilaterally, SpO2 at least 92% on room air.' },
  { id: 'gi', label: 'Gastrointestinal', wdl: 'Abdomen soft, nontender, bowel sounds present x4, tolerating diet.' },
  { id: 'gu', label: 'Genitourinary', wdl: 'Voiding without difficulty, urine clear yellow.' },
  { id: 'skin', label: 'Integumentary', wdl: 'Warm, dry, intact, color appropriate for ethnicity.' },
  { id: 'msk', label: 'Musculoskeletal', wdl: 'Full range of motion, steady gait, no deformity.' },
  { id: 'psych', label: 'Psychosocial', wdl: 'Calm, cooperative, appropriate affect, support present.' },
];

const EMPTY: NursingSystemValue = { wdl: null, findings: [], note: '' };

function NursingAssessmentBase(
  {
    systems: systemsProp,
    values,
    readOnly = false,
    onChange,
    title = 'Head-to-toe Assessment',
    subtitle,
    rangeContext: _rangeContext,
    ...rest
  }: NursingAssessmentProps,
  ref: ForwardedRef<HTMLElement>
) {
  const systems = systemsProp || DEFAULT_NURSING_SYSTEMS;
  /* Answers changed here overlay the saved values. */
  const [edits, setEdits] = useState<Record<string, NursingSystemValue>>({});
  const valueOf = (id: string): NursingSystemValue => edits[id] || (values || {})[id] || EMPTY;
  const set = (id: string, patch: Partial<NursingSystemValue>) => {
    const next = { ...valueOf(id), ...patch };
    setEdits((e) => ({ ...e, [id]: next }));
    onChange?.(id, next);
  };
  const markRemaining = () => {
    const next: Record<string, NursingSystemValue> = {};
    systems.forEach((s) => {
      if (valueOf(s.id).wdl === null) {
        next[s.id] = { ...valueOf(s.id), wdl: true };
        onChange?.(s.id, next[s.id]!);
      }
    });
    setEdits((e) => ({ ...e, ...next }));
  };
  const done = systems.filter((s) => {
    const v = valueOf(s.id);
    return v.wdl === true || (v.wdl === false && (v.findings.length > 0 || !!v.note));
  }).length;
  const exc = systems.filter((s) => valueOf(s.id).wdl === false).length;

  return (
    <Card
      ref={ref}
      title={title}
      subtitle={subtitle}
      actions={
        readOnly ? (
          <Badge tone="neutral" icon="lock">
            Signed
          </Badge>
        ) : (
          <Button size="sm" onClick={markRemaining}>
            Mark remaining WDL
          </Button>
        )
      }
      {...rest}
    >
      <div className="nu-bar">
        <span className="nu-num nu-ink2">
          {done} of {systems.length} systems documented
        </span>
        {exc ? (
          <Badge tone="warning" size="sm">
            {exc} exception{exc > 1 ? 's' : ''}
          </Badge>
        ) : null}
        <div className="nu-progress">
          <ProgressBar value={systems.length ? Math.round((done / systems.length) * 100) : 0} label="Assessment progress" />
        </div>
      </div>
      {systems.map((s) => {
        const v = valueOf(s.id);
        return (
          <div key={s.id} className="nu-sys" role="group" aria-label={s.label}>
            <div>
              <b className="nu-sys-name">{s.label}</b>
              {v.wdl === null ? <div className="nu-muted">Not assessed</div> : null}
            </div>
            <RadioButtons
              className="nu-opts"
              label={s.label + ' result'}
              readOnly={readOnly}
              value={v.wdl === true ? 0 : v.wdl === false ? 1 : null}
              options={[
                { key: 'wdl', content: 'WDL' },
                { key: 'exc', content: 'Exception' },
              ]}
              onChange={(i) => set(s.id, i === 0 ? { wdl: true, findings: [] } : { wdl: false })}
            />
            <div className="nu-sys-body">
              {v.wdl === true ? <div className="nu-muted">Within defined limits: {s.wdl}</div> : null}
              {v.wdl === false ? (
                <div>
                  {s.options && s.options.length ? (
                    <div className="nu-chips nu-chips-mb" role="group" aria-label={s.label + ' findings'}>
                      {s.options.map((o) => {
                        const on = v.findings.includes(o);
                        return (
                          <button
                            key={o}
                            type="button"
                            className="nu-opt"
                            aria-pressed={on}
                            aria-disabled={readOnly || undefined}
                            onClick={
                              readOnly
                                ? undefined
                                : () => set(s.id, { findings: on ? v.findings.filter((x) => x !== o) : v.findings.concat([o]) })
                            }
                          >
                            {o}
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                  {readOnly ? (
                    v.note ? (
                      <div>{v.note}</div>
                    ) : null
                  ) : (
                    <textarea
                      className="nu-inp nu-note-input"
                      rows={2}
                      aria-label={s.label + ' exception note'}
                      placeholder="Describe the finding"
                      value={v.note}
                      onChange={(e) => set(s.id, { note: e.target.value })}
                    />
                  )}
                </div>
              ) : null}
              {v.wdl === null ? <div className="nu-muted">WDL means: {s.wdl}</div> : null}
            </div>
          </div>
        );
      })}
    </Card>
  );
}

/**
 * NursingAssessment is the head-to-toe shift assessment: one row per body system with a WDL or Exception choice,
 * finding chips and a note for exceptions.
 */
export const NursingAssessment = Object.assign(forwardRef<HTMLElement, NursingAssessmentProps>(NursingAssessmentBase), {
  defaultSystems: DEFAULT_NURSING_SYSTEMS,
});
NursingAssessment.displayName = 'NursingAssessment';
