# GrowthChart

GrowthChart plots a child's measurements over WHO or CDC percentile curves.

**From the screens:** pat-chart-growth. Built from plain SVG with token colours.

## When to use

- Pediatrics: weight, length, head circumference, BMI-for-age.

## When not to use

- Adult trends: LineChart.

## Variants and states

| Variant | What it is |
|---|---|
| curves | Any percentile set, 50th solid. |
| points | Patient measurements. |
| note | Percentile summary. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `points` | Array<[ageMonths, value]> | required |
| `percentiles` | Record<label, number[] per age> | required |
| `ages` | number[] | [0,6,12,18,24,36] |
| `min / max` | number | 2 / 18 |
| `title / note` | string |  |

## Usage

```jsx
<GrowthChart points={[[0, 3.4], [6, 7.9]]} percentiles={WHO_GIRLS_WEIGHT} />
```

## Accessibility

- Points also listed in the aria label.

## Do and don't

- **Do:** Name the reference (WHO under 24 months, CDC after).
- **Don't:** Mix sexes or references on one chart.
