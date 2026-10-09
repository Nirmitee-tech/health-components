# CalendarCell

CalendarCell renders one cell of the month, week or day calendar with its appointments, blocked time and free slots.

**From the screens:** `.mo .md` month cells (min 118px, today ring, dim days), `.wk .dc` week columns, `.cal td` 38px day rows with `.tm` time column, `.blk` striped blocked time and `.free` hover-to-book.

## When to use

- Building the schedule views.

## When not to use

- A small date picker: DatePicker.

## Variants and states

| Variant | What it is |
|---|---|
| month | Date, count, up to 3 small chips, "+N more". |
| week | Column with up to 6 chips. |
| day | Time row with chips, blocked time or a free slot. |
| today | 2px `primary` ring and filled date. |
| dim | Days outside the month. |
| blocked | Striped block with reason (Lunch, Admin time). |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `view` | 'month' \| 'week' \| 'day' | 'month' |
| `date` | string \| number | required for month and week |
| `time` | string | required for day |
| `appointments` | AppointmentChip props[] | [] |
| `count` | number | none |
| `today` | boolean | false |
| `dim` | boolean | false |
| `blocked` | string: reason | none |
| `label` | string: aria-label | none |

## Usage

```jsx
<CalendarCell view="month" date={9} today count={14} appointments={dayAppts} />
<CalendarCell view="day" time="12:00 PM" blocked="Lunch" />
```

## Accessibility

- gridcell role; the free slot link says "+ Book 10:20 AM" on focus.

## Do and don't

- **Do:** Put the reason on blocked time.
- **Don't:** Squeeze more than 3 chips into a month cell.
