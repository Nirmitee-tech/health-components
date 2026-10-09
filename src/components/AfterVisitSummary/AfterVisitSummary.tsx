import { forwardRef, type HTMLAttributes } from 'react';
import { RangeContextProvider, type RangeContextId } from '../../clinical';
import { Dose, Value, inpatientLabel, type InpatientMeasureValue } from '../../internal/inpatientFlow';
import { Alert } from '../Alert/Alert';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';

/** What happens to a medicine at discharge. */
export type AfterVisitMedAction = 'new' | 'changed' | 'continue' | 'stop';

/** One medicine on the after visit summary, in plain words. */
export interface AfterVisitMed {
  /** Drug name */
  name: string;
  /** Dose amount */
  dose: number;
  /** Dose unit ('mg', 'tablet') */
  unit: string;
  /** Route in plain words ('by mouth'); default none */
  route?: string;
  /** Frequency in plain words ('twice a day'); default none */
  freq?: string;
  /** 'new' | 'changed' | 'continue' | 'stop' */
  action: AfterVisitMedAction;
  /** Note under the medicine; default none */
  note?: string;
}

/** One follow-up appointment. */
export interface AfterVisitFollowup {
  /** When ('Tue Oct 13, 10:30', 'Within 7 days') */
  when: string;
  /** With whom */
  with: string;
  /** Where; default none */
  where?: string;
}

export interface AfterVisitSummaryProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'results'> {
  /** Patient name; default none */
  patient?: string;
  /** Stay dates; default none */
  dates?: string;
  /** Why they were in the hospital, in plain words; required */
  reason: string;
  /** Array of { name, dose, unit, route, freq, action: new | changed | continue | stop, note }; default [] */
  meds?: AfterVisitMed[];
  /** Array of { measure, value, range }; default [] */
  results?: InpatientMeasureValue[];
  /** Array of { when, with, where }; default [] */
  followups?: AfterVisitFollowup[];
  /** string[]: home care; default none */
  instructions?: string[];
  /** string[]: warning signs; default none */
  warnings?: string[];
  /** Language of the printed copy; a language other than English adds a note; default 'English' */
  language?: string;
  /** Called by Print; default none */
  onPrint?: () => void;
  /** Called by Send to Portal; default none */
  onSendToPortal?: () => void;
  /** Which shared reference range flags use; the lab range on a result still wins; default 'inpatient' when no global context is set */
  rangeContext?: RangeContextId;
}

const GROUPS: Array<[AfterVisitMedAction, string]> = [
  ['new', 'New medicines: start taking'],
  ['changed', 'Changed medicines: take the new way'],
  ['continue', 'Keep taking'],
  ['stop', 'Stop taking these'],
];

/**
 * AfterVisitSummary is the plain-language discharge summary a patient takes home: why they were here, last results,
 * new, changed, continued and stopped medicines, appointments, home care and warning signs.
 */
export const AfterVisitSummary = forwardRef<HTMLElement, AfterVisitSummaryProps>(function AfterVisitSummary(
  {
    patient,
    dates,
    reason,
    meds = [],
    results = [],
    followups = [],
    instructions,
    warnings,
    language = 'English',
    onPrint,
    onSendToPortal,
    rangeContext,
    ...rest
  },
  ref
) {
  return (
    <RangeContextProvider value={rangeContext}>
      <Card
        ref={ref}
        title="After Visit Summary"
        subtitle={(patient || '') + (dates ? ' · ' + dates : '')}
        actions={
          <>
            <Button size="sm" iconLeft="download" onClick={onPrint}>
              Print
            </Button>
            <Button size="sm" iconLeft="send" onClick={onSendToPortal}>
              Send to Portal
            </Button>
          </>
        }
        {...rest}
      >
        <div className="ip-avs">
          {language && language !== 'English' ? (
            <Alert tone="info">{'A copy in ' + language + ' is printed with this one.'}</Alert>
          ) : null}
          <h3>Why you were in the hospital</h3>
          <p style={{ margin: 0 }}>{reason}</p>
          {results.length ? (
            <div>
              <h3>Your last results</h3>
              <div className="co-row co-gap-16" style={{ flexWrap: 'wrap' }}>
                {results.map((r, i) => (
                  <span key={i}>
                    <span className="co-mi-s" aria-hidden="true">
                      {(r.label || inpatientLabel(r.measure)) + ': '}
                    </span>
                    <Value showRange {...r} />
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          {GROUPS.map(([a, t]) => {
            const g = meds.filter((m) => m.action === a);
            return g.length ? (
              <div key={a}>
                <h3>{t}</h3>
                <ul>
                  {g.map((m, i) => (
                    <li key={i}>
                      <b>{m.name}</b> <Dose value={m.dose} unit={m.unit} />{' '}
                      {[m.route, m.freq].filter(Boolean).join(', ')}
                      {m.note ? <div className="co-mi-s">{m.note}</div> : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null;
          })}
          <h3>Appointments</h3>
          {followups.length ? (
            <ul>
              {followups.map((f, i) => (
                <li key={i}>
                  <b>{f.when}</b>
                  {', ' + f.with + (f.where ? ', ' + f.where : '')}
                </li>
              ))}
            </ul>
          ) : (
            <p className="ip-none" style={{ margin: 0 }}>
              No appointments booked.
            </p>
          )}
          {instructions && instructions.length ? (
            <div>
              <h3>At home</h3>
              <ul>
                {instructions.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {warnings && warnings.length ? (
            <div className="ip-warn" style={{ marginTop: 12 }}>
              <b>Call 911 or go to the emergency room if you have:</b>
              <ul>
                {warnings.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </Card>
    </RangeContextProvider>
  );
});
