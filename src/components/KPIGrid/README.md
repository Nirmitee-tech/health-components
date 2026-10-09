# KPIGrid

KPIGrid lays out StatCards in a responsive grid and can make them a single-select filter for the table below.

**From the screens:** `.kpi` rows on 71 screens; clickable KPI filters on bill-claims, ins-pa-queue, clin-inbox. Built from: StatCard.

## When to use

- Top of dashboards and queues.

## When not to use

- More than 6 numbers: a report.

## Variants and states

| Variant | What it is |
|---|---|
| static | Plain numbers. |
| filter | Selecting one filters the list; selecting again clears it. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `items` | StatCard props[] | required |
| `filter` | boolean | false |
| `selected` | string: label | none |
| `onSelect` | (label \| null) => void | none |
| `label` | string | none |

## Usage

```jsx
<KPIGrid filter selected={kpi} onSelect={setKpi} items={[{ label: "Needs Review", value: 14 }, { label: "Pended", value: 6 }]} />
```

## Accessibility

- As StatCard: buttons with aria-pressed when filter is on.

## Do and don't

- **Do:** Label + count + what it counts.
- **Don't:** Mix filter and non-filter cards in one grid.
