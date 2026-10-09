import { forwardRef, type HTMLAttributes } from 'react';
import { age, ageLong, date, dateTime, gestational, time, toDate, type DateInput } from '../../clinical';
import { cx } from '../../internal/cx';

export type DateTimeClinicalMode = 'date' | 'time' | 'datetime' | 'dob' | 'age' | 'gestational';

export interface DateTimeClinicalProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Date value: ISO string ('2026-10-09' is a calendar date) or Date; required except in 'gestational' mode */
  value?: string | Date;
  /** 'date' (MM/DD/YYYY) | 'time' | 'datetime' | 'dob' (date and age) | 'age' | 'gestational'; default 'date' */
  mode?: DateTimeClinicalMode;
  /** 24-hour time; default false (12-hour) */
  hour24?: boolean;
  /** IANA zone; shows the zone abbreviation with times; default the browser zone */
  timeZone?: string;
  /** Date the age or gestational age is computed at; default today */
  asOf?: string | Date;
  /** Gestational age weeks; default none */
  weeks?: number;
  /** Gestational age days; default 0 */
  days?: number;
  /** Estimated due date; gestational age is computed from it when set; default none */
  edd?: string;
  /** Text before ('Admitted'); default none */
  prefix?: string;
  /** Relative text after ('2 h ago'); default none */
  relative?: string;
}

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/** The machine-readable `datetime` attribute: a calendar date stays a date, an instant becomes ISO UTC. */
function isoAttr(v: DateInput | undefined, mode: DateTimeClinicalMode): string | undefined {
  if (v == null || mode === 'gestational') return undefined;
  if (typeof v === 'string' && DATE_ONLY.test(v) && mode !== 'time' && mode !== 'datetime') return v;
  const d = toDate(v);
  return isNaN(d.getTime()) ? undefined : d.toISOString();
}

/**
 * DateTimeClinical shows dates as MM/DD/YYYY, times in 12- or 24-hour form with an optional zone, and ages from
 * date of birth down to days for newborns, plus gestational age.
 */
export const DateTimeClinical = forwardRef<HTMLTimeElement, DateTimeClinicalProps>(function DateTimeClinical(
  { value, mode = 'date', hour24, timeZone, asOf, weeks, days, edd, prefix, relative, className, title, ...rest },
  ref
) {
  const o = { hour24, timeZone };
  let text = '';
  if (mode === 'date') text = date(value, o);
  else if (mode === 'time') text = time(value, o);
  else if (mode === 'datetime') text = dateTime(value, o);
  else if (mode === 'dob') text = date(value) + ' (' + age(value, asOf) + ')';
  else if (mode === 'age') text = age(value, asOf);
  else if (mode === 'gestational') text = 'GA ' + gestational({ weeks, days, edd, asOf });
  const ageTitle =
    mode === 'dob' || mode === 'age' ? 'Age ' + ageLong(value, asOf) + (asOf ? ' on ' + date(asOf) : '') : undefined;

  return (
    <time
      ref={ref}
      className={cx('co-mono', 'co-dt', className)}
      dateTime={isoAttr(value, mode)}
      title={title ?? ageTitle}
      {...rest}
    >
      {prefix ? prefix + ' ' : null}
      {text}
      {relative ? <span className="co-cv-meta">{' ' + relative}</span> : null}
    </time>
  );
});
