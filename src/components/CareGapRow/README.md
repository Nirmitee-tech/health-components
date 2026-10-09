# CareGapRow

CareGapRow is one open, closed or excluded care gap with the action that closes it.

**From the screens:** qual-gaps, qual-recalls, "Care gaps (3 open)" on the chart. Built from: Icon, Badge, SplitButton.

## When to use

- Chart care gaps, recall lists.

## When not to use

- Measure totals: QualityMeasureCard.

## Variants and states

| Variant | What it is |
|---|---|
| open | Action button. |
| closed | Green. |
| excluded | Neutral with reason. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `gap` | {measure, patient?, detail?, due?, status: open\|closed\|excluded, action?} | required |

## Usage

```jsx
<CareGapRow gap={{ measure: "Colorectal cancer screening", detail: "Last FIT 2023", status: "open", action: "Order FIT" }} />
```

## Accessibility

- Status in words.

## Do and don't

- **Do:** Allow recording outside results.
- **Don't:** Close a gap without evidence.
