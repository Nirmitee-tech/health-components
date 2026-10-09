# PsychRatingScales

PsychRatingScales gives PHQ-9, GAD-7 and the C-SSRS screen in tabs, scores them live with the published bands, and escalates suicide risk with the actions to take.

## When to use

- Primary care and behavioral health screening, measurement-based care at each visit.

## When not to use

- Diagnosis: a score is a screen.
- A full C-SSRS lifetime and since-last-visit interview.

## Variants and states

| Variant | What it is |
|---|---|
| PHQ-9 | Nine items 0 to 3, bands minimal, mild, moderate, moderately severe, severe; change since last score. |
| GAD-7 | Seven items, bands minimal, mild, moderate, severe. |
| incomplete | "n of 9 answered" until every item has an answer; no band before that. |
| item 9 positive | Error Alert that opens the C-SSRS tab; the item row turns red. |
| C-SSRS screen | Questions 3 to 5 show only after a yes to 2; the 3 month question only after a yes to 6. |
| risk | None (success), low: give resources (info), moderate: safety plan and follow-up in 24 to 72 hours (warning), high: do not leave alone, crisis team (error). |
| history | Earlier scores and risk levels. |
| readOnly | Answers locked. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `defaultAnswers` | {phq9?: number[], gad7?: number[], cssrs?: {q1..q6, q6r: boolean}} | {} |
| `defaultTab` | 'phq9' \| 'gad7' \| 'cssrs' | 'phq9' |
| `history` | Array<{date, phq9, gad7, cssrs}> | [] |
| `title / subtitle` | string |  |
| `readOnly` | boolean | false |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | the global context, else 'outpatient' |
| `answers / onAnswersChange` | controlled answers and change callback | uncontrolled |
| `tab / onTabChange` | controlled tab and change callback | uncontrolled |
| `onCallCrisisTeam / onStartSafetyPlan` | () => void: risk actions | none |

## Clinical values

Every number goes through the shared clinical value rules (`CareOS.fmt` and `ClinicalValue` from the clinical-values card): tabular digits, the unit always shown, a fixed precision per measure, the reference range in the tooltip, and H, L or critical flags. Medication amounts follow the ISMP dose style through `fmt.doseNumber`: rounded to the stated precision, then shown with no trailing zero (5 mg, never 5.0 mg) and a leading zero (0.5 mL). The specialty measures this card adds sit in `CareOS.specialty.MEAS` with their precision: scores whole points; change is signed. Ranges in the previews are sample values for the design system, not clinical guidance; a real deployment passes its own.

## Usage

```jsx
<PsychRatingScales defaultAnswers={{ phq9: [2, 2, 1, 2, 1, 1, 1, 0, 1] }} history={[{ date: "08/01/2026", phq9: 17, gad7: 13 }]} />
```

## Accessibility

- Answers are radio groups named by the question.
- The score and the risk level update in a live region.
- Risk is a word badge and an Alert with role alert at high risk.

## Do and don't

- **Do:** Run the C-SSRS screen the same visit when item 9 is above 0.
- **Do:** Record who was told about high risk and when.
- **Don't:** Show a band before every item is answered.
- **Don't:** Let the patient leave before a high-risk screen is acted on.
