import { forwardRef, useRef, useState, type HTMLAttributes, type KeyboardEvent } from 'react';
import { useRangeContext, type RangeContextId } from '../../clinical';
import { cx } from '../../internal/cx';
import { useControllableState, useDomId } from '../../internal/hooks';
import { chartValue, Val, withContext, withRangeProvider, type ChartValueOverride } from '../../internal/chartPanels';
import { Alert } from '../Alert/Alert';
import { Badge, type BadgeTone } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { EmptyState } from '../EmptyState/EmptyState';
import { Icon } from '../Icon/Icon';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';

export type PharmacyOrderStatus = 'pending' | 'verified' | 'clarify' | 'rejected';
export type PharmacyQueueFilter = 'pending' | 'clarify' | 'all';

/** A weight-based dose and its limits, per kg. */
export interface PharmacyDosePerKg {
  /** Ordered dose amount ('1500') */
  amount: number;
  /** Dose unit ('mg') */
  unit: string;
  /** 'dose' | 'day'...; default 'dose' */
  per?: string;
  /** Usual minimum per kg; default none */
  min?: number;
  /** Usual maximum per kg (above it: warning); default none */
  max?: number;
  /** Hard maximum per kg (above it: Verify is blocked); default none */
  hardMax?: number;
}

/** An interaction or renal alert on an order. */
export interface PharmacyOrderAlert {
  /** 'major' (red) | 'moderate' (amber) */
  severity: 'major' | 'moderate';
  /** Alert title */
  title: string;
  /** Alert detail */
  detail: string;
}

/** One order to verify. */
export interface PharmacyOrder {
  /** Unique id */
  id: string;
  /** Drug and dose ('Vancomycin 1,500 mg IV') */
  drug: string;
  /** Directions */
  sig: string;
  /** Patient name */
  patient: string;
  /** Unit and bed */
  unit: string;
  /** Age ('74 y') */
  age: string;
  /** Prescriber */
  prescriber: string;
  /** Order time */
  ordered: string;
  /** Indication; default 'not given' */
  indication?: string;
  /** 'pending' | 'verified' | 'clarify' | 'rejected' */
  status: PharmacyOrderStatus;
  /** STAT order; default false */
  stat?: boolean;
  /** Controlled substance schedule ('C-II'); default none */
  schedule?: string;
  /** Weight in kg; default none ('No weight') */
  weight?: number;
  /** Serum creatinine in mg/dL; default none */
  scr?: number;
  /** Creatinine clearance in mL/min; default none */
  crcl?: number;
  /** Potassium in mmol/L; default none */
  k?: number;
  /** Weight-based dose check; needs `weight`; default none */
  dosePerKg?: PharmacyDosePerKg;
  /** Alerts; default none */
  alerts?: PharmacyOrderAlert[];
  /** Pharmacist who acted on it; default none */
  by?: string;
}

/** Tone and words of each order status. */
export const pharmacyStatuses: Record<PharmacyOrderStatus, { tone: BadgeTone; label: string }> = {
  pending: { tone: 'warning', label: 'Pending' },
  verified: { tone: 'success', label: 'Verified' },
  clarify: { tone: 'info', label: 'Clarify with prescriber' },
  rejected: { tone: 'danger', label: 'Rejected' },
};

export interface PharmacyVerificationQueueProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Initial orders; the queue keeps its own copy as statuses change; default none */
  orders?: PharmacyOrder[];
  /** Selected order id (controlled); default uncontrolled */
  selected?: string;
  /** Initially selected order id; default the first order */
  defaultSelected?: string;
  /** Called with the selected order id; default none */
  onSelectedChange?: (id: string) => void;
  /** Status filter (controlled): 'pending' | 'clarify' | 'all'; default uncontrolled */
  filter?: PharmacyQueueFilter;
  /** Initial status filter; default 'pending' */
  defaultFilter?: PharmacyQueueFilter;
  /** Called when the filter changes; default none */
  onFilterChange?: (filter: PharmacyQueueFilter) => void;
  /** Called when the pharmacist verifies, asks to clarify or rejects an order; default none */
  onStatusChange?: (id: string, status: PharmacyOrderStatus, order: PharmacyOrder) => void;
  /** Pharmacist name, recorded as `by` on orders they act on; default none */
  user?: string;
  /** Age of the oldest pending order ('42 min'); default 'now' */
  oldest?: string;
  /** Which shared reference range flags use; the lab range on a result still wins; default the global context, else 'outpatient' */
  rangeContext?: RangeContextId;
}

function doseCheck(o: PharmacyOrder): { value: number; over: ChartValueOverride } | null {
  if (!o.dosePerKg || !o.weight) return null;
  const d = o.dosePerKg;
  return {
    value: d.amount / o.weight,
    over: { name: 'Dose', unit: d.unit + '/kg/' + (d.per || 'dose'), dp: 1, low: d.min, high: d.max, ch: d.hardMax },
  };
}

/**
 * PharmacyVerificationQueue is the pharmacist queue: orders on the left, the selected order on the right with weight,
 * renal function, potassium, a weight-based dose check and interaction alerts, then Verify, Clarify or Reject.
 */
export const PharmacyVerificationQueue = forwardRef<HTMLElement, PharmacyVerificationQueueProps>(function PharmacyVerificationQueue(
  {
    orders: ordersProp,
    selected,
    defaultSelected,
    onSelectedChange,
    filter,
    defaultFilter = 'pending',
    onFilterChange,
    onStatusChange,
    user,
    oldest,
    rangeContext,
    ...rest
  },
  ref
) {
  const ctx = useRangeContext(null, rangeContext);
  const [orders, setOrders] = useState<PharmacyOrder[]>(ordersProp || []);
  const [sel, setSel] = useControllableState<string>(selected, defaultSelected ?? ordersProp?.[0]?.id ?? '', onSelectedChange);
  const [filt, setFilt] = useControllableState<PharmacyQueueFilter>(filter, defaultFilter, onFilterChange);
  const blockedId = useDomId('cp-pvq-blocked');
  const optionRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const list = orders.filter((o) => filt === 'all' || o.status === filt);
  const cur = orders.find((o) => o.id === sel);
  const pend = orders.filter((o) => o.status === 'pending').length;
  const dc = cur ? doseCheck(cur) : null;
  const dr = dc ? chartValue('DOSE', dc.value, withContext(dc.over, ctx)) : null;
  const blocked = !!dr && dr.flag === 'HH';
  /* One tab stop for the listbox: the selected option, else the first. */
  const focusId = list.some((o) => o.id === sel) ? sel : list[0]?.id;

  const setStatus = (id: string, s: PharmacyOrderStatus) => {
    let changed: PharmacyOrder | undefined;
    setOrders(
      orders.map((o) => {
        if (o.id !== id) return o;
        changed = { ...o, status: s, by: user ?? o.by };
        return changed;
      })
    );
    if (changed) onStatusChange?.(id, s, changed);
  };

  const onListKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number | null = null;
    if (e.key === 'ArrowDown') next = Math.min(list.length - 1, index + 1);
    else if (e.key === 'ArrowUp') next = Math.max(0, index - 1);
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = list.length - 1;
    if (next == null) return;
    e.preventDefault();
    const o = list[next];
    if (!o) return;
    setSel(o.id);
    optionRefs.current[o.id]?.focus();
  };

  return withRangeProvider(
    rangeContext,
    <Card
      ref={ref}
      title="Pharmacy Verification"
      subtitle={pend + ' pending . oldest ' + (oldest || 'now')}
      actions={
        <SegmentedControl
          size="sm"
          label="Status"
          value={filt}
          onChange={(v) => setFilt(v as PharmacyQueueFilter)}
          options={[
            { value: 'pending', label: 'Pending', count: pend },
            { value: 'clarify', label: 'Clarify' },
            { value: 'all', label: 'All' },
          ]}
        />
      }
      {...rest}
    >
      <div className="cp-q">
        {/* The listbox only exists when it has options: an empty listbox is invalid ARIA, so the empty state sits in a plain box. */}
        <div
          role={list.length ? 'listbox' : undefined}
          aria-label={list.length ? 'Orders to verify' : undefined}
          style={{ border: '1px solid var(--co-border)', borderRadius: 'var(--co-radius-md)', overflow: 'hidden' }}
        >
          {list.length ? (
            list.map((o, i) => {
              const s = pharmacyStatuses[o.status];
              return (
                <button
                  key={o.id}
                  ref={(el) => {
                    optionRefs.current[o.id] = el;
                  }}
                  type="button"
                  role="option"
                  aria-selected={o.id === sel}
                  tabIndex={o.id === focusId ? 0 : -1}
                  className={cx('cp-qrow', o.id === sel && 'is-on')}
                  onClick={() => setSel(o.id)}
                  onKeyDown={(e) => onListKey(e, i)}
                >
                  <Icon name="pill" size={16} />
                  <div className="co-li-b">
                    <div className="co-row co-gap-6">
                      <b>{o.drug}</b>
                      {o.stat ? (
                        <Badge tone="danger" size="sm">
                          STAT
                        </Badge>
                      ) : null}
                      {o.schedule ? (
                        <Badge tone="danger" size="sm" icon="shield">
                          {o.schedule}
                        </Badge>
                      ) : null}
                    </div>
                    <span className="co-mi-s">{o.patient + ' . ' + o.unit + ' . ' + o.age}</span>
                    {o.alerts && o.alerts.length ? (
                      <span className="co-mi-s" style={{ color: 'var(--co-warning-strong)' }}>
                        {o.alerts.length + ' alert' + (o.alerts.length > 1 ? 's' : '')}
                      </span>
                    ) : null}
                  </div>
                  <Badge tone={s.tone} size="sm">
                    {s.label}
                  </Badge>
                </button>
              );
            })
          ) : (
            <EmptyState compact title="Queue is clear">
              No orders in this status.
            </EmptyState>
          )}
        </div>
        {cur ? (
          <div className="co-dt">
            <div>
              <div className="co-row co-gap-6">
                <b style={{ fontSize: 16 }}>{cur.drug}</b>
                <Badge tone={pharmacyStatuses[cur.status].tone}>{pharmacyStatuses[cur.status].label}</Badge>
              </div>
              <div>{cur.sig}</div>
              <div className="co-mi-s">{'Ordered by ' + cur.prescriber + ' . ' + cur.ordered + ' . Indication: ' + (cur.indication || 'not given')}</div>
            </div>
            <div className="cp-chips">
              <span className="co-mi-s">Weight</span>
              {cur.weight ? <Val code="Wt" value={cur.weight} label="Weight" /> : <Badge tone="warning">No weight</Badge>}
              {cur.scr != null ? (
                <>
                  <span className="co-mi-s">Creatinine</span>
                  <Val code="Cr" value={cur.scr} label="Creatinine" />
                </>
              ) : null}
              {cur.crcl != null ? (
                <>
                  <span className="co-mi-s">CrCl</span>
                  <Val code="CrCl" value={cur.crcl} label="Creatinine clearance" />
                </>
              ) : null}
              {cur.k != null ? (
                <>
                  <span className="co-mi-s">Potassium</span>
                  <Val code="K" value={cur.k} label="Potassium" />
                </>
              ) : null}
            </div>
            {dc && dr && cur.dosePerKg ? (
              <Alert tone={dr.flag === 'HH' ? 'error' : dr.flag ? 'warning' : 'success'} title="Weight-based dose">
                <span>
                  {'Ordered '}
                  <Val code="DOSEABS" value={cur.dosePerKg.amount} over={{ name: 'Dose', unit: cur.dosePerKg.unit, dp: 0 }} noRange />
                  {' = '}
                  <Val code="DOSE" value={dc.value} over={dc.over} label="Dose per kg" showRange />
                </span>
              </Alert>
            ) : null}
            {(cur.alerts || []).map((a, i) => (
              <Alert key={i} tone={a.severity === 'major' ? 'error' : 'warning'} title={a.title}>
                {a.detail}
              </Alert>
            ))}
            {cur.status === 'pending' || cur.status === 'clarify' ? (
              <div className="co-row co-gap-8" style={{ flexWrap: 'wrap' }}>
                <Button
                  variant="primary"
                  iconLeft="check"
                  disabled={blocked}
                  aria-describedby={blocked ? blockedId : undefined}
                  onClick={() => setStatus(cur.id, 'verified')}
                >
                  Verify
                </Button>
                <Button iconLeft="message" onClick={() => setStatus(cur.id, 'clarify')}>
                  Clarify with Prescriber
                </Button>
                <Button variant="danger" onClick={() => setStatus(cur.id, 'rejected')}>
                  Reject
                </Button>
                {blocked ? (
                  <span id={blockedId} className="co-mi-s">
                    Verify is blocked above the hard dose limit.
                  </span>
                ) : null}
              </div>
            ) : (
              <Alert tone={cur.status === 'verified' ? 'success' : 'info'}>
                {pharmacyStatuses[cur.status].label + (cur.by ? ' by ' + cur.by : '') + '.'}
              </Alert>
            )}
          </div>
        ) : null}
      </div>
    </Card>
  );
});
