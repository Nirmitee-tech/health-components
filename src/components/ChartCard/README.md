# ChartCard

ChartCard wraps any chart in a Card with a title, period switch, loading and empty states, and a source line.

**From the screens:** Dashboard cards on dash-home, bill-dashboard, rep-analytics. Built from: Card, SegmentedControl, Skeleton, EmptyState, any chart.

## When to use

- Every chart on a dashboard.

## When not to use

- A single number: StatCard.

## Variants and states

| Variant | What it is |
|---|---|
| periods | 7d, 30d, 90d switch. |
| loading | Skeleton card. |
| empty | Empty state with text. |
| source | Muted line naming the data source and time. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `title` | string | required |
| `subtitle` | string | none |
| `periods` | string[] | none |
| `period` | string | first |
| `onPeriod` | (p) => void | none |
| `loading` | boolean | false |
| `empty` | string: empty message | none |
| `source` | string | none |
| `actions` | node | none |
| `children` | chart | required |

## Usage

```jsx
<ChartCard title="Denials by payer" periods={["7d", "30d", "90d"]} source="Source: ERA 835 files, posted 10/09/2026">
  <BarChart data={denials} />
</ChartCard>
```

## Accessibility

- Chart inside carries its own aria text.

## Do and don't

- **Do:** Every number traces to a saved report: put it in source.
- **Don't:** A chart with no period.
