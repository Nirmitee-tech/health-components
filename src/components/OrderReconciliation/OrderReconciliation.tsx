import { forwardRef, type HTMLAttributes } from 'react';
import { RangeContextProvider, type RangeContextId } from '../../clinical';
import { cx } from '../../internal/cx';
import { useControllableState } from '../../internal/hooks';
import { DecisionGroup, Dose } from '../../internal/inpatientFlow';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { LevelOfCareBadge, levelOfCareInfo, type LevelOfCare } from '../LevelOfCareBadge/LevelOfCareBadge';

/** What happens to an order at transfer. */
export type TransferOrderAction = 'continue' | 'modify' | 'discontinue';

/** One active order. */
export interface TransferOrder {
  /** Group heading ('Medications', 'Nursing', 'Labs') */
  type: string;
  /** Order name */
  name: string;
  /** Dose amount; default none */
  dose?: number;
  /** Dose unit; default none */
  unit?: string;
  /** Detail ('IV continuous, aPTT protocol'); default none */
  detail?: string;
  /** 'continue' | 'modify' | 'discontinue'; default none (needs review) */
  action?: TransferOrderAction | null;
  /** Levels of care the order is not allowed on; default none */
  notAllowedOn?: LevelOfCare[];
}

type Choice = 'continue' | 'modify' | 'stop';

export interface OrderReconciliationProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Array of { type, name, dose, unit, detail, action, notAllowedOn: level[] }: the starting orders (uncontrolled); required */
  orders: TransferOrder[];
  /** The orders (controlled); pair with onOrdersChange; default uncontrolled */
  ordersValue?: TransferOrder[];
  /** Called with the new orders when an action changes; default none */
  onOrdersChange?: (orders: TransferOrder[]) => void;
  /** Level of care the patient leaves; required */
  from: LevelOfCare;
  /** Level of care the patient goes to; required */
  to: LevelOfCare;
  /** Patient name and context; default none */
  patient?: string;
  /** View only; default false */
  readOnly?: boolean;
  /** Called by Release Orders with the orders (enabled once every order is reviewed); default none */
  onRelease?: (orders: TransferOrder[]) => void;
  /** Which shared reference range flags use; the lab range on a result still wins; default 'inpatient' when no global context is set */
  rangeContext?: RangeContextId;
}

/**
 * OrderReconciliation reviews every active order when a patient changes level of care, so orders that are not
 * allowed on the new unit are stopped or changed before the transfer.
 */
export const OrderReconciliation = forwardRef<HTMLElement, OrderReconciliationProps>(function OrderReconciliation(
  {
    orders: initialOrders,
    ordersValue,
    onOrdersChange,
    from,
    to,
    patient,
    readOnly = false,
    onRelease,
    rangeContext,
    ...rest
  },
  ref
) {
  const [orders, setOrders] = useControllableState(ordersValue, initialOrders, onOrdersChange);
  const notAllowed = (o: TransferOrder) => !!o.notAllowedOn && o.notAllowedOn.indexOf(to) >= 0;
  /* An order not allowed on the new unit still needs review while it is set to continue. */
  const open = orders.filter((o) => !o.action || (o.action === 'continue' && notAllowed(o))).length;
  const types: Record<string, TransferOrder[]> = {};
  orders.forEach((o) => (types[o.type] = types[o.type] || []).push(o));
  const toLabel = levelOfCareInfo(to).label;
  return (
    <RangeContextProvider value={rangeContext}>
      <Card
        ref={ref}
        title="Transfer Order Review"
        subtitle={
          (patient ? patient + ' · ' : '') +
          'All active orders must be continued, changed or stopped before the patient leaves the unit.'
        }
        actions={
          <span className="co-row co-gap-6">
            <LevelOfCareBadge level={from} size="sm" compact />
            <span aria-hidden="true">→</span>
            <span className="co-sr">to</span>
            <LevelOfCareBadge level={to} size="sm" compact />
          </span>
        }
        {...rest}
      >
        {Object.keys(types).map((t) => (
          <div key={t} style={{ marginBottom: 12 }}>
            <div className="co-kl" style={{ marginBottom: 4 }}>
              {t}
            </div>
            <ul className="ip-chk" aria-label={t}>
              {types[t]!.map((o) => {
                const i = orders.indexOf(o);
                const bad = notAllowed(o);
                const options: Choice[] = bad ? ['modify', 'stop'] : ['continue', 'modify', 'stop'];
                return (
                  <li key={i}>
                    <div style={{ flex: '1 1 260px' }}>
                      <div className={cx(o.action === 'discontinue' && 'ip-strike')}>
                        <b>{o.name}</b>
                        {o.dose != null ? (
                          <span>
                            {' '}
                            <Dose value={o.dose} unit={o.unit} />
                          </span>
                        ) : null}{' '}
                        {o.detail ? <span className="co-mi-s">{o.detail}</span> : null}
                      </div>
                      {bad ? (
                        <div className="co-mi-s" style={{ color: 'var(--co-danger-strong)' }}>
                          {'Not allowed on ' + toLabel + '. Stop it or change it.'}
                        </div>
                      ) : null}
                    </div>
                    <DecisionGroup<Choice>
                      label={'Action for ' + o.name}
                      value={o.action === 'discontinue' ? 'stop' : o.action}
                      options={options}
                      disabled={readOnly}
                      onChange={(d) => {
                        const n = orders.slice();
                        n[i] = {
                          ...o,
                          action: d === 'stop' ? 'discontinue' : d,
                        };
                        setOrders(n);
                      }}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        <div className="co-row co-gap-8" style={{ justifyContent: 'flex-end' }}>
          <Button variant="primary" disabled={open > 0 || readOnly} onClick={() => onRelease?.(orders)}>
            {open ? 'Review ' + open + ' more' : 'Release Orders to ' + toLabel}
          </Button>
        </div>
      </Card>
    </RangeContextProvider>
  );
});
