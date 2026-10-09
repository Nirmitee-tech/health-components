# ProviderDayColumns

ProviderDayColumns is the multi-provider day view: one column per provider, time rows, chips, blocks and free slots.

**From the screens:** sched-calendar provider filter "All" in day view, sched-availability. Built from: Avatar, AppointmentChip, blocked and free cells.

## When to use

- Front desk view of everyone's day.

## When not to use

- One provider's week: Calendar.

## Variants and states

| Variant | What it is |
|---|---|
| appointments | Chips by time. |
| blocks | Lunch, admin, hospital rounds. |
| free | Hover to book. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `times` | string[] | required |
| `providers` | Array<{name, appts: Record<time, AppointmentChip props>, blocks?: Record<time, reason>}> | required |

## Usage

```jsx
<ProviderDayColumns times={TIMES} providers={providersWithAppts} />
```

## Accessibility

- Grid; free cells are links "+ Book 9:40 AM".

## Do and don't

- **Do:** Keep column order stable.
- **Don't:** More than 8 columns without scrolling.
