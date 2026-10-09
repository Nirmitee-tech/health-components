# MedReconciliation

MedReconciliation lines up home, inpatient and discharge medicines row by row and asks for continue, modify or stop on each, and will not sign while any row has no decision.

## When to use

- Admission and discharge medication reconciliation, by the admitting or discharging prescriber.

## When not to use

- Ordering a single new medicine: InpatientOrderEntry.
- Order review at transfer: OrderReconciliation.

## Variants and states

| Variant | What it is |
|---|---|
| discharge | Columns home, inpatient, decision, discharge prescription. |
| admission | Last column becomes Admission order. |
| continue / modify / stop / new | Decision buttons; new appears on rows with no home medicine. |
| needs decision | Warning badge; Sign button counts them. |
| note | Amber line for holds or duplicates. |
| readOnly | Signed, locked. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `rows` | Array of { home, inpatient, decision, modified, stopReason, note }; a medicine is { name, dose, unit, route, freq, prn } | required |
| `stage` | 'admission' \| 'discharge' | 'discharge' |
| `patient / source` | string | none |
| `readOnly / signedBy` | boolean / string | false |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | 'inpatient' when no global context is set |
| `rowsValue / onRowsChange` | controlled rows; onRowsChange(rows) on every decision | uncontrolled from `rows` |
| `onSign` | function(rows): Sign Reconciliation | none |

## Clinical values

Every number goes through the clinical value rules: tabular digits, unit always shown, fixed precision per measure (temperature 0.1 °C, potassium 0.1 mmol/L, creatinine 0.01 mg/dL, heart rate whole bpm), the reference range in the tooltip and H, L, H! or L! flags. Doses drop trailing zeros and keep a leading zero (0.5 mg, 5 mg).

## Usage

```jsx
<MedReconciliation stage="discharge" patient="Okafor, Grace" rows={rows} />
```

## Accessibility

- Each decision group is a radiogroup named with the medicine.
- Stopped medicines say "Stopped" in words.

## Do and don't

- **Do:** Show the inpatient substitution next to the home medicine it replaced.
- **Don't:** Default every row to Continue.
