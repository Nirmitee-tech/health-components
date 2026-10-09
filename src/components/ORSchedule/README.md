# ORSchedule

ORSchedule lays out the day's surgical cases per operating room on a timeline, with case status, delays, the current time and room utilization; SurgeryBoard shows the same cases as a status board table.

**From the screens:** New for the perioperative module. Built from: Card, Badge, EmptyState.

**Values:** Every number goes through the shared value rules (`CareOS.acuteFmt.format`): tabular figures, unit always shown, fixed decimals per measure, reference range in the hover title, and H, L or critical tags. Colour is never the only signal: flags carry words and an icon.

## When to use

- OR desk and anesthesia coordinator planning.
- Surgery status board for staff (board variant) and families (publicView).

## When not to use

- Clinic appointments: Calendar.

## Variants and states

| Variant | What it is |
|---|---|
| timeline | Rooms as rows, cases as blocks positioned by start and duration; red Now line. |
| board | SurgeryBoard: table by room and start. |
| statuses | Scheduled, Pre-op, In Room, Anesthesia Ready, Incision, Closing, PACU, Complete, Delayed, Cancelled, Add-on. |
| delayed | Block shifts by the delay, red border, reason shown on the board. |
| cancelled | Struck through. |
| utilization | Per room, flagged below 70%. |
| publicView | Board hides names for family display. |
| empty | No cases booked. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `rooms` | Array<{id, name, service?}> | required |
| `cases` | Array<{room, start: 'HH:MM', duration, patient, publicId?, age?, procedure, laterality?, surgeon, anesthesia?, status, delay?, delayReason?}> | required |
| `variant` | 'timeline' \| 'board' | 'timeline' |
| `dayStart / dayEnd` | 'HH:MM' | '07:00' / '19:00' |
| `now` | 'HH:MM' | none |
| `publicView` | boolean | false |
| `date` | string: named in the empty state | 'this day' |
| `title` / `subtitle` | string | 'OR Schedule' (timeline), 'Surgery Status Board' (board) / none |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | 'ed' when no global context is set |

## Usage

```jsx
<ORSchedule rooms={rooms} cases={cases} now="10:40" />
<SurgeryBoard rooms={rooms} cases={cases} publicView />
```

## Accessibility

- Timeline is a grid; each case block is focusable with a full spoken label (time, procedure, surgeon, status).
- Status is text inside the block and a tag on the board.
- Times use 24-hour HH:MM in tabular figures.

## Do and don't

- **Do:** Show laterality on the board.
- **Do:** Show delay reasons.
- **Don't:** Show patient names on a family-facing display.
