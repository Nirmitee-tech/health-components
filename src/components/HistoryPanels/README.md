# HistoryPanels

HistoryPanels holds past medical, surgical, family and social history in tabs, with family history as a relative-by-relative pedigree list and social history including the social needs (SDOH) screening.

## When to use

- Intake, annual wellness visit, new-patient history, pre-operative review.

## When not to use

- Active problems: ProblemListEditor.

## Variants and states

| Variant | What it is |
|---|---|
| Medical | Coded past conditions, resolved tag. |
| Surgical | Procedure, date, side, surgeon, complication. |
| Family | Relative, side, age or age at death, conditions with onset age; cause of death in red; unknown history. |
| Social and needs | Tobacco with pack-years, alcohol with AUDIT-C, then the screening table with need found, no need or declined. |
| not asked | undefined for any section: amber warning. |
| none | []: green "No ..." tag. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `pmh` | Array<{code?, label, when?, note?, resolved?}> \| [] \| undefined | undefined |
| `psh` | Array<{cpt?, label, date?, laterality?, surgeon?, site?, complication?}> \| [] \| undefined | undefined |
| `family` | Array<{relation, side?, age?, deceased?, ageAtDeath?, unknown?, conditions?: {label, onset?, causeOfDeath?}[]}> \| undefined | undefined |
| `social` | {tobacco?, packYears?, alcohol?, auditC?, sex?, drugs?, occupation?, livesWith?, sexual?, sdohTool?, sdohDate?, sdoh?: {domain, loinc?, answer?, result, referral?}[]} | undefined |
| `defaultTab` | 'pmh' \| 'psh' \| 'fam' \| 'soc' | 'pmh' |
| `reviewed` | string | none |
| `readOnly` | boolean | false |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | the global context, else 'outpatient' |

## Clinical values

Every number renders through CareOS.ClinicalValue and CareOS.fmt (the clinical-values builder), matched by LOINC; measures that table lacks (NT-proBNP, lactate, vancomycin trough, CrCl, PHQ-9, per-kg doses) use a local table with the same rules: tabular figures, the unit always shown, fixed decimals per measure (potassium 1, sodium 0, creatinine 2), the reference range in the title or beside it, and H, L, HH or LL flags in words for screen readers. The flag says where the number sits against the adult reference range in the rules table; it does not say the number was measured correctly.

## Usage

```jsx
<HistoryPanels pmh={pmh} psh={psh} family={family} social={social} defaultTab="soc" />
```

## Accessibility

- Tabs use arrow keys.
- Family history is a list, one relative per item.
- Need found is shown with icon and words.

## Do and don't

- **Do:** Record "declined" as an answer.
- **Don't:** Treat a blank screening as no need.
