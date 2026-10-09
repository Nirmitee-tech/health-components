import { forwardRef, type HTMLAttributes } from 'react';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { MedicationRow, type Medication, type MedicationAction } from '../MedicationRow/MedicationRow';

export interface MedicationListProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** MedicationRow med[]; required */
  items: Medication[];
  /** Reconciliation date and person ("10/09/2026 by James Bell MD"); default none (Not reconciled this visit) */
  reconciled?: string;
  /** Hides Reconcile, Prescribe and the row menus; default false */
  readOnly?: boolean;
  /** Reconcile clicked; default none */
  onReconcile?: () => void;
  /** Prescribe clicked; default none */
  onPrescribe?: () => void;
  /** A row menu action was chosen; default none */
  onItemAction?: (action: MedicationAction, med: Medication) => void;
}

/** MedicationList is the Medications card with reconciliation status, Reconcile and Prescribe, made of MedicationRows. */
export const MedicationList = forwardRef<HTMLElement, MedicationListProps>(function MedicationList(
  { items, reconciled, readOnly = false, onReconcile, onPrescribe, onItemAction, ...rest },
  ref
) {
  return (
    <Card
      ref={ref}
      title="Medications"
      subtitle={reconciled ? `Reconciled ${reconciled}` : 'Not reconciled this visit'}
      actions={
        readOnly ? null : (
          <>
            <Button size="sm" onClick={onReconcile}>
              Reconcile
            </Button>
            <Button size="sm" variant="primary" iconLeft="plus" onClick={onPrescribe}>
              Prescribe
            </Button>
          </>
        )
      }
      {...rest}
    >
      <ul className="co-list">
        {items.map((m, i) => (
          <MedicationRow key={m.id ?? i} med={m} actions={!readOnly} onAction={onItemAction} />
        ))}
      </ul>
    </Card>
  );
});
