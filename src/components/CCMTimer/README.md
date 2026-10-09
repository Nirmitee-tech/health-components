# CCMTimer

CCMTimer tracks chronic care management minutes for the month toward 99490 and 99439.

**From the screens:** prog-ccm. Built from: Card, Badge, Button, ProgressBar.

## When to use

- Care managers logging time on calls and coordination.

## When not to use

- RPM time: RPMReadingChart.

## Variants and states

| Variant | What it is |
|---|---|
| running / paused | Badge and button. |
| earned | Helper names earned codes. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `patient / month` | string | required |
| `minutes` | number | 0 |
| `clock` | string | "00:00" |
| `running` | boolean: controlled running state (pair with `onRunningChange`) | undefined |
| `defaultRunning` | boolean: initial running state | false |

## Usage

```jsx
<CCMTimer patient="Ralph Edwards" month="October 2026" minutes={23} defaultRunning clock="07:12" />
```

## Accessibility

- Clock not announced every second (aria-live off).

## Do and don't

- **Do:** Count only eligible staff time with consent.
- **Don't:** Round minutes up.
