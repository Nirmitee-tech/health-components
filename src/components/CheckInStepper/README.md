# CheckInStepper

CheckInStepper is the front desk check-in checklist: steps, issues per step and Complete Check-In.

**From the screens:** sched-checkin and fd-eod. Built from: Card, StatusTag, Stepper, Button.

## When to use

- Front desk check-in.

## When not to use

- Patient self check-in: KioskStep.

## Variants and states

| Variant | What it is |
|---|---|
| issues | Steps with errors block completion. |
| done | Checked In tag. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `patient / appt` | string | required |
| `steps` | string[] | six steps |
| `current` | number | 0 |
| `issues` | number[]: step indexes | [] |
| `items` | Array<{label, detail, ok, action?}> | [] |
| `done` | boolean | false |

## Usage

```jsx
<CheckInStepper patient="Henna West" appt="9:20 AM with Dr. Bell" current={2} issues={[2]} items={checks} />
```

## Accessibility

- Each item has icon label Done or Needs attention.

## Do and don't

- **Do:** Say exactly what is missing.
- **Don't:** Check in with an inactive coverage silently.
