import { useState, type HTMLAttributes } from "react";
import { cx } from "../../internal/cx";
import { useControllableState } from "../../internal/hooks";
import type { AppointmentChipProps } from "../AppointmentChip/AppointmentChip";
import { Button } from "../Button/Button";
import { ButtonGroup } from "../ButtonGroup/ButtonGroup";
import { CalendarCell } from "../CalendarCell/CalendarCell";
import { SegmentedControl } from "../SegmentedControl/SegmentedControl";
import { Select } from "../Select/Select";

export type CalendarView = "day" | "week" | "month";
export type CalendarColorMode = "status" | "type";
export type CalendarNavigation = "prev" | "today" | "next";

/** One appointment: AppointmentChip props plus where it sits on the calendar. */
export interface CalendarAppointment extends AppointmentChipProps {
  /** Day of the shown month (as in the design system README: pass the appointments of the shown range); used when `date` is not set */
  day?: number;
  /** Exact date "YYYY-MM-DD"; wins over `day` */
  date?: string;
  /** Day-view row it sits in ("8:40 AM"); must match one of `times` */
  slot?: string;
}

export interface CalendarProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "title"
> {
  /** 'day' | 'week' | 'month' (controlled); default uncontrolled */
  view?: CalendarView;
  /** Initial view (uncontrolled); default 'week' */
  defaultView?: CalendarView;
  /** Called when the view switch changes; default none */
  onViewChange?: (view: CalendarView) => void;
  /** Shown date "YYYY-MM-DD" (controlled); default uncontrolled */
  date?: string;
  /** Initial shown date "YYYY-MM-DD" (uncontrolled); default `today` */
  defaultDate?: string;
  /** Called with the new date on Previous, Today, Next and "+N more"; default none */
  onDateChange?: (date: string) => void;
  /** Today's date "YYYY-MM-DD" (ringed, and where Today goes); default `defaultDate`, else the device's date (read once) */
  today?: string;
  /** Array<AppointmentChip props & {day: number, slot?: string}>; default [] */
  appointments?: CalendarAppointment[];
  /** Heading text; default the shown date ("Friday, October 9, 2026") */
  title?: string;
  /** Day view rows; default 8:00 AM to 12:00 PM */
  times?: string[];
  /** Record<time, reason>: blocked rows in the day view; default {} */
  blocks?: Record<string, string>;
  /** Record<day of month, reason>: blocked days in the month view; default {} */
  monthBlocks?: Record<number, string>;
  /** Shows the Color by select; default false */
  colorBy?: boolean;
  /** Chip colouring: 'status' | 'type' (controlled); default uncontrolled */
  colorMode?: CalendarColorMode;
  /** Initial chip colouring (uncontrolled); default 'status' */
  defaultColorMode?: CalendarColorMode;
  /** Called when the Color by select changes; default none */
  onColorModeChange?: (mode: CalendarColorMode) => void;
  /** Called on Previous, Today and Next, after the date moves; default none */
  onNavigate?: (direction: CalendarNavigation, date: string) => void;
  /** Called when the free slot of a day row is chosen; default none */
  onBook?: (date: string, time: string) => void;
  /** Called when an appointment chip is chosen; default none */
  onAppointmentClick?: (appointment: CalendarAppointment) => void;
}

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DOW_LONG = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DEFAULT_TIMES = [
  "8:00 AM",
  "8:20 AM",
  "8:40 AM",
  "9:00 AM",
  "9:20 AM",
  "9:40 AM",
  "12:00 PM",
];
const STATUSES = [
  "Scheduled",
  "Confirmed",
  "Arrived",
  "In Room",
  "Completed",
  "No Show",
];

/* Dates are plain "YYYY-MM-DD" strings; arithmetic runs in UTC so it is the same on the server and in every time zone. */
interface Ymd {
  y: number;
  m: number; // 0-based
  d: number;
}
const pad = (n: number) => String(n).padStart(2, "0");
const toIso = ({ y, m, d }: Ymd) => `${y}-${pad(m + 1)}-${pad(d)}`;
function parseIso(s: string): Ymd {
  const [y, m, d] = s.split("-").map(Number);
  return { y: y || 1970, m: (m || 1) - 1, d: d || 1 };
}
function fromUtc(t: number): Ymd {
  const x = new Date(t);
  return { y: x.getUTCFullYear(), m: x.getUTCMonth(), d: x.getUTCDate() };
}
const utc = ({ y, m, d }: Ymd) => Date.UTC(y, m, d);
const addDays = (p: Ymd, n: number) => fromUtc(utc(p) + n * 86400000);
const weekday = (p: Ymd) => new Date(utc(p)).getUTCDay();
const daysInMonth = (y: number, m: number) =>
  new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
function addMonths(p: Ymd, n: number): Ymd {
  const t = new Date(Date.UTC(p.y, p.m + n, 1));
  const y = t.getUTCFullYear();
  const m = t.getUTCMonth();
  return { y, m, d: Math.min(p.d, daysInMonth(y, m)) };
}
function localToday(): string {
  const n = new Date();
  return toIso({ y: n.getFullYear(), m: n.getMonth(), d: n.getDate() });
}
const longDate = (p: Ymd) =>
  `${DOW_LONG[weekday(p)]}, ${MONTHS[p.m]} ${p.d}, ${p.y}`;

/** Calendar is the full schedule with Day, Week and Month views, built from CalendarCell and AppointmentChip. */
export function Calendar({
  view: viewProp,
  defaultView = "week",
  onViewChange,
  date: dateProp,
  defaultDate,
  onDateChange,
  today: todayProp,
  appointments = [],
  title,
  times = DEFAULT_TIMES,
  blocks = {},
  monthBlocks = {},
  colorBy = false,
  colorMode: colorModeProp,
  defaultColorMode = "status",
  onColorModeChange,
  onNavigate,
  onBook,
  onAppointmentClick,
  className,
  ...rest
}: CalendarProps) {
  // The device date is read once, in a state initializer (not on every render).
  const [deviceToday] = useState(
    () => todayProp ?? defaultDate ?? localToday(),
  );
  const today = todayProp ?? deviceToday;
  const [view, setView] = useControllableState<CalendarView>(
    viewProp,
    defaultView,
    onViewChange,
  );
  const [date, setDate] = useControllableState<string>(
    dateProp,
    defaultDate ?? today,
    onDateChange,
  );
  const [colorMode, setColorMode] = useControllableState<CalendarColorMode>(
    colorModeProp,
    defaultColorMode,
    onColorModeChange,
  );

  const cur = parseIso(date);
  const todayIso = today;

  const onDay = (a: CalendarAppointment, p: Ymd) =>
    a.date
      ? a.date === toIso(p)
      : a.day === p.d && p.m === cur.m && p.y === cur.y;
  const chips = (list: CalendarAppointment[]): AppointmentChipProps[] =>
    list.map(
      ({ day: _day, date: _date, slot: _slot, onClick, ...chip }, i) => ({
        ...chip,
        colorBy: colorMode,
        onClick: (e) => {
          onClick?.(e);
          onAppointmentClick?.(list[i]!);
        },
      }),
    );

  const navigate = (dir: CalendarNavigation) => {
    let next: string;
    if (dir === "today") next = todayIso;
    else {
      const step = dir === "next" ? 1 : -1;
      next = toIso(
        view === "month"
          ? addMonths(cur, step)
          : addDays(cur, view === "week" ? 7 * step : step),
      );
    }
    setDate(next);
    onNavigate?.(dir, next);
  };
  const openDay = (p: Ymd) => {
    setDate(toIso(p));
    setView("day");
  };

  const head = (
    <div className="co-row co-gap-8">
      <ButtonGroup attached label="Change days">
        <Button
          size="sm"
          iconLeft="chevron-left"
          aria-label="Previous"
          onClick={() => navigate("prev")}
        />
        <Button size="sm" onClick={() => navigate("today")}>
          Today
        </Button>
        <Button
          size="sm"
          iconLeft="chevron-right"
          aria-label="Next"
          onClick={() => navigate("next")}
        />
      </ButtonGroup>
      <b aria-live="polite">{title ?? longDate(cur)}</b>
      <div className="co-ml">
        <SegmentedControl
          size="sm"
          label="Calendar view"
          value={view}
          onChange={(v) => setView(v as CalendarView)}
          options={[
            { value: "day", label: "Day" },
            { value: "week", label: "Week" },
            { value: "month", label: "Month" },
          ]}
        />
      </div>
      {colorBy ? (
        <Select
          size="sm"
          label=""
          aria-label="Color by"
          value={colorMode}
          onChange={(e) => setColorMode(e.target.value as CalendarColorMode)}
          options={[
            { value: "status", label: "Color by Status" },
            { value: "type", label: "Color by Appointment type" },
          ]}
        />
      ) : null}
    </div>
  );

  let body;
  if (view === "day") {
    body = (
      <div role="grid" aria-label={`Day schedule, ${longDate(cur)}`}>
        {times.map((t) => (
          <CalendarCell
            key={t}
            view="day"
            time={t}
            blocked={blocks[t]}
            appointments={chips(
              appointments.filter((a) => a.slot === t && onDay(a, cur)),
            )}
            onBook={() => onBook?.(date, t)}
          />
        ))}
      </div>
    );
  } else if (view === "week") {
    const start = addDays(cur, -weekday(cur));
    const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
    body = (
      <div
        className="co-cal-wk"
        role="grid"
        aria-label={`Week of ${MONTHS[start.m]} ${start.d}, ${start.y}`}
      >
        <div role="row" className="co-cal-row">
          {days.map((p, i) => (
            <CalendarCell
              key={toIso(p)}
              view="week"
              date={`${DOW[i]} ${p.d}`}
              label={longDate(p)}
              today={toIso(p) === todayIso}
              appointments={chips(appointments.filter((a) => onDay(a, p)))}
              onMore={() => openDay(p)}
            />
          ))}
        </div>
      </div>
    );
  } else {
    const first: Ymd = { y: cur.y, m: cur.m, d: 1 };
    const lead = weekday(first);
    const total = Math.ceil((lead + daysInMonth(cur.y, cur.m)) / 7) * 7;
    const start = addDays(first, -lead);
    const weeks: Ymd[][] = [];
    for (let i = 0; i < total; i++) {
      if (i % 7 === 0) weeks.push([]);
      weeks[weeks.length - 1]!.push(addDays(start, i));
    }
    body = (
      <div
        className="co-cal-mo"
        role="grid"
        aria-label={`${MONTHS[cur.m]} ${cur.y}`}
      >
        <div role="row" className="co-cal-row">
          {DOW.map((w, i) => (
            <div
              key={w}
              className="co-cal-wh"
              role="columnheader"
              aria-label={DOW_LONG[i]}
            >
              {w}
            </div>
          ))}
        </div>
        {weeks.map((wk) => (
          <div role="row" className="co-cal-row" key={toIso(wk[0]!)}>
            {wk.map((p) => {
              const dim = p.m !== cur.m;
              const list = dim ? [] : appointments.filter((a) => onDay(a, p));
              return (
                <CalendarCell
                  key={toIso(p)}
                  view="month"
                  date={p.d}
                  label={longDate(p)}
                  dim={dim}
                  today={toIso(p) === todayIso}
                  appointments={chips(list)}
                  count={list.length || undefined}
                  blocked={dim ? undefined : monthBlocks[p.d]}
                  onMore={() => openDay(p)}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cx("co-cal", className)} {...rest}>
      {head}
      {body}
      <div className="co-legend">
        {STATUSES.map((s) => (
          <span key={s}>
            <i
              className={`co-dot co-ap-s-${s.replace(/\s.*/, "")}-dot`}
              aria-hidden="true"
            />
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
