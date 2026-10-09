import { forwardRef, type LiHTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { Badge } from '../Badge/Badge';
import { Icon } from '../Icon/Icon';
import { KebabMenu } from '../Menu/Menu';

/** DEA controlled-substance schedule. */
export type DeaSchedule = 'C-II' | 'C-III' | 'C-IV' | 'C-V';

/** One medication on the patient's list. */
export interface Medication {
  /** Stable key in a list; default the list index */
  id?: string;
  /** Name and strength ("Metformin 500 mg tablet"); required */
  name: string;
  /** Directions ("Take 1 tablet by mouth twice daily"); required */
  sig: string;
  /** Quantity dispensed; required */
  qty: number | string;
  /** Refills left; default none */
  refills?: number;
  /** Prescriber name; default none */
  prescriber?: string;
  /** Pharmacy; default none */
  pharmacy?: string;
  /** Last fill date; default none */
  last?: string;
  /** DEA schedule for controlled drugs; default none */
  schedule?: DeaSchedule | string;
  /** As needed; default false */
  prn?: boolean;
  /** 'active' | 'discontinued'; default 'active' */
  status?: 'active' | 'discontinued';
  /** Where the entry came from ("Surescripts"); default none */
  source?: string;
}

/** Row actions in the medication kebab menu. */
export type MedicationAction = 'renew' | 'change-dose' | 'not-taking' | 'discontinue';

export interface MedicationRowProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'children'> {
  /** {name, sig, qty, refills?, prescriber?, pharmacy?, last?, schedule?, prn?, status?, source?}; required */
  med: Medication;
  /** Shows the Renew / Change Dose / Mark Not Taking / Discontinue menu; default true */
  actions?: boolean;
  /** A menu action was chosen; default none */
  onAction?: (action: MedicationAction, med: Medication) => void;
}

/**
 * MedicationRow is one medication: name and strength, sig, quantity, refills, prescriber, pharmacy, last fill,
 * and the DEA schedule tag for controlled drugs (C-II to C-V). It renders an `<li>`: put it in a `ul.co-list`.
 */
export const MedicationRow = forwardRef<HTMLLIElement, MedicationRowProps>(function MedicationRow(
  { med: m, actions = true, onAction, className, ...rest },
  ref
) {
  const act = (a: MedicationAction) => () => onAction?.(a, m);
  return (
    <li ref={ref} className={cx('co-li co-med', m.status === 'discontinued' && 'is-dim', className)} {...rest}>
      <Icon name="pill" size={18} />
      <div className="co-li-b">
        <div className="co-row co-gap-6">
          <b>{m.name}</b>
          {m.schedule ? (
            <Badge tone="danger" icon="shield" title={`DEA Schedule ${m.schedule} controlled substance`}>
              {m.schedule}
              <span className="co-sr"> controlled substance</span>
            </Badge>
          ) : null}
          {m.prn ? <Badge>PRN</Badge> : null}
          {m.status === 'discontinued' ? <Badge>Discontinued</Badge> : null}
          {m.source ? <Badge tone="outline">{m.source}</Badge> : null}
        </div>
        <span>{m.sig}</span>
        <span className="co-mi-s">
          {[
            `Qty ${m.qty}`,
            m.refills != null ? `${m.refills} refills` : null,
            m.prescriber,
            m.pharmacy,
            m.last ? `Last filled ${m.last}` : null,
          ]
            .filter(Boolean)
            .join(' . ')}
        </span>
      </div>
      {actions ? (
        <KebabMenu
          label={`Actions for ${m.name}`}
          items={[
            { label: 'Renew', onSelect: act('renew') },
            { label: 'Change Dose', onSelect: act('change-dose') },
            { label: 'Mark Not Taking', onSelect: act('not-taking') },
            { divider: true },
            { label: 'Discontinue', danger: true, onSelect: act('discontinue') },
          ]}
        />
      ) : null}
    </li>
  );
});
