# Calendar

Calendar is the full schedule with Day, Week and Month views, built from CalendarCell and AppointmentChip.

**From the screens:** sched-calendar: filters row, view switch, `.cal` day grid, `.wk` week, `.mo` month, status legend, Color by setting from set-colors. Built from: ButtonGroup, SegmentedControl, Select, CalendarCell, AppointmentChip.

Also exported from this card: `ScheduleCalendar`.

## When to use

- The schedule screen and provider day views.

## When not to use

- Picking one free time: TimeSlotPicker.

## Variants and states

| Variant | What it is |
|---|---|
| day | Time rows with chips, blocked time, free slots. |
| week | 7 columns, today ringed. |
| month | 5 by 7 grid with counts and "+N more". |
| colorBy | Adds the Color by select. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `view` | 'day' \| 'week' \| 'month' | 'week' |
| `appointments` | Array<AppointmentChip props & {day: number, slot?: string}> | [] |
| `title` | string | today |
| `times` | string[]: day rows | 8:00 AM to 12:00 PM |
| `blocks` | Record<time, reason>: day view | {} |
| `monthBlocks` | Record<day, reason> | {} |
| `colorBy` | boolean: show the Color by select | false |

## Usage

```jsx
<Calendar view="week" colorBy appointments={appts.map(a => ({ ...a, day: a.date.getDate(), slot: a.timeLabel }))} />
```

## Accessibility

- Each view is a grid; every chip reads time, patient, type and status.

## Do and don't

- **Do:** Keep filters (provider, location, status) above the calendar.
- **Don't:** Colour-only status.
