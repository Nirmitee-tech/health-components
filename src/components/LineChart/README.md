# LineChart

LineChart shows a trend over time for up to two series, with an optional target band.

**From the screens:** Addition asked for in the brief: no screen draws a line chart (dashboards use KPI tiles and bars). Plain SVG with token colours.

## When to use

- A1c over a year, weekly visit volume, days in A/R.

## When not to use

- Categories without order: BarChart.

## Variants and states

| Variant | What it is |
|---|---|
| one series | `primary`. |
| two series | Second is `accent` and dashed, so they differ by more than hue. |
| band | Target range shaded in `success-soft`. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `labels` | string[] | required |
| `series` | Array<{name, values: number[], color?}> | required |
| `title` | string | none |
| `height` | number | 180 |
| `min / max` | number | 0 / auto |
| `band` | [low, high] | none |

## Usage

```jsx
<LineChart title="A1c (%)" labels={dates} series={[{ name: "A1c", values: a1c }]} band={[4, 7]} min={4} max={10} />
```

## Accessibility

- role img with every value in the label; points are drawn as circles too.

## Do and don't

- **Do:** A1c with the 4.0 to 7.0 target band.
- **Don't:** More than two series.
