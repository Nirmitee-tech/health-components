# BehavioralTreatmentPlan

BehavioralTreatmentPlan lays out a behavioral health plan as problems, goals, measurable objectives and the interventions for each, with target dates, progress, review date and signatures.

## When to use

- Mental health and substance use treatment plans at intake, at each review and at discharge.

## When not to use

- Crisis safety planning: a safety plan form.
- Medical problem lists: ProblemList.

## Variants and states

| Variant | What it is |
|---|---|
| problem | Code, label, priority and the evidence for it. |
| goal | Clinical wording plus the client’s own words. |
| objective | Measurable step with a measure (baseline, now, target), a target date and status: met, progressing, not started, not met, revised. |
| intervention | What the clinician does, how often and who. |
| signatures | Client and clinician badges, signed or needed. |
| review | Next review date, or overdue in danger. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `problems` | Array<{code, label, priority, evidence, goals: [{text, words, objectives: [{text, target, status, measure?: {name, k, baseline, current, target}, interventions: [{text, frequency, who}]}]}]}> | [] |
| `reviewDue` | string | none |
| `reviewOverdue` | boolean | false |
| `signatures` | Array<{role, date?}> | [] |
| `title / subtitle` | string |  |
| `readOnly` | boolean | false |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | the global context, else 'outpatient' |
| `onReviewPlan / onSignPlan` | () => void: header actions | none |

## Clinical values

Every number goes through the shared clinical value rules (`CareOS.fmt` and `ClinicalValue` from the clinical-values card): tabular digits, the unit always shown, a fixed precision per measure, the reference range in the tooltip, and H, L or critical flags. Medication amounts follow the ISMP dose style through `fmt.doseNumber`: rounded to the stated precision, then shown with no trailing zero (5 mg, never 5.0 mg) and a leading zero (0.5 mL). The specialty measures this card adds sit in `CareOS.specialty.MEAS` with their precision: scale scores whole points. Ranges in the previews are sample values for the design system, not clinical guidance; a real deployment passes its own.

## Usage

```jsx
<BehavioralTreatmentPlan problems={[{ code: "F33.1", label: "Major depressive disorder, recurrent, moderate", goals: [{ text: "Reduce depressive symptoms", objectives: [{ text: "PHQ-9 under 10", target: "12/15/2026", status: "progressing", measure: { name: "PHQ-9", baseline: 17, current: 12, target: 9 }, interventions: [{ text: "CBT", frequency: "weekly", who: "LCSW" }] }] }] }]} />
```

## Accessibility

- Each problem is a labelled region; numbering (1.1a) ties objectives to goals in text.
- Status is a word badge.

## Do and don't

- **Do:** Write objectives the client can see progress on.
- **Do:** Keep the client’s own words beside the goal.
- **Don't:** List interventions without frequency or owner.
- **Don't:** Let the review date pass silently.
