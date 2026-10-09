import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { Icon } from '../Icon/Icon';

/** Appointment-type colours (`--co-appt-*` tokens), used when `colorBy="type"`. */
export const appointmentChipColors = ['blue', 'green', 'teal', 'purple', 'red', 'orange', 'yellow', 'pink', 'gray'] as const;
export type AppointmentChipColor = (typeof appointmentChipColors)[number];

/** Appointment statuses with their own chip colour. Any other string renders with the neutral default. */
export type AppointmentChipStatus =
  | 'Scheduled'
  | 'Confirmed'
  | 'Arrived'
  | 'Checked In'
  | 'In Room'
  | 'Completed'
  | 'No Show'
  | 'Cancelled'
  | (string & {});

export interface AppointmentChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'color'> {
  /** Start time, e.g. "9:20" */
  time: string;
  /** Patient name */
  patient: string;
  /** Appointment type, e.g. "Follow-Up" */
  type: string;
  /** Appointment status ('Scheduled', 'Confirmed', 'Arrived', 'In Room', 'Completed', 'No Show', 'Cancelled'...); default none */
  status?: AppointmentChipStatus;
  /** Colour the stripe by status or by appointment type; default 'status' */
  colorBy?: 'status' | 'type';
  /** 'blue' | 'green' | 'teal' | 'purple' | 'red' | 'orange' | 'yellow' | 'pink' | 'gray'; default 'blue' */
  color?: AppointmentChipColor;
  /** Shows the video icon; default false */
  telehealth?: boolean;
  /** true: copay paid icon, false: copay due icon, undefined: no icon; default undefined */
  paid?: boolean;
  /** 'sm' (month view, no type line) | 'md'; default 'md' */
  size?: 'sm' | 'md';
}

/** AppointmentChip is one appointment on the calendar, coloured by status or by appointment type, with telehealth and paid or unpaid icons. */
const AppointmentChipBase = forwardRef<HTMLButtonElement, AppointmentChipProps>(function AppointmentChip(
  { time, patient, type, status, colorBy = 'status', color = 'blue', telehealth = false, paid, size = 'md', className, style, ...rest },
  ref
) {
  const st = status ? String(status).replace(/\s.*/, '') : null;
  const byType = colorBy === 'type' || !st;
  const label = [
    time,
    patient,
    type,
    status,
    telehealth ? 'telehealth' : null,
    paid === true ? 'copay paid' : paid === false ? 'copay due' : null,
  ]
    .filter(Boolean)
    .join(', ');
  return (
    <button
      ref={ref}
      type="button"
      className={cx('co-ap', st && !byType && `co-ap-s-${st}`, size === 'sm' && 'co-ap-sm', className)}
      style={byType ? { borderLeftColor: `var(--co-appt-${color})`, ...style } : style}
      aria-label={label}
      {...rest}
    >
      <span className="co-ap-r">
        <b>{time}</b>
        {telehealth ? <Icon name="video" size={12} className="co-ap-ic" /> : null}
        {paid === true ? (
          <Icon name="paid" size={12} className="co-ap-ic co-ap-paid" />
        ) : paid === false ? (
          <Icon name="dollar" size={12} className="co-ap-ic co-ap-due" />
        ) : null}
      </span>
      <span className="co-ap-p">{patient}</span>
      {size === 'sm' ? null : (
        <span className="co-ap-t">
          {type}
          {status ? ` · ${status}` : ''}
        </span>
      )}
    </button>
  );
});

/** AppointmentChip, with the type colours on `AppointmentChip.colors`. */
export const AppointmentChip = Object.assign(AppointmentChipBase, { colors: appointmentChipColors });
