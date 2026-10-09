# DonutChart

DonutChart shows how a total splits into up to five parts, with the total in the middle and a value legend.

**From the screens:** Addition asked for in the brief: no screen draws a donut. Plain SVG with token colours.

## When to use

- Share of a whole: claims by status, payer mix.

## When not to use

- Comparing sizes precisely or more than five parts: BarChart.

## Variants and states

| Variant | What it is |
|---|---|
| default | Total in the centre, legend with value and percent. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `data` | Array<{label, value, color?}> | required |
| `title` | string | none |
| `centerValue` | string \| number | total |
| `centerLabel` | string | "Total" |
| `size` | number | 140 |

## Usage

```jsx
<DonutChart title="Claims by status" data={[{ label: "Paid", value: 412, color: "var(--co-success)" }]} centerLabel="claims" />
```

## Accessibility

- role img with all parts in the label; the legend prints every value and percent.

## Do and don't

- **Do:** Claims by status with the words in the legend.
- **Don't:** Use the danger red for a neutral slice.
