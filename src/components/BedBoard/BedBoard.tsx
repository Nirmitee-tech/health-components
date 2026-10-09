import { forwardRef, useRef, useState, type DragEvent, type HTMLAttributes, type KeyboardEvent } from 'react';
import { RangeContextProvider, type RangeContextId } from '../../clinical';
import { cx } from '../../internal/cx';
import { useControllableState } from '../../internal/hooks';
import { Alert } from '../Alert/Alert';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { IsolationBadge, type IsolationType } from '../IsolationBadge/IsolationBadge';
import { LevelOfCareBadge, type LevelOfCare } from '../LevelOfCareBadge/LevelOfCareBadge';

/** Bed status. */
export type BedStatus = 'clean' | 'dirty' | 'occupied' | 'blocked' | 'pending';

/** Status words, as shown on each bed. */
export const bedStatusLabels: Readonly<Record<BedStatus, string>> = {
  clean: 'Clean, ready',
  dirty: 'Dirty, EVS called',
  occupied: 'Occupied',
  blocked: 'Blocked',
  pending: 'Assigned, arriving',
};

const STATUS_COLOR: Record<BedStatus, string> = {
  clean: 'var(--co-success)',
  dirty: 'var(--co-warning)',
  occupied: 'var(--co-primary)',
  blocked: 'var(--co-muted)',
  pending: 'var(--co-ai)',
};

/** The patient in a bed. */
export interface BedPatient {
  /** Queue id, when the patient came from the queue; default none */
  id?: string;
  /** 'Last, First' */
  name: string;
  /** Age in years */
  age?: number;
  /** 'F' | 'M' | other; used for the roommate check */
  sex?: string;
  /** Diagnosis or reason for admission */
  dx?: string;
  /** Length of stay in days (0 on the day of admission); shown as "day n+1" */
  los?: number;
  /** Isolation type; default none */
  isolation?: IsolationType;
  /** Discharge expected today; default false */
  dischargeToday?: boolean;
  /** Fall risk; default false */
  fallRisk?: boolean;
}

/** One bed. */
export interface Bed {
  /** Bed letter ('A') */
  id: string;
  /** 'clean' | 'dirty' | 'occupied' | 'blocked' | 'pending' */
  status: BedStatus;
  /** Note for an empty bed ('EVS called 13:52'); default none */
  note?: string;
  /** The patient in it; default none */
  patient?: BedPatient | null;
}

/** One room. */
export interface BedRoom {
  /** Room number ('401') */
  id: string;
  /** Negative-pressure (airborne isolation) room; default false */
  negativePressure?: boolean;
  /** Its beds */
  beds: Bed[];
}

/** One unit. */
export interface BedUnit {
  /** Unit id */
  id: string;
  /** Unit name ('4 West Med-Surg') */
  name: string;
  /** Level of care of the unit */
  level: LevelOfCare;
  /** Nurse-to-patient ratio ('1:5'); default none */
  ratio?: string;
  /** Its rooms */
  rooms: BedRoom[];
}

/** A patient waiting for a bed. */
export interface BedQueuePatient {
  /** Queue id */
  id: string;
  /** 'Last, First' */
  name: string;
  /** Age in years */
  age: number;
  /** 'F' | 'M' | other */
  sex: string;
  /** Reason for admission */
  reason: string;
  /** Level of care requested */
  level: LevelOfCare;
  /** Isolation type; default none */
  isolation?: IsolationType;
  /** Time waiting ('2 h 10 min') */
  waiting: string;
}

/** Result of the placement check. */
export interface BedPlacementCheck {
  /** The patient can go to this bed */
  ok: boolean;
  /** Why not; default none */
  why?: string;
}

/**
 * Placement check. It catches only the conflicts it has data for: bed status, airborne patients outside a
 * negative-pressure room, isolation patients with a roommate and a different-sex roommate. It does not know about
 * cohorting by organism or a charge nurse's override; a nurse confirms every move.
 */
export function bedPlacementCheck(pt: BedQueuePatient | null | undefined, bed: Bed, room: BedRoom): BedPlacementCheck {
  if (!pt) return { ok: false };
  if (bed.status !== 'clean')
    return {
      ok: false,
      why: 'Bed is ' + bedStatusLabels[bed.status].toLowerCase(),
    };
  if (pt.isolation && /airborne/.test(pt.isolation) && !room.negativePressure)
    return {
      ok: false,
      why: 'Airborne isolation needs a negative-pressure room',
    };
  const mate = room.beds.find((b) => b !== bed && b.patient);
  if (mate && pt.isolation && pt.isolation !== 'standard')
    return { ok: false, why: 'Isolation patient needs a private room' };
  if (mate && mate.patient?.sex && pt.sex && mate.patient.sex !== pt.sex)
    return { ok: false, why: 'Roommate is a different sex' };
  return { ok: true };
}

interface Message {
  tone: 'error' | 'success';
  text: string;
}

export interface BedBoardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Array of { id, name, level, ratio, rooms: [{ id, negativePressure, beds: [{ id, status, note, patient }] }] }: the initial board (uncontrolled); required */
  units: BedUnit[];
  /** The board (controlled); pair with onUnitsChange; default uncontrolled from `units` */
  unitsValue?: BedUnit[];
  /** Called with the new board after an assignment; default none */
  onUnitsChange?: (units: BedUnit[]) => void;
  /** Array of patients waiting for a bed { id, name, age, sex, reason, level, isolation, waiting }: the initial queue; default [] */
  queue?: BedQueuePatient[];
  /** The queue (controlled); pair with onQueueChange; default uncontrolled from `queue` */
  queueValue?: BedQueuePatient[];
  /** Called with the new queue after an assignment; default none */
  onQueueChange?: (queue: BedQueuePatient[]) => void;
  /** Queue id selected at start (uncontrolled); default none */
  defaultSelected?: string;
  /** Selected queue id (controlled; null for none); default uncontrolled */
  selected?: string | null;
  /** Called with the newly selected queue id (null when cleared); default none */
  onSelectedChange?: (id: string | null) => void;
  /** function(patient, bed, room) after a patient is assigned; default none */
  onAssign?: (patient: BedQueuePatient, bed: Bed, room: BedRoom) => void;
  /** View only: no drag, no assign; default false */
  readOnly?: boolean;
  /** Card title; default 'Bed Board' */
  title?: string;
  /** Line under the title; default none */
  subtitle?: string;
  /** Which shared reference range flags use; the lab range on a result still wins; default 'inpatient' when no global context is set */
  rangeContext?: RangeContextId;
}

const EMPTY_QUEUE: BedQueuePatient[] = [];

/**
 * BedBoard shows every bed on one or more units by room, with its status, the patient in it and their precautions,
 * and lets bed management drag a waiting patient onto a clean bed.
 */
export const BedBoard = forwardRef<HTMLElement, BedBoardProps>(function BedBoard(
  {
    units: initialUnits,
    unitsValue,
    onUnitsChange,
    queue: initialQueue = EMPTY_QUEUE,
    queueValue,
    onQueueChange,
    defaultSelected,
    selected,
    onSelectedChange,
    onAssign,
    readOnly = false,
    title = 'Bed Board',
    subtitle,
    rangeContext,
    ...rest
  },
  ref
) {
  const [units, setUnits] = useControllableState(unitsValue, initialUnits, onUnitsChange);
  const [queue, setQueue] = useControllableState(queueValue, initialQueue, onQueueChange);
  const [sel, setSel] = useControllableState<string | null>(selected, defaultSelected ?? null, onSelectedChange);
  const [msg, setMsg] = useState<Message | null>(null);
  const optRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const pt = queue.find((q) => q.id === sel);

  function assign(ptId: string, ui: number, ri: number, bi: number) {
    const who = queue.find((q) => q.id === ptId);
    const room = units[ui]?.rooms[ri];
    const bed = room?.beds[bi];
    if (!who || !room || !bed || readOnly) return;
    const c = bedPlacementCheck(who, bed, room);
    if (!c.ok) {
      setMsg({
        tone: 'error',
        text: who.name + ' cannot go to ' + room.id + bed.id + ': ' + c.why + '.',
      });
      return;
    }
    const placed: Bed = {
      ...bed,
      status: 'pending',
      patient: {
        id: who.id,
        name: who.name,
        age: who.age,
        sex: who.sex,
        dx: who.reason,
        isolation: who.isolation,
      },
    };
    const nu = units.map((u, i) =>
      i !== ui
        ? u
        : {
            ...u,
            rooms: u.rooms.map((r, j) =>
              j !== ri
                ? r
                : {
                    ...r,
                    beds: r.beds.map((b, k) => (k === bi ? placed : b)),
                  }
            ),
          }
    );
    setUnits(nu);
    setQueue(queue.filter((q) => q.id !== ptId));
    setSel(null);
    setMsg({
      tone: 'success',
      text: who.name + ' assigned to ' + nu[ui]!.name + ' ' + room.id + bed.id + '. Waiting for transport.',
    });
    onAssign?.(who, placed, nu[ui]!.rooms[ri]!);
  }

  const counts: Record<BedStatus, number> = {
    clean: 0,
    dirty: 0,
    occupied: 0,
    blocked: 0,
    pending: 0,
  };
  units.forEach((u) => u.rooms.forEach((r) => r.beds.forEach((b) => (counts[b.status] = (counts[b.status] || 0) + 1))));

  const focusId = queue.some((q) => q.id === sel) ? sel : queue[0]?.id;
  const onQueueKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let n = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = Math.min(queue.length - 1, i + 1);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = Math.max(0, i - 1);
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = queue.length - 1;
    if (n < 0) return;
    e.preventDefault();
    optRefs.current[queue[n]!.id]?.focus();
  };

  return (
    <RangeContextProvider value={rangeContext}>
      <Card
        ref={ref}
        title={title}
        subtitle={subtitle}
        actions={
          <div className="ip-legend" role="group" aria-label="Bed status counts">
            {(Object.keys(counts) as BedStatus[]).map((k) => (
              <span key={k}>
                <i className="ip-sw" style={{ background: STATUS_COLOR[k] }} />
                {bedStatusLabels[k].split(',')[0] + ' ' + counts[k]}
              </span>
            ))}
          </div>
        }
        {...rest}
      >
        {readOnly ? (
          <Alert tone="lock" title="View only">
            Your role can see beds but not assign them.
          </Alert>
        ) : null}
        {queue.length ? (
          <div>
            <div className="co-kl" style={{ marginBottom: 6 }}>
              {'Waiting for a bed (' + queue.length + '). Drag to a clean bed, or select and press Assign on a bed.'}
            </div>
            <div className="ip-queue" role="listbox" aria-label="Patients waiting for a bed">
              {queue.map((q, i) => (
                <button
                  key={q.id}
                  ref={(el) => {
                    optRefs.current[q.id] = el;
                  }}
                  type="button"
                  role="option"
                  aria-selected={sel === q.id}
                  tabIndex={q.id === focusId ? 0 : -1}
                  className={cx('ip-qpt', sel === q.id && 'is-on')}
                  draggable={!readOnly}
                  disabled={readOnly}
                  onDragStart={(e: DragEvent<HTMLButtonElement>) => {
                    e.dataTransfer.setData('text/plain', q.id);
                    setSel(q.id);
                  }}
                  onClick={() => setSel(sel === q.id ? null : q.id)}
                  onKeyDown={(e) => onQueueKey(e, i)}
                >
                  <b>{q.name}</b>
                  <span className="ip-bed-st">
                    {q.age + ' y ' + q.sex + ' · ' + q.reason + ' · waiting ' + q.waiting}
                  </span>
                  <span className="ip-bed-tags">
                    <LevelOfCareBadge level={q.level} size="sm" compact />
                    {q.isolation ? <IsolationBadge type={q.isolation} size="sm" compact /> : null}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : null}
        {msg ? (
          <div style={{ marginBottom: 10 }}>
            <Alert tone={msg.tone} onDismiss={() => setMsg(null)}>
              {msg.text}
            </Alert>
          </div>
        ) : null}
        <div className="ip-units">
          {units.map((u, ui) => (
            <section key={u.id} aria-label={u.name}>
              <div className="ip-unit-h">
                <h3>{u.name}</h3>
                <span className="co-row co-gap-6">
                  <LevelOfCareBadge level={u.level} size="sm" compact />
                  {u.ratio ? <Badge size="sm">{'RN ratio ' + u.ratio}</Badge> : null}
                </span>
              </div>
              <div className="ip-rooms">
                {u.rooms.map((r, ri) => (
                  <div key={r.id} className="ip-room">
                    <div className="ip-room-n">
                      <span>{'Room ' + r.id}</span>
                      {r.negativePressure ? <span title="Negative-pressure room">Neg. pressure</span> : null}
                    </div>
                    {r.beds.map((b, bi) => {
                      const chk = pt ? bedPlacementCheck(pt, b, r) : null;
                      const label =
                        'Bed ' +
                        r.id +
                        b.id +
                        ', ' +
                        bedStatusLabels[b.status] +
                        (b.patient ? ', ' + b.patient.name : '') +
                        (chk && !chk.ok && chk.why ? '. ' + chk.why : '');
                      return (
                        <div
                          key={b.id}
                          className={cx(
                            'ip-bed',
                            'st-' + b.status,
                            chk && chk.ok && 'is-drop',
                            chk && !chk.ok && 'is-nodrop'
                          )}
                          role="group"
                          aria-label={label}
                          onDragOver={(e) => {
                            if (!readOnly && b.status === 'clean') e.preventDefault();
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            assign(e.dataTransfer.getData('text/plain'), ui, ri, bi);
                          }}
                        >
                          <div className="ip-bed-top">
                            <span>{r.id + b.id}</span>
                            <span className="ip-bed-st">{bedStatusLabels[b.status]}</span>
                          </div>
                          {b.patient ? (
                            <div>
                              <div>
                                {b.patient.name}{' '}
                                {b.patient.age != null || b.patient.sex ? (
                                  <span className="ip-bed-st">
                                    {[b.patient.age != null ? b.patient.age + ' y' : null, b.patient.sex]
                                      .filter(Boolean)
                                      .join(' ')}
                                  </span>
                                ) : null}
                              </div>
                              {b.patient.dx || b.patient.los != null ? (
                                <div className="ip-bed-st">
                                  {[b.patient.dx, b.patient.los != null ? 'day ' + (b.patient.los + 1) : null]
                                    .filter(Boolean)
                                    .join(' · ')}
                                </div>
                              ) : null}
                            </div>
                          ) : b.note ? (
                            <div className="ip-bed-st">{b.note}</div>
                          ) : null}
                          {b.patient ? (
                            <div className="ip-bed-tags">
                              {b.patient.isolation ? (
                                <IsolationBadge type={b.patient.isolation} size="sm" compact />
                              ) : null}
                              {b.patient.dischargeToday ? (
                                <Badge tone="success" size="sm">
                                  DC today
                                </Badge>
                              ) : null}
                              {b.patient.fallRisk ? (
                                <Badge tone="warning" size="sm">
                                  Fall risk
                                </Badge>
                              ) : null}
                            </div>
                          ) : null}
                          {pt && chk && chk.ok && !readOnly ? (
                            <Button size="sm" variant="primary" onClick={() => assign(pt.id, ui, ri, bi)}>
                              {'Assign ' + pt.name.split(',')[0]}
                            </Button>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Card>
    </RangeContextProvider>
  );
});
