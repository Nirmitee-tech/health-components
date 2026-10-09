# StructuredDataGrid

StructuredDataGrid is a spreadsheet-like flowsheet for entering many numbers at once, with checks that block impossible values and warn on out-of-range ones.

## When to use

- Nursing flowsheets, intake and output, dialysis runs, infusion vitals, ICU hourly charting.

## When not to use

- One set of vitals: VitalsPanel. Free text: SOAPSection.

## Variants and states

| Variant | What it is |
|---|---|
| valid | Green All valid tag. |
| out of range | Amber cell with the flag and reference range. Saving is allowed. |
| not possible | Red cell: not a number or outside the hard limits. Saving is blocked. |
| required empty | Red after the first save attempt. |
| readOnly | Formatted values with units, no inputs. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `columns` | Array<{key, label, code?, over?, type?: "number" \| "text" \| "select", options?, min?, max?, required?, readOnly?}> | required |
| `rows` | Array<object> | [] |
| `title / subtitle` | string | none |
| `readOnly` | boolean | false |
| `onSave` | (rows) => void | none |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | the global context, else 'outpatient' |

## Clinical values

Every number renders through CareOS.ClinicalValue and CareOS.fmt (the clinical-values builder), matched by LOINC; measures that table lacks (NT-proBNP, lactate, vancomycin trough, CrCl, PHQ-9, per-kg doses) use a local table with the same rules: tabular figures, the unit always shown, fixed decimals per measure (potassium 1, sodium 0, creatinine 2), the reference range in the title or beside it, and H, L, HH or LL flags in words for screen readers. The flag says where the number sits against the adult reference range in the rules table; it does not say the number was measured correctly.

## Usage

```jsx
<StructuredDataGrid title="ICU hourly vitals" columns={cols} rows={rows} onSave={save} />
```

## Accessibility

- role grid with a label per cell (column, row and unit).
- Errors use role alert; aria-invalid on the input.
- Enter and Down move down a column.

## Do and don't

- **Do:** Set hard limits per column (SpO2 0 to 100).
- **Don't:** Treat an in-range value as checked: the checks catch typing errors, not wrong measurements.
