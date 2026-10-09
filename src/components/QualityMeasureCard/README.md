# QualityMeasureCard

QualityMeasureCard shows one quality measure: rate, target (including inverse measures), numerator and denominator, and the gap list link.

**From the screens:** qual-measures, rep-analytics. Built from: Card, Badge, ProgressBar, Button.

## When to use

- MIPS and payer quality dashboards.

## When not to use

- Single patient: CareGapRow.

## Variants and states

| Variant | What it is |
|---|---|
| meets / below | Green or amber with icon. |
| inverse | Lower is better (CMS122). |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `measure` | {name, id, period, numerator, denominator, exclusions?, target, inverse?, source?} | required |

## Usage

```jsx
<QualityMeasureCard measure={{ name: "Controlling High Blood Pressure", id: "CMS165", numerator: 412, denominator: 560, target: 70 }} />
```

## Accessibility

- Rate and counts in text.

## Do and don't

- **Do:** Name the data source and period.
- **Don't:** Show a rate without counts.
