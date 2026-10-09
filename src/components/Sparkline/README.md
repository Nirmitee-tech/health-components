# Sparkline

Sparkline is a tiny trend line for a vital sign or lab value, with the last point marked.

**From the screens:** Addition for VitalSign and LabResultTable trends; the screens show trends as separate charts.

## When to use

- Inline trend next to a value.

## When not to use

- Any chart that needs axes: LineChart.

## Variants and states

| Variant | What it is |
|---|---|
| default | Primary line. |
| flagged | Pass color var(--co-danger). |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `values` | number[] | required |
| `width / height` | number | 72 / 22 |
| `color` | CSS colour | var(--co-primary) |

## Usage

```jsx
<Sparkline values={[7.9, 7.4, 7.1, 6.8]} />
```

## Accessibility

- role img with all values in the label.

## Do and don't

- **Do:** Pair with the number.
- **Don't:** Use alone.
