# CarePlanByShift

CarePlanByShift shows each nursing problem with its goal, goal status and the interventions charted Done, Partly, Not done or N/A for each shift; only the current shift is editable.

**Built from:** Card, Badge, ClinicalValue. Every number goes through `CareOS.fmt` and renders as `ClinicalValue` (tabular figures, unit always shown, fixed precision per measure, reference range on hover, H / L / HH / LL flags).

## When to use

- Daily inpatient nursing care plan review and charting.

## When not to use

- Interdisciplinary long-term plans: CarePlanCard.

## Variants and states

| Variant | What it is |
|---|---|
| goal status | Goal met, Progressing, Not progressing, New. |
| shift status | Done, Partly, Not done, N/A, Upcoming. |
| current shift | Marked column; select a status to cycle it. |
| priority | Priority badge on a problem. |
| measure | Latest value toward the goal, formatted. |
| readOnly | No editing. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `problems` | {problem, goal, goalStatus, priority?, target?, measure?: {measure, value, range?}, interventions: {text, freq?, status: string[]}[], evaluation?}[] | required |
| `shifts` | string[] | Day, Evening, Night |
| `currentShift` | number index | none |
| `readOnly` | boolean | false |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | 'inpatient' when no global context is set |

## Usage

```jsx
<CarePlanByShift currentShift={1} problems={plan} />
```

## Accessibility

- Each problem is a labelled section with its own table and caption.
- Editable cells are buttons that say the current status.

## Do and don't

- **Do:** Tie the goal to a number when one exists.
- **Don't:** Let nurses chart past shifts from this view.
