import { forwardRef, type HTMLAttributes } from 'react';
import { RangeContextProvider, type RangeContextId } from '../../clinical';
import { useControllableState } from '../../internal/hooks';
import { DecisionGroup, MedCell, type InpatientMedication } from '../../internal/inpatientFlow';
import { Alert } from '../Alert/Alert';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';

export type { InpatientMedication } from '../../internal/inpatientFlow';

/** A medication reconciliation decision. */
export type MedRecDecision = 'continue' | 'modify' | 'stop' | 'new';

/** One row: the home medicine, the inpatient order and the decision. */
export interface MedRecRow {
  /** Home medicine { name, dose, unit, route, freq, prn }; null when it is not a home medicine */
  home?: InpatientMedication | null;
  /** Inpatient order; null when it is not ordered here */
  inpatient?: InpatientMedication | null;
  /** 'continue' | 'modify' | 'stop' for a home medicine, 'new' | 'stop' for an inpatient-only one; default none (needs a decision) */
  decision?: MedRecDecision | null;
  /** The medicine as modified (decision 'modify'); default none */
  modified?: InpatientMedication | null;
  /** Why it was stopped; default none */
  stopReason?: string;
  /** Warning note under the inpatient cell; default none */
  note?: string;
}

/** Reconciliation stage. */
export type MedRecStage = 'admission' | 'discharge';

export interface MedReconciliationProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Array of { home, inpatient, decision, modified, stopReason, note }; a medicine is { name, dose, unit, route, freq, prn }: the starting rows (uncontrolled); required */
  rows: MedRecRow[];
  /** The rows (controlled); pair with onRowsChange; default uncontrolled */
  rowsValue?: MedRecRow[];
  /** Called with the new rows when a decision changes; default none */
  onRowsChange?: (rows: MedRecRow[]) => void;
  /** 'admission' | 'discharge'; default 'discharge' */
  stage?: MedRecStage;
  /** Patient name; default none */
  patient?: string;
  /** Source of the home list; default 'Patient interview and pharmacy fill history' */
  source?: string;
  /** Signed and view only; default false */
  readOnly?: boolean;
  /** Who signed it, shown when readOnly; default 'the attending' */
  signedBy?: string;
  /** Called by Sign Reconciliation with the rows (enabled once every row has a decision); default none */
  onSign?: (rows: MedRecRow[]) => void;
  /** Which shared reference range flags use; the lab range on a result still wins; default 'inpatient' when no global context is set */
  rangeContext?: RangeContextId;
}

/**
 * MedReconciliation lines up home, inpatient and discharge medicines row by row and asks for continue, modify or stop
 * on each, and will not sign while any row has no decision.
 */
export const MedReconciliation = forwardRef<HTMLElement, MedReconciliationProps>(function MedReconciliation(
  {
    rows: initialRows,
    rowsValue,
    onRowsChange,
    stage = 'discharge',
    patient,
    source = 'Patient interview and pharmacy fill history',
    readOnly = false,
    signedBy,
    onSign,
    rangeContext,
    ...rest
  },
  ref
) {
  const [rows, setRows] = useControllableState(rowsValue, initialRows, onRowsChange);
  const open = rows.filter((r) => !r.decision).length;
  const set = (i: number, d: MedRecDecision) => {
    const n = rows.slice();
    n[i] = { ...n[i], decision: d };
    setRows(n);
  };
  return (
    <RangeContextProvider value={rangeContext}>
      <Card
        ref={ref}
        title={stage === 'admission' ? 'Admission Medication Reconciliation' : 'Discharge Medication Reconciliation'}
        subtitle={(patient ? patient + ' · ' : '') + 'Home list source: ' + source}
        actions={
          <Button variant="primary" size="sm" disabled={open > 0 || readOnly} onClick={() => onSign?.(rows)}>
            {open ? open + ' without a decision' : 'Sign Reconciliation'}
          </Button>
        }
        padding="none"
        {...rest}
      >
        {readOnly ? (
          <div style={{ padding: '10px 14px' }}>
            <Alert tone="lock">{'Signed by ' + (signedBy || 'the attending') + '. View only.'}</Alert>
          </div>
        ) : null}
        <div className="co-hscroll">
          <table className="co-table">
            <thead>
              <tr>
                {[
                  'Home medication',
                  'Inpatient',
                  'Decision',
                  stage === 'admission' ? 'Admission order' : 'Discharge prescription',
                ].map((t) => (
                  <th key={t} className="co-th-plain" scope="col">
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const med = r.home || r.inpatient;
                const out =
                  r.decision === 'modify' ? r.modified : r.decision === 'continue' || r.decision === 'new' ? med : null;
                const options: MedRecDecision[] = r.home ? ['continue', 'modify', 'stop'] : ['new', 'stop'];
                return (
                  <tr key={i}>
                    <td>
                      <MedCell med={r.home} empty="Not a home medicine" />
                    </td>
                    <td>
                      <MedCell med={r.inpatient} empty="Not ordered here" />
                      {r.note ? (
                        <div className="co-mi-s" style={{ color: 'var(--co-warning-strong)' }}>
                          {r.note}
                        </div>
                      ) : null}
                    </td>
                    <td>
                      <DecisionGroup
                        label={'Decision for ' + (med ? med.name : 'row ' + (i + 1))}
                        value={r.decision}
                        disabled={readOnly}
                        options={options}
                        onChange={(d) => set(i, d)}
                      />
                    </td>
                    <td>
                      {r.decision === 'stop' ? (
                        <span className="ip-none">{'Stopped' + (r.stopReason ? ': ' + r.stopReason : '')}</span>
                      ) : !r.decision ? (
                        <Badge tone="warning" size="sm">
                          Needs decision
                        </Badge>
                      ) : (
                        <MedCell med={out} />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </RangeContextProvider>
  );
});
