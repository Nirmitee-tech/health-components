# ProblemListEditor

ProblemListEditor records problems as SNOMED CT concepts and shows the ICD-10-CM codes the map table offers, so a person picks the billable code the note supports.

## When to use

- Problem list upkeep, assessment and plan, risk adjustment review.

## When not to use

- Read-only display: ProblemList. Claim diagnosis entry: ICD10Picker.

## Variants and states

| Variant | What it is |
|---|---|
| one match | Green: the map gives one ICD-10 code. Still a candidate until the clinician signs. |
| pick code | Amber: several candidates; editing shows them as radios with the map rule. |
| picked | Blue: a person chose the code. |
| no map | Red: pick by hand or choose a more specific concept. |
| editing | Candidates and status (Active, Inactive, Resolved, Entered in error). |
| empty | Empty state. |
| readOnly | No edit buttons. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `items` | Array<{snomed, label, icd?: {code, label, rule?}[], picked?, onset?, status?, hcc?, principal?}> | [] |
| `defaultEditing` | number: row open for editing | -1 |
| `readOnly` | boolean | false |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | the global context, else 'outpatient' |

## Clinical values

Every number renders through CareOS.ClinicalValue and CareOS.fmt (the clinical-values builder), matched by LOINC; measures that table lacks (NT-proBNP, lactate, vancomycin trough, CrCl, PHQ-9, per-kg doses) use a local table with the same rules: tabular figures, the unit always shown, fixed decimals per measure (potassium 1, sodium 0, creatinine 2), the reference range in the title or beside it, and H, L, HH or LL flags in words for screen readers. The flag says where the number sits against the adult reference range in the rules table; it does not say the number was measured correctly.

## Usage

```jsx
<ProblemListEditor items={problems} />
```

## Accessibility

- Candidates are a fieldset of radios with a legend.
- Map state is in words, not only colour.

## Do and don't

- **Do:** Show the map rule (age, laterality) next to each candidate.
- **Don't:** Pick the ICD-10 code for the clinician automatically when several fit.
