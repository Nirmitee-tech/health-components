# InsuranceCoverageCard

InsuranceCoverageCard lists a patient's active coverages in billing order (COB), with reorder arrows, eligibility status and a suggested-order warning.

**From the screens:** pat-chart-insurance ("Active coverage, in billing order", arrows to reorder, CARC 22 warning, Self-pay switch) and ins-coverage-edit. Built from: Card, Alert, StatusTag, DescriptionList, IconButton, KebabMenu, Button.

Also exported from this card: `CoverageStack`.

## When to use

- Insurance section of the chart; check-in coverage review.

## When not to use

- Editing one coverage's fields: a form in a Drawer.

## Variants and states

| Variant | What it is |
|---|---|
| ordered | Primary card highlighted. |
| suggested order | Warning with Apply Suggested Order and Keep Current Order. |
| self-pay | Warning, claims stop. |
| readOnly | No arrows or Add. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `coverages` | Array<{payer, plan, memberId, group?, subscriber?, status?, checked?}> | required |
| `suggested` | string: suggested order text | none |
| `selfPay` | boolean | false |
| `readOnly` | boolean | false |
| `onReorder` | (coverages) => void | none |

## Usage

```jsx
<InsuranceCoverageCard coverages={patient.coverages} suggested="Medicare first, then AARP Supplement" onReorder={saveOrder} />
```

## Accessibility

- Arrow buttons are named "Move Aetna up"; order is also written (Primary, Secondary).

## Do and don't

- **Do:** Explain the CARC 22 risk.
- **Don't:** Drag-only reordering.
