# OncologyRegimen

OncologyRegimen tracks a chemotherapy regimen cycle by cycle, with BSA-based doses, dose reductions, pre-cycle labs against hold rules and lifetime cumulative doses.

## When to use

- Infusion center and oncology clinic, before releasing each cycle to pharmacy.

## When not to use

- Oral targeted therapy refills: MedicationList.
- Weight-based pediatric doses: PediatricDosingCalculator.

## Variants and states

| Variant | What it is |
|---|---|
| cycle strip | Given (success), due today (info, highlighted), planned, delayed (warning), held (danger), with any dose reduction. |
| BSA | Mosteller from height and weight to 0.01 m²; optional cap; weight change since cycle 1. |
| dose table | mg/m² or flat dose, calculated mg, reduction and final mg. |
| hold criteria | ANC, platelets or creatinine past the regimen’s hold rule: error Alert and Release to Pharmacy disabled. |
| cumulative | Lifetime dose against its limit, warning from 80%. |
| readOnly | Hides actions. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `regimen` | {name, intent, cycleDays, cycles, bsaCap?, hold: {anc, plt, cr?}, drugs: [{name, route, days, mgm2 \| flat}]} | required |
| `patient` | {heightCm, weightKg, bsa?, weightChange?} | required |
| `cycles` | Array<{n, date, status, reduction?, labs?: {anc, plt, hgb, cr}, labsDate?}> | [] |
| `cumulative` | Array<{drug, given, limit, note}> | [] |
| `readOnly` | boolean | false |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | the global context, else 'outpatient' |
| `onHoldCycle / onRelease` | () => void: header actions (Release is disabled while hold criteria are met) | none |

## Clinical values

Every number goes through the shared clinical value rules (`CareOS.fmt` and `ClinicalValue` from the clinical-values card): tabular digits, the unit always shown, a fixed precision per measure, the reference range in the tooltip, and H, L or critical flags. Medication amounts follow the ISMP dose style through `fmt.doseNumber`: rounded to the stated precision, then shown with no trailing zero (5 mg, never 5.0 mg) and a leading zero (0.5 mL). The specialty measures this card adds sit in `CareOS.specialty.MEAS` with their precision: BSA 2 decimals m², mg/m² whole, final dose 0.1 mg, ANC 0.1 ×10⁹/L, platelets whole ×10⁹/L, creatinine 0.01 mg/dL. Ranges in the previews are sample values for the design system, not clinical guidance; a real deployment passes its own.

## Usage

```jsx
<OncologyRegimen regimen={{ name: "FOLFOX6", cycleDays: 14, cycles: 12, hold: { anc: 1.5, plt: 75 }, drugs: [{ name: "Oxaliplatin", route: "IV", days: "D1", mgm2: 85 }] }} patient={{ heightCm: 172, weightKg: 70 }} cycles={[{ n: 1, date: "08/03/2026", status: "given" }]} />
```

## Accessibility

- Cycles are a list with status words.
- The hold reason is written out, and the blocked button says why in the Alert above it.
- Lifetime dose meters have value text.

## Do and don't

- **Do:** Show the BSA used and its source on the screen that releases the dose.
- **Do:** Block release when hold rules are met until a provider decides.
- **Don't:** Round BSA before multiplying.
- **Don't:** Hide a dose reduction inside the final number.
