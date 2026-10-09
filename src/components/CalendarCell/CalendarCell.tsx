import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { AppointmentChip, type AppointmentChipProps } from '../AppointmentChip/AppointmentChip';
import { Button } from '../Button/Button';

export type CalendarCellView = 'month' | 'week' | 'day';

export interface CalendarCellProps extends HTMLAttributes<HTMLDivElement> {
  /** 'month' | 'week' | 'day'; default 'month' */
  view?: CalendarCellView;
  /** Day number or label ("Thu 9"); required for month and week */
  date?: string | number;
  /** Row time ("9:20 AM"); required for day */
  time?: string;
  /** AppointmentChip props[]; default [] */
  appointments?: AppointmentChipProps[];
  /** Appointment count shown in the month header; default none */
  count?: number;
  /** Highlights today; default false */
  today?: boolean;
  /** Day outside the current month; default false */
  dim?: boolean;
  /** Reason the time is blocked ("Lunch", "CME conference"); default none */
  blocked?: string;
  /** aria-label of the cell (month and week); default none */
  label?: string;
  /** Called with `time` when the free slot of a day row is chosen; default none */
  onBook?: (time: string | undefined) => void;
  /** Called when "+N more" is chosen in a month or week cell; default none */
  onMore?: () => void;
}

/**
 * CalendarCell renders one cell of the month, week or day calendar with its appointments, blocked time and free slots.
 * Month and week cells are `gridcell`s and day rows are `row`s, so place them inside a `grid` (Calendar does this).
 */
export const CalendarCell = forwardRef<HTMLDivElement, CalendarCellProps>(function CalendarCell(
  { view = 'month', date, time, appointments = [], count, today = false, dim = false, blocked, label, onBook, onMore, className, ...rest },
  ref
) {
  if (view === 'day') {
    return (
      <div ref={ref} className={cx('co-cal-day', className)} role="row" {...rest}>
        <div className="co-cal-tm" role="rowheader">
          {time}
        </div>
        <div className={cx('co-cal-slot', blocked && 'is-blk')} role="gridcell">
          {blocked ? (
            <span className="co-blk">{blocked}</span>
          ) : appointments.length ? (
            appointments.map((a, i) => <AppointmentChip key={`${a.time}-${a.patient}-${i}`} {...a} />)
          ) : (
            <button type="button" className="co-free" onClick={() => onBook?.(time)}>
              + Book {time}
            </button>
          )}
        </div>
      </div>
    );
  }
  const max = view === 'week' ? 6 : 3;
  return (
    <div
      ref={ref}
      className={cx('co-cal-c', `co-cal-${view}`, today && 'is-today', dim && 'is-dim', className)}
      role="gridcell"
      aria-label={label}
      {...rest}
    >
      <div className="co-cal-dh">
        <span className={cx('co-cal-n', today && 'is-today')}>{date}</span>
        {count != null ? <span className="co-mi-s">{count} appts</span> : null}
      </div>
      {blocked ? <span className="co-blk">{blocked}</span> : null}
      {appointments.slice(0, max).map((a, i) => (
        <AppointmentChip key={`${a.time}-${a.patient}-${i}`} size={view === 'month' ? 'sm' : undefined} {...a} />
      ))}
      {appointments.length > max ? (
        <Button variant="link" onClick={onMore}>
          +{appointments.length - max} more
        </Button>
      ) : null}
    </div>
  );
});
