import { forwardRef, useRef, type HTMLAttributes, type KeyboardEvent } from 'react';
import { cx } from '../../internal/cx';
import { useControllableState, useDomId } from '../../internal/hooks';

export type TimeSlotState = 'available' | 'booked' | 'held' | 'blocked';

/** One bookable time. */
export interface TimeSlot {
  /** Time label, also the value passed to onChange, e.g. "9:20 AM" */
  time: string;
  /** 'available' | 'booked' | 'held' | 'blocked'; default 'available' */
  state?: TimeSlotState;
}

/** One day in the optional day strip. */
export interface TimeSlotDay {
  /** Unique id, the value passed to onDayChange */
  id: string;
  /** Short weekday, e.g. "Thu" */
  weekday: string;
  /** Date label, e.g. "Oct 9" */
  date: string;
  /** Fully booked or closed: shown as "Full" and not selectable; default false */
  disabled?: boolean;
}

export interface TimeSlotPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Array<{time, state: available|booked|held|blocked}> */
  slots: TimeSlot[];
  /** Array<{id, weekday, date, disabled?}>; default none (no day strip) */
  days?: TimeSlotDay[];
  /** Selected time (controlled); default undefined */
  value?: string | null;
  /** Initially selected time (uncontrolled); default none */
  defaultValue?: string | null;
  /** (time) => void, called when a slot is chosen; default none */
  onChange?: (time: string) => void;
  /** Selected day id (controlled); default undefined */
  day?: string;
  /** Initially selected day id (uncontrolled); default the first day */
  defaultDay?: string;
  /** (dayId) => void, called when a day is chosen; default none */
  onDayChange?: (day: string) => void;
  /** Group label shown above the grid, e.g. provider and visit length; default "Available times" (not shown) */
  label?: string;
}

const NEXT = ['ArrowRight', 'ArrowDown'];
const PREV = ['ArrowLeft', 'ArrowUp'];

/** Index to move to for a radio-group key press, skipping disabled items and wrapping. Null if the key is not handled. */
function nextRadioIndex(disabled: boolean[], from: number, key: string): number | null {
  const n = disabled.length;
  if (n === 0) return null;
  const enabled = (i: number) => !disabled[i];
  if (key === 'Home' || key === 'End') {
    const order = key === 'Home' ? [...Array(n).keys()] : [...Array(n).keys()].reverse();
    const hit = order.find(enabled);
    return hit ?? null;
  }
  const step = NEXT.includes(key) ? 1 : PREV.includes(key) ? -1 : 0;
  if (!step) return null;
  for (let k = 1; k <= n; k++) {
    const i = (((from + step * k) % n) + n) % n;
    if (enabled(i)) return i;
  }
  return null;
}

function rovingKeyDown(
  e: KeyboardEvent<HTMLElement>,
  disabled: boolean[],
  refs: (HTMLButtonElement | null)[],
  select: (i: number) => void
) {
  const from = refs.findIndex((r) => r === e.target);
  if (from < 0) return;
  const to = nextRadioIndex(disabled, from, e.key);
  if (to === null) return;
  e.preventDefault();
  refs[to]?.focus();
  select(to);
}

/** The roving tab stop: the checked item when enabled, otherwise the first enabled item. */
function tabStop(disabled: boolean[], checked: number): number {
  if (checked >= 0 && !disabled[checked]) return checked;
  return disabled.findIndex((d) => !d);
}

/**
 * TimeSlotPicker shows open times as a grid of slots, with booked, held, available and selected states, and an optional day strip.
 * Days and slots are radio groups: Arrow keys move and select, Home and End jump to the first and last open item.
 */
export const TimeSlotPicker = forwardRef<HTMLDivElement, TimeSlotPickerProps>(function TimeSlotPicker(
  { slots, days, value, defaultValue = null, onChange, day, defaultDay, onDayChange, label, className, id, ...rest },
  ref
) {
  const baseId = useDomId('co-tsp', id);
  const [selected, setSelected] = useControllableState<string | null>(value, defaultValue, (t) => {
    if (t !== null) onChange?.(t);
  });
  const [currentDay, setCurrentDay] = useControllableState<string | undefined>(
    day,
    defaultDay ?? days?.[0]?.id,
    (d) => {
      if (d !== undefined) onDayChange?.(d);
    }
  );
  const dayRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const slotRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const dayDisabled = (days ?? []).map((d) => !!d.disabled);
  const dayStop = tabStop(dayDisabled, (days ?? []).findIndex((d) => d.id === currentDay));
  const slotDisabled = slots.map((s) => s.state === 'booked' || s.state === 'blocked');
  const slotStop = tabStop(slotDisabled, slots.findIndex((s) => s.time === selected));
  const labelId = `${baseId}-label`;

  return (
    <div ref={ref} id={id} className={cx('co-tsp', className)} {...rest}>
      {days ? (
        <div
          className="co-hscroll"
          role="radiogroup"
          aria-label="Day"
          onKeyDown={(e) => rovingKeyDown(e, dayDisabled, dayRefs.current, (i) => setCurrentDay(days[i]!.id))}
        >
          {days.map((d, i) => {
            const on = d.id === currentDay;
            return (
              <button
                key={d.id}
                ref={(el) => {
                  dayRefs.current[i] = el;
                }}
                type="button"
                role="radio"
                aria-checked={on}
                tabIndex={i === dayStop ? 0 : -1}
                className={cx('co-day', on && 'is-on')}
                disabled={d.disabled}
                onClick={() => setCurrentDay(d.id)}
              >
                <span className="co-day-w">{d.weekday}</span>
                <b>{d.date}</b>
                {d.disabled ? <span className="co-day-w">Full</span> : null}
              </button>
            );
          })}
        </div>
      ) : null}
      {label ? (
        <div className="co-lbl" id={labelId}>
          {label}
        </div>
      ) : null}
      <div
        className="co-slotg"
        role="radiogroup"
        aria-label={label ? undefined : 'Available times'}
        aria-labelledby={label ? labelId : undefined}
        onKeyDown={(e) => rovingKeyDown(e, slotDisabled, slotRefs.current, (i) => setSelected(slots[i]!.time))}
      >
        {slots.map((s, i) => {
          const on = selected === s.time;
          const booked = s.state === 'booked';
          const held = s.state === 'held';
          return (
            <button
              key={s.time}
              ref={(el) => {
                slotRefs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={i === slotStop ? 0 : -1}
              className={cx('co-slot', on && 'is-on', booked && 'is-booked', held && 'is-held')}
              disabled={slotDisabled[i]}
              aria-label={`${s.time}${booked ? ', booked' : held ? ', held' : s.state === 'blocked' ? ', blocked' : ', available'}`}
              onClick={() => setSelected(s.time)}
            >
              {s.time}
            </button>
          );
        })}
      </div>
      <div className="co-legend">
        <span>
          <i className="co-dot co-dot-free" />
          Available
        </span>
        <span>
          <i className="co-dot co-dot-on" />
          Selected
        </span>
        <span>
          <i className="co-dot co-dot-booked" />
          Booked
        </span>
      </div>
    </div>
  );
});
