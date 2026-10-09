# MedicationList

MedicationList is the Medications card with reconciliation status, Reconcile and Prescribe, made of MedicationRows.

**From the screens:** pat-chart-medications, enc-intake reconciliation. Built from: Card, MedicationRow, Button.

## When to use

- Chart Medications; med reconciliation.

## When not to use

- Pharmacy refill queue: InboxItem kind refill.

## Variants and states

| Variant | What it is |
|---|---|
| editable | Reconcile and Prescribe. |
| readOnly | No actions. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `items` | MedicationRow med[] | required |
| `reconciled` | string | none |
| `readOnly` | boolean | false |

## Usage

```jsx
<MedicationList items={meds} reconciled="10/09/2026" />
```

## Accessibility

- List semantics.

## Do and don't

- **Do:** Show last reconciliation date.
- **Don't:** Hide discontinued meds from history.
