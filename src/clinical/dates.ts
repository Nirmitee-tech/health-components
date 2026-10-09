/*
 * Dates, times, ages and gestational age (US conventions).
 * Ported from CareOS.fmt (ext: clinical-values). Pure, SSR safe (Intl only when a timeZone is passed).
 */
import { isFiniteNumber } from './units';

/** A date as a Date, an ISO string ('2026-10-09' is a local calendar date) or epoch milliseconds. */
export type DateInput = Date | string | number;

/** Options for date: the IANA zone to show the date in (default the runtime's zone). */
export interface DateOptions {
  /** IANA time zone ('America/Chicago'). */
  timeZone?: string;
}

/** Options for time and dateTime. */
export interface TimeOptions extends DateOptions {
  /** 24-hour time (14:05) instead of 12-hour (02:05 PM); default false. */
  hour24?: boolean;
  /** Append the zone abbreviation when timeZone is set; default true. */
  showZone?: boolean;
}

function pad(n: number): string {
  return (n < 10 ? '0' : '') + n;
}

/** Parses a DateInput. A bare 'YYYY-MM-DD' is a local calendar date (not UTC midnight). */
export function toDate(v: DateInput | null | undefined): Date {
  if (v instanceof Date) return v;
  if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)) {
    const p = v.split('-');
    return new Date(+p[0]!, +p[1]! - 1, +p[2]!);
  }
  return new Date(v as string | number);
}

function isValid(d: Date): boolean {
  return !isNaN(d.getTime());
}

interface Parts {
  y: number;
  m: number;
  d: number;
  H: number;
  M: number;
  tz: string;
}

function parts(d: Date, tz?: string): Parts {
  if (!tz) return { y: d.getFullYear(), m: d.getMonth() + 1, d: d.getDate(), H: d.getHours(), M: d.getMinutes(), tz: '' };
  const o: Record<string, string> = {};
  new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
    timeZoneName: 'short',
  })
    .formatToParts(d)
    .forEach((p) => {
      o[p.type] = p.value;
    });
  return { y: +o.year!, m: +o.month!, d: +o.day!, H: +o.hour! % 24, M: +o.minute!, tz: o.timeZoneName ?? '' };
}

/** MM/DD/YYYY. Invalid input gives ''. */
export function date(v: DateInput | null | undefined, o?: DateOptions): string {
  const d = toDate(v);
  if (!isValid(d)) return '';
  const p = parts(d, o && o.timeZone);
  return pad(p.m) + '/' + pad(p.d) + '/' + p.y;
}

/** 02:05 PM (default) or 14:05 with hour24; adds the zone abbreviation ('CDT') when timeZone is set. Invalid gives ''. */
export function time(v: DateInput | null | undefined, o: TimeOptions = {}): string {
  const d = toDate(v);
  if (!isValid(d)) return '';
  const p = parts(d, o.timeZone);
  const t = o.hour24
    ? pad(p.H) + ':' + pad(p.M)
    : pad(p.H % 12 === 0 ? 12 : p.H % 12) + ':' + pad(p.M) + ' ' + (p.H < 12 ? 'AM' : 'PM');
  return t + (o.timeZone && o.showZone !== false ? ' ' + p.tz : '');
}

/** Date and time: '10/09/2026 02:05 PM CDT'. Invalid gives ''. */
export function dateTime(v: DateInput | null | undefined, o?: TimeOptions): string {
  const d = date(v, o);
  return d ? d + ' ' + time(v, o) : '';
}

/** Whole days, weeks, months and years between a date of birth and `asOf` (default now). */
export interface AgeParts {
  days: number;
  weeks: number;
  months: number;
  years: number;
}

/** Age in whole days, weeks, months and years on calendar dates. NaN fields for invalid input. */
export function ageParts(dob: DateInput, asOf?: DateInput | null): AgeParts {
  const b = toDate(dob);
  const n = asOf ? toDate(asOf) : new Date();
  const days = Math.floor(
    (Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) - Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())) / 864e5
  );
  const months =
    (n.getFullYear() - b.getFullYear()) * 12 + n.getMonth() - b.getMonth() - (n.getDate() < b.getDate() ? 1 : 0);
  return { days, weeks: Math.floor(days / 7), months, years: Math.floor(months / 12) };
}

/**
 * Age: under 14 days in days ('8 d'), under 8 weeks in weeks ('6 wk'), under 24 months in months ('9 mo'),
 * then years ('47 y'). A future or invalid date of birth gives ''.
 */
export function age(dob: DateInput | null | undefined, asOf?: DateInput | null): string {
  if (dob == null) return '';
  const a = ageParts(dob, asOf);
  if (!isFiniteNumber(a.days) || a.days < 0) return '';
  if (a.days < 14) return a.days + ' d';
  if (a.days < 56) return a.weeks + ' wk';
  if (a.months < 24) return a.months + ' mo';
  return a.years + ' y';
}

/** Age in words: '1 day', '6 weeks', '9 months', '47 years'. */
export function ageLong(dob: DateInput | null | undefined, asOf?: DateInput | null): string {
  const s = age(dob, asOf);
  const m = /^(\d+) (d|wk|mo|y)$/.exec(s);
  if (!m) return s;
  const n = +m[1]!;
  const word = { d: 'day', wk: 'week', mo: 'month', y: 'year' }[m[2] as 'd' | 'wk' | 'mo' | 'y'];
  return n + ' ' + word + (n === 1 ? '' : 's');
}

/** Gestational age input: weeks and days, or an EDD (GA = 280 days minus days to EDD) with optional asOf. */
export interface GestationalInput {
  weeks?: number | null;
  days?: number | null;
  /** Estimated due date. When set it wins over weeks/days. */
  edd?: DateInput | null;
  /** Date the GA is computed at; default now. */
  asOf?: DateInput | null;
}

/** Gestational age as '38w 4d'. No usable input gives ''. */
export function gestational(o: GestationalInput): string {
  let w = o.weeks;
  let d = o.days || 0;
  if (o.edd) {
    const g = 280 - Math.round((toDate(o.edd).getTime() - toDate(o.asOf || new Date()).getTime()) / 864e5);
    if (!isFiniteNumber(g)) return '';
    w = Math.floor(g / 7);
    d = g - w * 7;
  }
  return isFiniteNumber(w) ? w + 'w ' + d + 'd' : '';
}
