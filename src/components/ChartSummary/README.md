# ChartSummary

ChartSummary is the one-page, problem-oriented summary: each active problem with the results, medications, plan and care gap that belong to it, plus allergies, code status and last vitals.

## When to use

- Chart landing page, pre-visit review, handoff and consult reading.

## When not to use

- Editing problems: ProblemListEditor. Long result history: ResultsTrendPanel.

## Variants and states

| Variant | What it is |
|---|---|
| full | Problems with linked results, medications, plan and gaps. |
| allergies not reviewed | allergies undefined: amber tag. |
| NKA | allergies []: green tag. |
| no problems | Empty state that asks to add problems. |
| critical result | HH or LL value shows a filled flag. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `problems` | Array<{code, label, onset?, chronic?, specialty?, results?: {code, value, date}[], meds?: string[], plan?, gap?}> | [] |
| `allergies` | Array<{substance, severity}> \| [] \| undefined | undefined |
| `vitals` | Array<{code, value}> | [] |
| `vitalsTaken` | string | none |
| `codeStatus` | string | none |
| `gaps` | string[] | [] |
| `title` | string | 'Chart Summary' |
| `subtitle` | string | none |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | the global context, else 'outpatient' |

## Clinical values

Every number renders through CareOS.ClinicalValue and CareOS.fmt (the clinical-values builder), matched by LOINC; measures that table lacks (NT-proBNP, lactate, vancomycin trough, CrCl, PHQ-9, per-kg doses) use a local table with the same rules: tabular figures, the unit always shown, fixed decimals per measure (potassium 1, sodium 0, creatinine 2), the reference range in the title or beside it, and H, L, HH or LL flags in words for screen readers. The flag says where the number sits against the adult reference range in the rules table; it does not say the number was measured correctly.

## Usage

```jsx
<ChartSummary problems={problems} allergies={allergies} vitals={[{ code: "SBP", value: 148 }]} codeStatus="Full code" />
```

## Accessibility

- Each problem is a group with its code read before the words.
- Flags are read in words, such as "9.1 %, High".

## Do and don't

- **Do:** Group results under the problem they monitor.
- **Don't:** Show a number without its unit.
