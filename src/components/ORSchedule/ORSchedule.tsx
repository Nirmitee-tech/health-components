import { forwardRef, useState, type HTMLAttributes, type KeyboardEvent } from 'react';
import { RangeContextProvider, type RangeContextId } from '../../clinical';
import { AcuteTable, AcuteValue, fmtClock, fmtMinutes, parseClock } from '../../internal/acute';
import { cx } from '../../internal/cx';
import { Badge, type BadgeTone } from '../Badge/Badge';
import { Card } from '../Card/Card';
import { EmptyState } from '../EmptyState/EmptyState';

export type ORCaseStatus =
  | 'Scheduled'
  | 'Pre-op'
  | 'In Room'
  | 'Anesthesia Ready'
  | 'Incision'
  | 'Closing'
  | 'PACU'
  | 'Complete'
  | 'Delayed'
  | 'Cancelled'
  | 'Add-on';

/** One operating room. */
export interface ORRoom {
  id: string;
  name: string;
  /** Service or block owner ("Orthopedics") */
  service?: string;
}

/** One surgical case. */
export interface ORCase {
  /** ORRoom id */
  room: string;
  /** Booked start 'HH:MM' */
  start: string;
  /** Booked minutes */
  duration: number;
  patient: string;
  /** Number shown on the family board instead of the name */
  publicId?: string;
  age?: number;
  procedure: string;
  /** 'Left' | 'Right' | 'Bilateral' */
  laterality?: string;
  surgeon: string;
  anesthesia?: string;
  status: ORCaseStatus;
  /** Minutes of delay; the block moves right by it */
  delay?: number;
  delayReason?: string;
}

export type ORScheduleVariant = 'timeline' | 'board';

const OR_STATUS: Record<ORCaseStatus, BadgeTone> = {
  Scheduled: 'neutral',
  'Pre-op': 'info',
  'In Room': 'ai',
  'Anesthesia Ready': 'ai',
  Incision: 'warning',
  Closing: 'warning',
  PACU: 'success',
  Complete: 'success',
  Delayed: 'danger',
  Cancelled: 'neutral',
  'Add-on': 'info',
};
const OR_FILL: Record<ORCaseStatus, string> = {
  Scheduled: 'var(--co-surface-muted)',
  'Pre-op': 'var(--co-primary-soft)',
  'In Room': 'var(--co-ai-soft)',
  'Anesthesia Ready': 'var(--co-ai-soft)',
  Incision: 'var(--co-warning-soft)',
  Closing: 'var(--co-warning-soft)',
  PACU: 'var(--co-success-soft)',
  Complete: 'var(--co-success-soft)',
  Delayed: 'var(--co-danger-soft)',
  Cancelled: 'var(--co-surface-alt)',
  'Add-on': 'var(--co-primary-soft)',
};
const LEGEND: ORCaseStatus[] = ['Scheduled', 'Pre-op', 'In Room', 'Incision', 'Closing', 'PACU', 'Delayed', 'Cancelled'];
const toneOf = (s: string): BadgeTone => (Object.prototype.hasOwnProperty.call(OR_STATUS, s) ? OR_STATUS[s as ORCaseStatus] : 'neutral');

export interface ORScheduleProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Operating rooms, top to bottom; required */
  rooms: ORRoom[];
  /** Cases of the day; required */
  cases: ORCase[];
  /** 'timeline' (rooms as rows, cases as blocks) | 'board' (status table); default 'timeline' */
  variant?: ORScheduleVariant;
  /** Timeline start 'HH:MM'; default '07:00' */
  dayStart?: string;
  /** Timeline end 'HH:MM'; default '19:00' */
  dayEnd?: string;
  /** Current time 'HH:MM' for the red Now line; default none */
  now?: string;
  /** Board for families: shows publicId instead of names; default false */
  publicView?: boolean;
  /** Day shown in the empty state; default 'this day' */
  date?: string;
  /** Card title; default 'OR Schedule' (timeline) or 'Surgery Status Board' (board) */
  title?: string;
  /** Line under the title; default none */
  subtitle?: string;
  /** Which shared reference range flags use; the lab range on a result still wins; default 'ed' when no global context is set */
  rangeContext?: RangeContextId;
}

/**
 * ORSchedule lays out the day's surgical cases per operating room on a timeline, with case status, delays, the current
 * time and room utilization; SurgeryBoard shows the same cases as a status board table.
 */
export const ORSchedule = forwardRef<HTMLElement, ORScheduleProps>(function ORSchedule(
  {
    rooms: roomsProp,
    cases: casesProp,
    variant = 'timeline',
    dayStart = '07:00',
    dayEnd = '19:00',
    now: nowProp,
    publicView = false,
    date,
    title,
    subtitle,
    rangeContext,
    ...rest
  },
  ref
) {
  const rooms = roomsProp || [];
  const cases = casesProp || [];
  const start = parseClock(dayStart);
  const end = parseClock(dayEnd);
  const span = Math.max(1, end - start);
  const now = nowProp != null ? parseClock(nowProp) : null;
  const board = variant === 'board';
  const [active, setActive] = useState<string | null>(null);

  if (!cases.length)
    return (
      <Card ref={ref} title={title || 'OR Schedule'} subtitle={subtitle} {...rest}>
        <EmptyState title="No cases booked" compact>
          {'Booked cases for ' + (date || 'this day') + ' appear here.'}
        </EmptyState>
      </Card>
    );

  if (board) {
    const sorted = cases
      .slice()
      .sort((a, b) => String(a.room).localeCompare(b.room) || parseClock(a.start) - parseClock(b.start));
    return (
      <Card ref={ref} title={title || 'Surgery Status Board'} subtitle={subtitle} padding="none" {...rest}>
        <RangeContextProvider value={rangeContext}>
          <AcuteTable label="Surgical cases by room and start time">
            <thead>
              <tr>
                {['Room', 'Start', 'Patient', 'Procedure', 'Surgeon / Anesthesia', 'Booked', 'Status'].map((c) => (
                  <th key={c} scope="col" className={cx('co-th-plain', c === 'Booked' && 'co-num')}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((c, i) => {
                const rm = rooms.find((r) => r.id === c.room);
                return (
                  <tr key={c.room + c.start + i}>
                    <td>
                      <b>{rm ? rm.name : c.room}</b>
                    </td>
                    <td className="co-ac-num">{fmtClock(parseClock(c.start))}</td>
                    <td>
                      <b>{publicView ? c.publicId || 'Patient' : c.patient}</b>
                      <div className="co-mi-s">{publicView ? 'Family view: name hidden' : c.age ? c.age + ' y' : ''}</div>
                    </td>
                    <td>
                      {c.procedure}
                      {c.laterality ? (
                        <div>
                          <Badge tone="warning" size="sm">
                            {c.laterality}
                          </Badge>
                        </div>
                      ) : null}
                    </td>
                    <td>
                      {c.surgeon}
                      <div className="co-mi-s">{c.anesthesia || 'Anesthesia TBD'}</div>
                    </td>
                    <td className="co-num">
                      <AcuteValue measure="duration" value={c.duration} />
                    </td>
                    <td>
                      <Badge tone={toneOf(c.status)} size="sm" icon={c.status === 'Delayed' ? 'clock' : undefined}>
                        {c.status}
                      </Badge>
                      {c.delay ? (
                        <div className="co-mi-s co-ac-num">
                          {'Delayed ' + fmtMinutes(c.delay) + (c.delayReason ? ', ' + c.delayReason : '')}
                        </div>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </AcuteTable>
        </RangeContextProvider>
      </Card>
    );
  }

  const hours: number[] = [];
  for (let t = Math.ceil(start / 60) * 60; t <= end; t += 60) hours.push(t);
  const util = (r: ORRoom) =>
    Math.round(
      (cases.filter((c) => c.room === r.id && c.status !== 'Cancelled').reduce((s, c) => s + c.duration, 0) / span) * 100
    );
  const byRoom = rooms.map((r) => cases.filter((c) => c.room === r.id));
  const cellKey = (ri: number, ci: number) => ri + ':' + ci;
  const firstKey = (() => {
    const ri = byRoom.findIndex((rc) => rc.length > 0);
    return ri < 0 ? null : cellKey(ri, 0);
  })();
  const current = active ?? firstKey;
  const gridStep = 6000 / span;

  /* Grid keyboard: arrows move between cases (left/right in a room, up/down to the nearest room with cases), Home/End. */
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!current) return;
    const [ri, ci] = current.split(':').map(Number) as [number, number];
    let next: string | null = null;
    const row = byRoom[ri] || [];
    if (e.key === 'ArrowRight' && ci < row.length - 1) next = cellKey(ri, ci + 1);
    else if (e.key === 'ArrowLeft' && ci > 0) next = cellKey(ri, ci - 1);
    else if (e.key === 'Home') next = cellKey(ri, 0);
    else if (e.key === 'End') next = cellKey(ri, row.length - 1);
    else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const d = e.key === 'ArrowDown' ? 1 : -1;
      for (let r = ri + d; r >= 0 && r < byRoom.length; r += d) {
        const rc = byRoom[r]!;
        if (rc.length) {
          next = cellKey(r, Math.min(ci, rc.length - 1));
          break;
        }
      }
    } else return;
    e.preventDefault();
    if (!next) return;
    setActive(next);
    const el = e.currentTarget.querySelector<HTMLElement>(`[data-cell="${next}"]`);
    el?.focus();
  };

  return (
    <Card ref={ref} title={title || 'OR Schedule'} subtitle={subtitle} padding="none" {...rest}>
      <RangeContextProvider value={rangeContext}>
        <div className="co-or-scroll">
          {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus -- focus sits on the case cells (roving tabindex), not the grid. */}
          <div
            className="co-or-tl"
            role="grid"
            aria-label={'Operating room timeline ' + fmtClock(start) + ' to ' + fmtClock(end)}
            onKeyDown={onKeyDown}
          >
            <div className="co-or-head" aria-hidden="true">
              <span />
              <div className="co-or-hours">
                {hours.map((hr) => (
                  <span key={hr} className="co-or-hour" style={{ left: ((hr - start) / span) * 100 + '%' }}>
                    {fmtClock(hr)}
                  </span>
                ))}
              </div>
            </div>
            {rooms.map((r, ri) => (
              <div key={r.id} role="row" className="co-or-row">
                <div role="rowheader" className="co-or-rh">
                  <b>{r.name}</b>
                  <div className="co-mi-s">{r.service || ''}</div>
                  <div className="co-or-util">
                    <AcuteValue measure="util" value={util(r)} range={{ lo: 70, hi: 100 }} shortFlag />
                  </div>
                </div>
                <div
                  className="co-or-track"
                  role="presentation"
                  style={{
                    background: `repeating-linear-gradient(90deg,transparent 0,transparent calc(${gridStep}% - 1px),var(--co-line-soft) calc(${gridStep}% - 1px),var(--co-line-soft) ${gridStep}%)`,
                  }}
                >
                  {byRoom[ri]!.map((c, ci) => {
                    const s0 = parseClock(c.start) + (c.delay || 0);
                    const k = cellKey(ri, ci);
                    return (
                      <div
                        key={k}
                        data-cell={k}
                        role="gridcell"
                        tabIndex={k === current ? 0 : -1}
                        onFocus={() => setActive(k)}
                        aria-label={fmtClock(s0) + ', ' + c.procedure + ', ' + c.surgeon + ', ' + c.status}
                        className={cx('co-or-case', c.status === 'Delayed' && 'is-delayed', c.status === 'Cancelled' && 'is-cancelled')}
                        style={{
                          left: ((s0 - start) / span) * 100 + '%',
                          width: 'calc(' + (c.duration / span) * 100 + '% - 3px)',
                          background: OR_FILL[c.status] || undefined,
                        }}
                      >
                        <div className="co-or-case-t">{fmtClock(s0) + ' ' + c.procedure}</div>
                        <div className="co-mi-s">
                          {c.surgeon + ' . ' + c.status + (c.delay ? ', +' + c.delay + ' min' : '')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {now != null && now >= start && now <= end ? (
              <div
                className="co-or-now"
                aria-hidden="true"
                style={{ left: 'calc(120px + (100% - 120px) * ' + (now - start) / span + ')' }}
              >
                <span className="co-or-now-l">{'Now ' + fmtClock(now)}</span>
              </div>
            ) : null}
          </div>
        </div>
        <div className="co-row co-gap-8 co-or-legend">
          {LEGEND.map((k) => (
            <Badge key={k} tone={OR_STATUS[k]} size="sm">
              {k}
            </Badge>
          ))}
        </div>
      </RangeContextProvider>
    </Card>
  );
});

export type SurgeryBoardProps = Omit<ORScheduleProps, 'variant'>;

/** SurgeryBoard is ORSchedule as a status board table (variant 'board'). */
export const SurgeryBoard = forwardRef<HTMLElement, SurgeryBoardProps>(function SurgeryBoard(props, ref) {
  return <ORSchedule ref={ref} variant="board" {...props} />;
});
