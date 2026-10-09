# TimeSlotPicker

TimeSlotPicker shows open times as a grid of slots, with booked, held, available and selected states, and an optional day strip.

**From the screens:** `.slot` and `.slotg` (sched-new, sched-reschedule) and the `.day` strip on portal-book and mob-schedule.

Also exported from this card: `SlotPicker`.

## When to use

- Booking, rescheduling, patient self-booking.

## When not to use

- Free-form time entry for a past encounter: TextField with a time mask.

## Variants and states

| Variant | What it is |
|---|---|
| available | Outlined. |
| selected | `primary` fill. |
| booked | Struck through, disabled, announced as booked. |
| held | Dashed amber: held for another booking in progress. |
| day strip | Days with weekday; full days disabled. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `slots` | Array<{time, state: available\|booked\|held\|blocked}> | required |
| `days` | Array<{id, weekday, date, disabled?}> | none |
| `defaultValue` | string | none |
| `defaultDay` | string | first |
| `label` | string | "Available times" |
| `onChange` | (time) => void | none |

## Usage

```jsx
<TimeSlotPicker label="Priya Shah MD . Follow-Up 20 min" slots={slots} days={days} onChange={setTime} />
```

## Accessibility

- Slots are a radiogroup; each label includes its state.
- Booked differs by fill, strike and disabled state, not colour alone.

## Do and don't

- **Do:** Show the provider and length above the grid.
- **Don't:** Hide booked slots entirely: people want to see the day is busy.
