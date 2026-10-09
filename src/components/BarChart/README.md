# BarChart

BarChart shows values per category or day with optional threshold line and out-of-range colours, for dashboards and remote monitoring.

**From the screens:** `.bars` `.barv` (22px max bars, `.hi` red, `.lo` amber, `.ok` green) on portal-results and portal-rpm.

## When to use

- Counts per day or per payer; readings against a target.

## When not to use

- More than about 14 bars: a table or line chart.

## Variants and states

| Variant | What it is |
|---|---|
| default | `primary` bars. |
| tones | hi (danger), lo (warning), ok (success), ai, accent. |
| threshold | Dashed goal line with label. |
| legend | Explains the tones. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `data` | Array<{label, value, tone?}> | required |
| `title` | string | none |
| `height` | number | 150 |
| `max` | number | auto |
| `threshold` | number | none |
| `thresholdLabel` | string | "Goal N" |
| `unit` | string: for the aria text | "" |
| `legend` | Array<{label, tone}> | none |

## Usage

```jsx
<BarChart title="Systolic BP (mmHg)" data={readings.map(r => ({ label: r.day, value: r.sys, tone: r.sys >= 140 ? "hi" : "ok" }))} threshold={140} />
```

## Accessibility

- role img with every label and value in the aria-label; values are printed above bars.
- Out-of-range bars also cross the threshold line, so colour is not the only cue.

## Do and don't

- **Do:** Systolic BP per day with the 140 line.
- **Don't:** 3D or gradient bars.
