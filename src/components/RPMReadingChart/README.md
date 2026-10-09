# RPMReadingChart

RPMReadingChart shows remote-monitoring readings against an alert line, reading days toward 99454 and interactive minutes toward 99457.

**From the screens:** prog-rpm, portal-rpm (`.bars`). Built from: Card, BarChart, Alert, ProgressBar, Badge.

## When to use

- RPM enrollment review and monthly billing check.

## When not to use

- Office vitals: VitalsPanel.

## Variants and states

| Variant | What it is |
|---|---|
| days | Green at 16 or more. |
| alert | Out-of-range note. |
| minutes | Progress to 20. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `readings` | Array<[label, value]> | required |
| `metric / device / title` | string |  |
| `high / low / max` | number |  |
| `days` | number | required |
| `minutes` | number | 0 |
| `alert` | string | none |

## Usage

```jsx
<RPMReadingChart device="BP cuff, Omron" readings={week} high={140} days={18} minutes={14} />
```

## Accessibility

- Chart has full aria text.

## Do and don't

- **Do:** Show billing thresholds as progress.
- **Don't:** Bill with fewer than 16 days.
