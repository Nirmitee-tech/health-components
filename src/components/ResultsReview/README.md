# ResultsReview

ResultsReview is the inbox detail for one resulted order: values against the prior draw, then Acknowledge, Comment, Route and Notify Patient. A critical value needs the read-back recorded before Acknowledge.

## When to use

- Results inbox detail pane; covering-clinician review.

## When not to use

- Trends across many draws: ResultsTrendPanel.

## Variants and states

| Variant | What it is |
|---|---|
| new | Grey New tag. |
| critical | Red alert; Acknowledge is disabled until "Read-back done" is ticked. |
| comment | Inline comment box. |
| route | Pick a person or pool, then Route. |
| routed | Blue tag with the recipient. |
| acknowledged | Green tag and a locked confirmation. |
| readOnly | Lock message for roles that cannot acknowledge. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `result` | {title, patient?, orderedBy, collected, resulted, rows: {code, value, prior?, over?}[], status?, comments?, interpretation?, calledTo?, ackBy?, ackAt?, routedTo?} | required |
| `routeOptions` | string[] | [] |
| `user` | string | 'You' |
| `readOnly` | boolean | false |
| `onAcknowledge` | () => void | none |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | the global context, else 'outpatient' |

## Clinical values

Every number renders through CareOS.ClinicalValue and CareOS.fmt (the clinical-values builder), matched by LOINC; measures that table lacks (NT-proBNP, lactate, vancomycin trough, CrCl, PHQ-9, per-kg doses) use a local table with the same rules: tabular figures, the unit always shown, fixed decimals per measure (potassium 1, sodium 0, creatinine 2), the reference range in the title or beside it, and H, L, HH or LL flags in words for screen readers. The flag says where the number sits against the adult reference range in the rules table; it does not say the number was measured correctly.

## Usage

```jsx
<ResultsReview result={bmp} routeOptions={["Lisa Chen RN", "Cardiology nurse pool"]} />
```

## Accessibility

- A critical value uses role alert.
- Acknowledge says why it is disabled through the required checkbox next to it.

## Do and don't

- **Do:** Show the prior value next to the new one.
- **Don't:** Allow acknowledging a critical value without a read-back.
