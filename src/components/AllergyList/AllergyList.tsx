import { forwardRef, type HTMLAttributes } from 'react';
import { allergySeverities, type AllergySeverity } from '../AllergyBadge/AllergyBadge';
import { Alert } from '../Alert/Alert';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { KebabMenu } from '../Menu/Menu';

/** One recorded allergy. */
export interface AllergyItem {
  /** Stable key; default the list index */
  id?: string;
  /** Allergen ("Penicillin"); required */
  substance: string;
  /** "Drug" | "Food" | "Environmental"...; default none */
  type?: string;
  /** Reaction ("Anaphylaxis"); default none */
  reaction?: string;
  /** 'severe' | 'moderate' | 'mild'; default 'moderate' */
  severity?: AllergySeverity;
  /** Onset year or date, shown as "since 2004"; default none */
  onset?: string;
  /** 'active' | 'inactive'; default 'active' */
  status?: 'active' | 'inactive';
}

/** Row actions in the allergy kebab menu. */
export type AllergyAction = 'edit' | 'inactivate' | 'entered-in-error';

export interface AllergyListProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /**
   * Allergies. `[]` shows No Known Allergies (NKA); `undefined` means not reviewed and shows a warning.
   * Array<{substance, type?, reaction?, severity, onset?, status?}> | [] | undefined; default undefined
   */
  items?: AllergyItem[];
  /** Review date and person ("10/09/2026 by Lisa Chen RN"); default none (Not reviewed this visit) */
  reviewed?: string;
  /** Hides Mark Reviewed, Add Allergy and the row menus; default false */
  readOnly?: boolean;
  /** Mark Reviewed clicked; default none */
  onMarkReviewed?: () => void;
  /** Add Allergy clicked; default none */
  onAdd?: () => void;
  /** A row menu item was chosen; default none */
  onItemAction?: (action: AllergyAction, item: AllergyItem) => void;
}

/** AllergyList is the Allergies card: each allergy with type, reaction, severity and status, plus the NKA and not-reviewed states. */
export const AllergyList = forwardRef<HTMLElement, AllergyListProps>(function AllergyList(
  { items, reviewed, readOnly = false, onMarkReviewed, onAdd, onItemAction, ...rest },
  ref
) {
  return (
    <Card
      ref={ref}
      title="Allergies"
      subtitle={reviewed ? `Reviewed ${reviewed}` : 'Not reviewed this visit'}
      actions={
        readOnly ? null : (
          <>
            <Button size="sm" onClick={onMarkReviewed}>
              Mark Reviewed
            </Button>
            <Button size="sm" variant="primary" iconLeft="plus" onClick={onAdd}>
              Add Allergy
            </Button>
          </>
        )
      }
      {...rest}
    >
      {items == null ? (
        <Alert tone="warning" title="Allergies not reviewed">
          Ask the patient and record allergies or No Known Allergies before prescribing.
        </Alert>
      ) : !items.length ? (
        <Badge tone="success" icon="check">
          No Known Allergies (NKA)
        </Badge>
      ) : (
        <ul className="co-list">
          {items.map((a, i) => {
            const s = allergySeverities[a.severity ?? 'moderate'] ?? allergySeverities.moderate;
            const act = (action: AllergyAction) => () => onItemAction?.(action, a);
            return (
              <li key={a.id ?? i} className="co-li">
                <div className="co-li-b">
                  <b>{a.substance}</b>
                  <span className="co-mi-s">
                    {[a.type, a.reaction, a.onset ? `since ${a.onset}` : null].filter(Boolean).join(' . ')}
                  </span>
                </div>
                <Badge tone={s.tone} icon={s.icon}>
                  {s.label}
                </Badge>
                {a.status === 'inactive' ? <Badge>Inactive</Badge> : null}
                {readOnly ? null : (
                  <KebabMenu
                    label={`Actions for ${a.substance}`}
                    items={[
                      { label: 'Edit', onSelect: act('edit') },
                      { label: 'Mark Inactive', onSelect: act('inactivate') },
                      { divider: true },
                      { label: 'Entered in Error', danger: true, onSelect: act('entered-in-error') },
                    ]}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
});
