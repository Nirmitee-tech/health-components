# AppointmentChip

AppointmentChip is one appointment on the calendar, coloured by status or by appointment type, with telehealth and paid or unpaid icons.

**From the screens:** `.ap` with `.s-Scheduled` ... `.s-Cancelled` (4px left stripe, 12px text) on sched-calendar; type palette from set-colors (Blue, Green, Teal, Purple, Red, Orange, Yellow, Pink, Gray); "Color by Status / Appointment type / Provider" setting.

## When to use

- Calendar day, week and month cells; today lists.

## When not to use

- Tables: use StatusTag in a status column.

## Variants and states

| Variant | What it is |
|---|---|
| by status | Scheduled grey, Confirmed primary, Arrived and Checked In amber, In Room AI purple, Completed and Checked Out green, No Show and Cancelled red with the name struck through. |
| by type | Stripe from `appt-<color>` on `surface-alt`. |
| telehealth | Video icon. |
| paid / due | Check-circle icon (green) or dollar icon (red) for the copay. |
| sm | One line for month cells. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `time` | string | required |
| `patient` | string | required |
| `type` | string | required |
| `status` | appointment status | none |
| `colorBy` | 'status' \| 'type' | 'status' |
| `color` | 'blue' \| 'green' \| 'teal' \| 'purple' \| 'red' \| 'orange' \| 'yellow' \| 'pink' \| 'gray' | 'blue' |
| `telehealth` | boolean | false |
| `paid` | boolean \| undefined | undefined |
| `size` | 'sm' \| 'md' | 'md' |
| `onClick` | () => void | none |

## Usage

```jsx
<AppointmentChip time="9:20" patient="Nora Scott" type="Therapy 50" status="Confirmed" telehealth paid={false} onClick={openAppt} />
```

## Accessibility

- A button whose aria-label reads time, patient, type, status, telehealth and copay.
- Type colours as stripes are below 3:1 for Blue, Teal, Orange and Yellow on light styles; the type name is always printed, so colour never carries it alone.

## Do and don't

- **Do:** Show the status word on the chip, not only the colour.
- **Don't:** Colour the whole chip in a saturated type colour.
