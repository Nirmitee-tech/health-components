import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
} from 'react';
import { cx } from '../../internal/cx';
import { useControllableState, useDismiss, useDomId } from '../../internal/hooks';
import { Button } from '../Button/Button';
import { DEFAULT_LOCK_MESSAGE, Field, fieldDescribedBy } from '../Field/Field';
import { Icon } from '../Icon/Icon';
import { IconButton } from '../IconButton/IconButton';
import { formatMask } from '../TextField/TextField';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS: Array<[string, string]> = [
  ['Su', 'Sunday'],
  ['Mo', 'Monday'],
  ['Tu', 'Tuesday'],
  ['We', 'Wednesday'],
  ['Th', 'Thursday'],
  ['Fr', 'Friday'],
  ['Sa', 'Saturday'],
];

const pad = (n: number) => (n < 10 ? '0' : '') + n;

/** Parses MM/DD/YYYY into a local Date; null when the text is not a real calendar date. */
export function parseUSDate(s: string | null | undefined): Date | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s ?? '');
  if (!m) return null;
  const d = new Date(+m[3]!, +m[1]! - 1, +m[2]!);
  return d.getMonth() === +m[1]! - 1 && d.getDate() === +m[2]! ? d : null;
}

/** Formats a Date as MM/DD/YYYY. */
export function formatUSDate(d: Date): string {
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}`;
}

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const firstOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const sameDay = (a: Date | null, b: Date | null) => !!a && !!b && a.getTime() === b.getTime();
const sameMonth = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
function addMonths(d: Date, n: number): Date {
  const last = new Date(d.getFullYear(), d.getMonth() + n + 1, 0).getDate();
  return new Date(d.getFullYear(), d.getMonth() + n, Math.min(d.getDate(), last));
}

export interface DatePickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'style' | 'size'> {
  /** Visible label; required */
  label: string;
  /** Controlled value, MM/DD/YYYY; default undefined (uncontrolled) */
  value?: string;
  /** Initial value (uncontrolled), MM/DD/YYYY; default "" */
  defaultValue?: string;
  /** Called with the MM/DD/YYYY text on typing and on picking a day; default none */
  onChange?: (value: string) => void;
  /** Today's date, MM/DD/YYYY (marks the grid, limits past/future); default the current date */
  today?: string;
  /** Controlled open state of the calendar; default undefined (uncontrolled) */
  open?: boolean;
  /** Calendar open on first render (uncontrolled); default false */
  defaultOpen?: boolean;
  /** Called when the calendar opens or closes */
  onOpenChange?: (open: boolean) => void;
  /** Days before today cannot be picked; default false */
  disablePast?: boolean;
  /** Days after today cannot be picked (date of birth); default false */
  disableFuture?: boolean;
  /** Saturdays and Sundays cannot be picked; default false */
  disableWeekends?: boolean;
  /** Error message (as TextField); an impossible typed date shows "Enter a real date as MM/DD/YYYY."; default none */
  error?: string;
  /** Muted hint under the field; default 'MM/DD/YYYY' */
  helper?: string;
  /** Red asterisk plus aria-required; default false */
  required?: boolean;
  /** Read-only lock state; the calendar button is disabled; default false */
  readOnly?: boolean;
  /** Lock line text when readOnly; default 'Your role can view but not edit' */
  lockMessage?: string;
  /** Inline style of the root */
  style?: CSSProperties;
}

/**
 * DatePicker takes a date as MM/DD/YYYY by typing (masked) or from a month grid popover.
 * Grid keys: arrows move by day and week, Home/End to week start/end, PageUp/PageDown by month
 * (with Shift by year), Enter picks, Escape closes.
 */
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(function DatePicker(
  {
    label,
    value: valueProp,
    defaultValue = '',
    onChange,
    today: todayProp,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    disablePast = false,
    disableFuture = false,
    disableWeekends = false,
    error: errorProp,
    helper = 'MM/DD/YYYY',
    required = false,
    readOnly = false,
    lockMessage = DEFAULT_LOCK_MESSAGE,
    disabled,
    className,
    style,
    id: idProp,
    'aria-describedby': describedByProp,
    ...rest
  },
  ref
) {
  const id = useDomId('dp', idProp);
  const [value, setValue] = useControllableState(valueProp, defaultValue);
  const [open, setOpen] = useControllableState(openProp, defaultOpen, onOpenChange);
  const today = startOfDay(parseUSDate(todayProp) ?? new Date());
  const sel = parseUSDate(value);
  const [month, setMonth] = useState(() => firstOfMonth(sel ?? today));
  const [focusDate, setFocusDate] = useState<Date>(() => sel ?? today);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const wantFocus = useRef(false);

  useDismiss(wrapRef, open, () => setOpen(false));

  // Follow the typed or controlled value to its month.
  const selTime = sel?.getTime();
  useEffect(() => {
    if (selTime !== undefined) {
      const d = new Date(selTime);
      setMonth(firstOfMonth(d));
      setFocusDate(d);
    }
  }, [selTime]);

  const error = errorProp || (value && value.length === 10 && !sel ? 'Enter a real date as MM/DD/YYYY.' : undefined);
  const lock = readOnly ? lockMessage : undefined;

  const isDisabled = (d: Date) =>
    (disablePast && d < today) || (disableFuture && d > today) || (disableWeekends && (d.getDay() === 0 || d.getDay() === 6));

  const tabDate = sameMonth(focusDate, month)
    ? focusDate
    : sel && sameMonth(sel, month)
      ? sel
      : sameMonth(today, month)
        ? today
        : month;

  useEffect(() => {
    if (!open || !wantFocus.current) return;
    wantFocus.current = false;
    gridRef.current?.querySelector<HTMLElement>('[tabindex="0"]')?.focus();
  }, [open, focusDate, month]);

  const commit = (next: string) => {
    setValue(next);
    onChange?.(next);
  };

  const pick = (d: Date) => {
    if (isDisabled(d)) return;
    commit(formatUSDate(d));
    setOpen(false);
    buttonRef.current?.focus();
  };

  const moveFocus = (d: Date) => {
    wantFocus.current = true;
    setFocusDate(d);
    if (!sameMonth(d, month)) setMonth(firstOfMonth(d));
  };

  const onGridKeyDown = (e: KeyboardEvent<HTMLDivElement>, d: Date) => {
    let next: Date | null = null;
    if (e.key === 'ArrowLeft') next = addDays(d, -1);
    else if (e.key === 'ArrowRight') next = addDays(d, 1);
    else if (e.key === 'ArrowUp') next = addDays(d, -7);
    else if (e.key === 'ArrowDown') next = addDays(d, 7);
    else if (e.key === 'Home') next = addDays(d, -d.getDay());
    else if (e.key === 'End') next = addDays(d, 6 - d.getDay());
    else if (e.key === 'PageUp') next = addMonths(d, e.shiftKey ? -12 : -1);
    else if (e.key === 'PageDown') next = addMonths(d, e.shiftKey ? 12 : 1);
    if (next) {
      e.preventDefault();
      moveFocus(next);
    }
  };

  const toggle = () => {
    if (!open) {
      const start = sel ?? today;
      setFocusDate(start);
      setMonth(firstOfMonth(start));
      wantFocus.current = true;
    }
    setOpen(!open);
  };

  // Rows of seven: leading blanks, then the days of the month.
  const cells: Array<Date | null> = [];
  for (let i = 0; i < month.getDay(); i++) cells.push(null);
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  for (let d = 1; d <= days; d++) cells.push(new Date(month.getFullYear(), month.getMonth(), d));
  const rows: Array<Array<Date | null>> = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  const monthLabelId = `${id}-month`;
  const todayDisabled = isDisabled(today);

  return (
    <Field id={id} label={label} required={required} error={error} helper={helper} lock={lock} className={className} style={style}>
      <div
        className="co-mwrap co-dp"
        ref={wrapRef}
        onBlur={(e: FocusEvent<HTMLDivElement>) => {
          if (open && e.relatedTarget && !e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
        }}
      >
        <div className="co-inpwrap">
          <input
            ref={ref}
            id={id}
            className={cx('co-inp', error && 'is-bad', readOnly && 'is-ro')}
            value={value}
            placeholder="MM/DD/YYYY"
            inputMode="numeric"
            autoComplete="off"
            readOnly={readOnly}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-required={required || undefined}
            aria-describedby={fieldDescribedBy(id, { error, helper, lock }, describedByProp)}
            onChange={(e) => commit(formatMask(e.target.value, 'date'))}
            {...rest}
          />
          <button
            ref={buttonRef}
            type="button"
            className="co-dp-btn"
            aria-label="Open calendar"
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls={open ? `${id}-pop` : undefined}
            disabled={readOnly || disabled}
            onClick={toggle}
          >
            <Icon name={readOnly ? 'lock' : 'calendar'} size={16} />
          </button>
        </div>
        {open && !readOnly && !disabled ? (
          <div
            id={`${id}-pop`}
            className="co-pop co-dp-pop co-menu-left"
            role="dialog"
            aria-label="Choose date"
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.stopPropagation();
                setOpen(false);
                buttonRef.current?.focus();
              }
            }}
          >
            <div className="co-dp-head">
              <IconButton
                icon="chevron-left"
                label="Previous month"
                size="sm"
                onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
              />
              <b id={monthLabelId} aria-live="polite">
                {`${MONTHS[month.getMonth()]} ${month.getFullYear()}`}
              </b>
              <IconButton
                icon="chevron-right"
                label="Next month"
                size="sm"
                onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
              />
            </div>
            <div className="co-dp-grid" role="grid" aria-labelledby={monthLabelId} ref={gridRef}>
              <div role="row" className="co-dp-row">
                {WEEKDAYS.map(([short, full]) => (
                  <span key={short} className="co-dp-wh" role="columnheader" aria-label={full}>
                    {short}
                  </span>
                ))}
              </div>
              {rows.map((row, r) => (
                <div role="row" className="co-dp-row" key={r}>
                  {row.map((c, i) => {
                    if (!c) return <span key={`e${i}`} role="gridcell" />;
                    const isSel = sameDay(c, sel);
                    const isToday = sameDay(c, today);
                    const dis = isDisabled(c);
                    return (
                      <button
                        key={c.getDate()}
                        type="button"
                        role="gridcell"
                        className={cx('co-dp-d', isSel && 'is-on', isToday && 'is-today')}
                        aria-selected={isSel}
                        aria-current={isToday ? 'date' : undefined}
                        aria-disabled={dis || undefined}
                        aria-label={`${WEEKDAYS[c.getDay()]![1]}, ${MONTHS[c.getMonth()]} ${c.getDate()}, ${c.getFullYear()}`}
                        tabIndex={sameDay(c, tabDate) ? 0 : -1}
                        onClick={() => pick(c)}
                        onFocus={() => setFocusDate(c)}
                        onKeyDown={(e) => onGridKeyDown(e, c)}
                      >
                        {c.getDate()}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="co-dp-foot">
              <Button variant="link" disabled={todayDisabled} onClick={() => pick(today)}>
                Today
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </Field>
  );
});
