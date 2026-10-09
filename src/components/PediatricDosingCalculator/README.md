# PediatricDosingCalculator

PediatricDosingCalculator works out a weight-based dose in mg/kg, caps it at the maximum single and daily dose, converts it to mL, and shows the working so a second person can check it.

## When to use

- Pediatric prescribing, ED and urgent care, inpatient pediatric orders.

## When not to use

- Infusions in mcg/kg/min: a drip calculator.
- Chemotherapy by body surface area: OncologyRegimen.

## Variants and states

| Variant | What it is |
|---|---|
| normal | Weight times mg/kg equals the dose, then volume at the concentration. |
| capped single | The weight-based dose is above the maximum single dose: warning Alert, maximum used. |
| capped daily | Doses per day would pass the daily maximum: each dose reduced. |
| invalid weight | Empty, zero or above 150 kg: field error and no result. |
| stale weight | Warning to weigh again. |
| readOnly | Hides Use in Order. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `drugs` | Array<{name, form, mgkg, perDay, freq, maxDose, maxDaily, conc, note}> | required |
| `defaultWeight` | number: kg | none |
| `defaultDrug` | number: index | 0 |
| `weightDate` | string | none |
| `weightStale` | string: such as "45 days" | none |
| `title / subtitle` | string |  |
| `readOnly` | boolean | false |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | the global context, else 'outpatient' |
| `weight / onWeightChange` | string: controlled weight text and change callback | uncontrolled |
| `drug / onDrugChange` | number: controlled medication index and change callback | uncontrolled |
| `onUseInOrder` | (result, drug) => void | none |
| `onRequestDoubleCheck` | () => void | none |

## Clinical values

Every number goes through the shared clinical value rules (`CareOS.fmt` and `ClinicalValue` from the clinical-values card): tabular digits, the unit always shown, a fixed precision per measure, the reference range in the tooltip, and H, L or critical flags. Medication amounts follow the ISMP dose style through `fmt.doseNumber`: rounded to the stated precision, then shown with no trailing zero (5 mg, never 5.0 mg) and a leading zero (0.5 mL). The specialty measures this card adds sit in `CareOS.specialty.MEAS` with their precision: weight 1 decimal kg; mg/kg, dose, volume and concentration rounded to 0.1 then shown without trailing zeros. Ranges in the previews are sample values for the design system, not clinical guidance; a real deployment passes its own.

## Usage

```jsx
<PediatricDosingCalculator defaultWeight={18.4} drugs={[{ name: "Ibuprofen", form: "100 mg/5 mL suspension", mgkg: 10, perDay: 4, freq: "every 6 hours as needed", maxDose: 400, maxDaily: 1600, conc: 20 }]} />
```

## Accessibility

- The result is a live region so changes to weight are announced.
- Caps are explained in words, not just a colour.
- Weight has a unit suffix and an error message tied to the field.

## Do and don't

- **Do:** Show the working: weight, mg/kg and the raw dose.
- **Do:** Ask for a second check on high-alert drugs.
- **Don't:** Hide that a dose was capped.
- **Don't:** Accept a weight without a date.
