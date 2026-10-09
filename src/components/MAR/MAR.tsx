import { forwardRef, useState, type ForwardedRef, type HTMLAttributes, type ReactNode } from 'react';
import { useRangeContext, type RangeContextId } from '../../clinical';
import { cx } from '../../internal/cx';
import { useControllableState, useDomId } from '../../internal/hooks';
import { NURSING_CONTEXT, Value } from '../../internal/nursing';
import { Badge } from '../Badge/Badge';
import { BarcodeScanPrompt } from '../BarcodeScanPrompt/BarcodeScanPrompt';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { Icon } from '../Icon/Icon';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';

/** Status of one MAR time slot. 'Available' is a PRN dose that may be given. */
export type MarStatus = 'Given' | 'Held' | 'Refused' | 'Late' | 'Due' | 'Scheduled' | 'Running' | 'Available';
/** Order type. */
export type MarOrderType = 'scheduled' | 'prn' | 'continuous';
/** Row filter: 'all' or one order type. */
export type MarFilter = 'all' | MarOrderType;

/** One time slot of an order. */
export interface MarSlot {
  /** Slot status */
  status: MarStatus;
  /** Who recorded it */
  by?: string;
  /** When it was recorded */
  at?: string;
  /** Witness of a high-alert dose */
  witness?: string;
  /** Co-sign state ('Pending') */
  cosign?: string;
  /** Reason for Held or Refused */
  reason?: string;
  /** A value checked with the dose (glucose before insulin) */
  value?: { measure: string; v: number };
}

/** One medication order (row). */
export interface MarRow {
  /** Row id */
  id: string;
  /** Drug name (Tall Man lettering kept as given) */
  med: string;
  /** Dose ('25 mg') */
  dose: string;
  /** Route ('PO') */
  route: string;
  /** Frequency ('BID') */
  freq?: string;
  /** 'scheduled' | 'prn' | 'continuous' */
  type: MarOrderType;
  /** Expected medication barcode */
  barcode?: string;
  /** High-alert drug: Given needs a witness */
  highAlert?: boolean;
  /** Who co-signs after recording ('charge RN') */
  cosign?: string;
  /** Current rate of a continuous infusion */
  rateMlH?: number;
  /** PRN indication */
  prnReason?: string;
  /** PRN reassessment window; default '60 min' */
  reassess?: string;
  /** Last given time */
  lastGiven?: string;
  /** How late a dose is ('40 min'); fails Right time */
  lateBy?: string;
  /** What was dispensed when it differs from the order; fails Right dose */
  doseMismatch?: string;
  /** Slots by time column */
  slots: Record<string, MarSlot>;
}

/** What onRecord receives. */
export interface MarRecordEvent {
  row: string;
  time: string;
  status: 'Given' | 'Held' | 'Refused';
  witness: string;
  reason: string;
}

/** Scan results of the administer panel. */
export interface MarScans {
  patient?: boolean;
  med?: boolean;
}

export interface MARProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Orders; required */
  rows: MarRow[];
  /** Column times; required */
  times: string[];
  /** Current column; default none */
  nowTime?: string;
  /** Patient name for the wristband step; default none */
  patientName?: string;
  /** Expected wristband code; default none */
  patientBarcode?: string;
  /** Who records; default 'You' */
  nurse?: string;
  /** Time recorded; default the scheduled time */
  now?: string;
  /** Administer panel open at first; default none */
  defaultActive?: { row: string; time: string };
  /** Initial scan results; default {} */
  defaultScans?: MarScans;
  /** Initial witness; default '' */
  defaultWitness?: string;
  /** Controlled filter */
  filter?: MarFilter;
  /** Initial filter (uncontrolled); default 'all' */
  defaultFilter?: MarFilter;
  /** Called when the filter changes */
  onFilterChange?: (filter: MarFilter) => void;
  /** View only: cells are not buttons; default false */
  readOnly?: boolean;
  /** Called when a dose is recorded Given, Held or Refused */
  onRecord?: (e: MarRecordEvent) => void;
  /** Card title; default 'Medication Administration Record' */
  title?: string;
  /** Patient line; default none */
  subtitle?: string;
  /** Which shared reference range flags use; the lab range on a result still wins; default 'inpatient' when no global context is set */
  rangeContext?: RangeContextId;
}

/** Every MAR slot status. */
export const MAR_STATUSES: readonly MarStatus[] = ['Given', 'Held', 'Refused', 'Late', 'Due', 'Scheduled', 'Running'];

interface Right {
  k: string;
  ok: boolean;
  why: string;
}

function rightsFor(row: MarRow, scans: MarScans): Right[] {
  const pt = scans.patient === true;
  const md = scans.med === true;
  return [
    { k: 'Right patient', ok: pt, why: pt ? 'Wristband matched' : 'Scan wristband' },
    { k: 'Right drug', ok: md, why: md ? row.med : 'Scan medication' },
    { k: 'Right dose', ok: md && !row.doseMismatch, why: row.doseMismatch ? 'Dispensed ' + row.doseMismatch : row.dose },
    { k: 'Right route', ok: md, why: row.route },
    { k: 'Right time', ok: md && !row.lateBy, why: row.lateBy ? 'Late by ' + row.lateBy : 'Within window' },
  ];
}

const TYPE_LABEL: Record<MarOrderType, string> = { scheduled: 'Scheduled', prn: 'PRN', continuous: 'Continuous' };

function MARBase(
  {
    rows,
    times,
    nowTime,
    patientName,
    patientBarcode,
    nurse,
    now,
    defaultActive,
    defaultScans,
    defaultWitness = '',
    filter: filterProp,
    defaultFilter = 'all',
    onFilterChange,
    readOnly = false,
    onRecord,
    title = 'Medication Administration Record',
    subtitle,
    rangeContext,
    ...rest
  }: MARProps,
  ref: ForwardedRef<HTMLElement>
) {
  const ctx = useRangeContext(NURSING_CONTEXT, rangeContext);
  const witnessId = useDomId('co-mar-witness');
  const reasonId = useDomId('co-mar-reason');
  /* Doses recorded here overlay the props' slots, keyed 'rowId|time'. */
  const [recorded, setRecorded] = useState<Record<string, MarSlot>>({});
  const [active, setActive] = useState<{ row: string; time: string } | null>(defaultActive || null);
  const [scans, setScans] = useState<MarScans>(defaultScans || {});
  const [witness, setWitness] = useState(defaultWitness);
  const [reason, setReason] = useState('');
  const [filter, setFilter] = useControllableState<MarFilter>(filterProp, defaultFilter, onFilterChange);

  const slotOf = (r: MarRow, t: string): MarSlot | undefined => recorded[r.id + '|' + t] || (r.slots || {})[t];
  const act = active ? rows.find((r) => r.id === active.row) || null : null;

  const close = () => {
    setActive(null);
    setScans({});
    setWitness('');
    setReason('');
  };
  const record = (status: 'Given' | 'Held' | 'Refused') => {
    if (!act || !active) return;
    const prev = slotOf(act, active.time);
    const slot: MarSlot = { ...prev, status, by: nurse || 'You', at: now || active.time };
    if (act.highAlert) slot.witness = witness;
    else delete slot.witness;
    if (status === 'Given') delete slot.reason;
    else slot.reason = reason;
    if (act.cosign) slot.cosign = 'Pending';
    delete slot.value;
    if (prev && prev.value) slot.value = prev.value;
    setRecorded((m) => ({ ...m, [act.id + '|' + active.time]: slot }));
    onRecord?.({ row: act.id, time: active.time, status, witness, reason });
    close();
  };

  const shown = rows.filter((r) => filter === 'all' || r.type === filter);
  let due = 0;
  let late = 0;
  rows.forEach((r) =>
    Object.keys(r.slots || {}).forEach((t) => {
      const s = slotOf(r, t);
      if (s && s.status === 'Due') due++;
      if (s && s.status === 'Late') late++;
    })
  );
  const rights = act ? rightsFor(act, scans) : [];
  const allOk = rights.every((x) => x.ok);
  const needW = !!act && !!act.highAlert && !witness.trim();

  const panel =
    act && active ? (
      <div className="nu-panel" role="region" aria-label={'Administer ' + act.med}>
        <div className="nu-row nu-panel-h">
          <b>{'Administer ' + act.med + ' ' + act.dose + ' ' + act.route}</b>
          <span className="nu-muted nu-num">scheduled {active.time}</span>
          {act.highAlert ? (
            <Badge tone="danger" icon="alert">
              High-alert: independent double check
            </Badge>
          ) : null}
          <span className="nu-sp" />
          <Button size="sm" variant="ghost" onClick={close}>
            Cancel
          </Button>
        </div>
        <div className="nu-scans">
          <BarcodeScanPrompt
            key={act.id + '|' + active.time + '|patient'}
            step={1}
            target="patient"
            expected={patientBarcode}
            expectedLabel={patientName}
            defaultCode={scans.patient ? patientBarcode : ''}
            state={scans.patient === true ? 'matched' : scans.patient === false ? 'mismatch' : undefined}
            onScan={(_c, ok) => setScans((s) => ({ ...s, patient: ok }))}
          />
          <BarcodeScanPrompt
            key={act.id + '|' + active.time + '|med'}
            step={2}
            target="medication"
            expected={act.barcode}
            expectedLabel={act.med + ' ' + act.dose}
            defaultCode={scans.med ? act.barcode : ''}
            state={scans.med === true ? 'matched' : scans.med === false ? 'mismatch' : undefined}
            onScan={(_c, ok) => setScans((s) => ({ ...s, med: ok }))}
          />
        </div>
        <ul className="nu-rights" aria-label="Five rights check">
          {rights.map((x) => {
            /* A right fails visibly once the scan it depends on has been tried. */
            const tried = x.k === 'Right patient' ? scans.patient !== undefined : scans.med !== undefined;
            return (
              <li key={x.k} className={x.ok ? 'ok' : tried ? 'bad' : undefined}>
                <Icon name={x.ok ? 'check' : tried ? 'x' : 'minus'} size={14} />
                <span>
                  <b>{x.k}</b>
                  <span className="co-sr">{x.ok ? ': met' : tried ? ': not met' : ': not checked yet'}</span>
                  <br />
                  <span className="nu-muted">{x.why}</span>
                </span>
              </li>
            );
          })}
        </ul>
        {act.highAlert ? (
          <div className="nu-lbl nu-lbl-w">
            <label htmlFor={witnessId}>Witness (second RN, independent check) *</label>
            <input
              id={witnessId}
              className="nu-inp"
              value={witness}
              aria-required="true"
              placeholder="Scan badge or type name"
              onChange={(e) => setWitness(e.target.value)}
            />
          </div>
        ) : null}
        {act.cosign ? (
          <div className="nu-muted nu-hint">
            <Icon name="info" size={12} /> Needs co-sign by {act.cosign} after you record it.
          </div>
        ) : null}
        {act.prnReason ? (
          <div className="nu-muted nu-hint">
            PRN indication: {act.prnReason}. Reassess within {act.reassess || '60 min'}.
          </div>
        ) : null}
        <div className="nu-lbl nu-lbl-reason">
          <label htmlFor={reasonId}>Reason (needed for Held or Refused)</label>
          <input
            id={reasonId}
            className="nu-inp"
            value={reason}
            placeholder="For example: SBP 88, provider notified"
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <div className="nu-row nu-actions">
          <Button variant="primary" size="sm" disabled={!allOk || needW} onClick={() => record('Given')}>
            Record Given
          </Button>
          <Button size="sm" disabled={!reason.trim()} onClick={() => record('Held')}>
            Held
          </Button>
          <Button size="sm" disabled={!reason.trim()} onClick={() => record('Refused')}>
            Refused
          </Button>
          {!allOk ? (
            <span className="nu-muted">Given unlocks after both scans match.</span>
          ) : needW ? (
            <span className="nu-muted">Given unlocks after the witness is entered.</span>
          ) : null}
        </div>
      </div>
    ) : null;

  return (
    <Card ref={ref} title={title} subtitle={subtitle} {...rest}>
      <div className="nu-bar">
        <SegmentedControl
          size="sm"
          label="Filter"
          value={filter}
          onChange={(v) => setFilter(v as MarFilter)}
          options={[
            { value: 'all', label: 'All' },
            { value: 'scheduled', label: 'Scheduled' },
            { value: 'prn', label: 'PRN' },
            { value: 'continuous', label: 'Continuous' },
          ]}
        />
        {late ? (
          <Badge tone="danger" icon="clock">
            {late} late
          </Badge>
        ) : null}
        {due ? <Badge tone="warning">{due} due now</Badge> : null}
        <span className="nu-sp" />
        {readOnly ? (
          <Badge tone="neutral" icon="lock">
            View only
          </Badge>
        ) : null}
      </div>
      <div className="nu-tbx">
        <table className="nu-t nu-mar">
          <caption className="co-sr">Medication administration record. Rows are orders, columns are scheduled times.</caption>
          <thead>
            <tr>
              <th className="nu-rh" scope="col">
                Order
              </th>
              {times.map((t) => (
                <th key={t} scope="col" className={cx('nu-num nu-th-c', t === nowTime && 'nu-now')}>
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.id}>
                <th scope="row" className="nu-rh">
                  <div className="nu-med">
                    {r.med}{' '}
                    {r.highAlert ? (
                      <Badge tone="danger" size="sm" icon="alert">
                        High-alert
                      </Badge>
                    ) : null}
                  </div>
                  <div className="nu-muted">
                    {r.dose} {r.route} {r.freq}
                    {r.type === 'continuous' && r.rateMlH != null ? (
                      <span>
                        {' '}
                        at <Value measure="rate" value={r.rateMlH} rangeContext={ctx} />
                      </span>
                    ) : null}
                  </div>
                  <div className="nu-row nu-tags">
                    <Badge size="sm" tone={r.type === 'prn' ? 'info' : r.type === 'continuous' ? 'ai' : 'neutral'}>
                      {TYPE_LABEL[r.type]}
                    </Badge>
                    {r.cosign ? (
                      <Badge size="sm" tone="neutral">
                        Co-sign
                      </Badge>
                    ) : null}
                    {r.lastGiven ? <span className="nu-muted">Last {r.lastGiven}</span> : null}
                  </div>
                </th>
                {times.map((t) => {
                  const s = slotOf(r, t);
                  const tdCls = cx('nu-slot', t === nowTime && 'nu-now');
                  if (!s) return <td key={t} className={tdCls} />;
                  const can = !readOnly && (s.status === 'Due' || s.status === 'Late' || (r.type === 'prn' && s.status === 'Available'));
                  const inner: ReactNode = (
                    <>
                      <span className={'nu-st nu-st-' + (s.status === 'Available' ? 'Scheduled' : s.status)}>
                        {s.status === 'Available' ? 'PRN available' : s.status}
                      </span>
                      {s.by ? <span className="nu-muted nu-num">{s.at + ' ' + s.by}</span> : null}
                      {s.witness ? <span className="nu-muted">Witness {s.witness}</span> : null}
                      {s.cosign ? <span className="nu-muted">Co-sign {s.cosign}</span> : null}
                      {s.reason ? <span className="nu-muted nu-reason">{s.reason}</span> : null}
                      {s.value ? (
                        <span>
                          <Value measure={s.value.measure} value={s.value.v} tooltip={!can} rangeContext={ctx} />
                        </span>
                      ) : null}
                    </>
                  );
                  const isActive = !!active && active.row === r.id && active.time === t;
                  return (
                    <td key={t} className={tdCls}>
                      {can ? (
                        <button
                          type="button"
                          aria-label={'Administer ' + r.med + ' ' + t + ', ' + (s.status === 'Available' ? 'PRN available' : s.status)}
                          aria-pressed={isActive}
                          onClick={() => {
                            setActive({ row: r.id, time: t });
                            setScans({});
                            setWitness('');
                            setReason('');
                          }}
                        >
                          {inner}
                        </button>
                      ) : (
                        <span className="nu-slot-in">{inner}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {panel}
    </Card>
  );
}

/**
 * MAR is the medication administration record: scheduled, PRN and continuous orders by time, with Given, Held,
 * Refused, Late and Due states, a two-scan five rights check, a witness for high-alert drugs and co-sign.
 */
export const MAR = Object.assign(forwardRef<HTMLElement, MARProps>(MARBase), { statuses: MAR_STATUSES });
MAR.displayName = 'MAR';
