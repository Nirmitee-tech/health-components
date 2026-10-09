# OrderReconciliation

OrderReconciliation reviews every active order when a patient changes level of care, so orders that are not allowed on the new unit are stopped or changed before the transfer.

## When to use

- ICU to step-down or floor, floor to ICU, and to or from procedures.

## When not to use

- Home medicine decisions: MedReconciliation.

## Variants and states

| Variant | What it is |
|---|---|
| grouped | Orders grouped by type: medications, drips, nursing, labs. |
| not allowed | Red line; Continue is removed. |
| stopped | Struck through. |
| incomplete | Release button counts what is left. |
| readOnly | Locked. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `orders` | Array of { type, name, dose, unit, detail, action, notAllowedOn: level[] } | required |
| `from / to` | level of care | required |
| `patient` | string | none |
| `readOnly` | boolean | false |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | 'inpatient' when no global context is set |
| `ordersValue / onOrdersChange` | controlled orders; onOrdersChange(orders) on every action | uncontrolled from `orders` |
| `onRelease` | function(orders): Release Orders | none |

## Clinical values

Every number goes through the clinical value rules: tabular digits, unit always shown, fixed precision per measure (temperature 0.1 °C, potassium 0.1 mmol/L, creatinine 0.01 mg/dL, heart rate whole bpm), the reference range in the tooltip and H, L, H! or L! flags. Doses drop trailing zeros and keep a leading zero (0.5 mg, 5 mg).

## Usage

```jsx
<OrderReconciliation from="icu" to="medsurg" orders={activeOrders} />
```

## Accessibility

- Arrow between levels is also read as "to".

## Do and don't

- **Do:** Mark unit rules with notAllowedOn from the unit policy.
- **Don't:** Silently drop drips at transfer.
