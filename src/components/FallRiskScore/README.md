# FallRiskScore

FallRiskScore is the Morse Fall Scale: six items, automatic total and the risk band with the precautions it calls for.

**Built from:** Card, Badge. Every number goes through `CareOS.fmt` and renders as `ClinicalValue` (tabular figures, unit always shown, fixed precision per measure, reference range on hover, H / L / HH / LL flags).

## When to use

- Adult inpatient fall screen on admission, each shift and after a change or a fall.

## When not to use

- Children: use a pediatric tool (Humpty Dumpty) through ScoreForm-style items.

## Variants and states

| Variant | What it is |
|---|---|
| incomplete | Shows how many items are scored; no total or band. |
| Low (0 to 24) | Green band, standard precautions. |
| Moderate (25 to 44) | Amber band. |
| High (45+) | Red band with bed alarm, low bed, rounding. |
| previous | Last total shown under the result. |
| readOnly | Options not selectable. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `defaultValues` | Record<itemId, optionIndex> | {} |
| `values` | controlled Record | none |
| `band` | (total) => {tone, label, action} | 0-24 / 25-44 / 45+ |
| `previous` | {total, when} | none |
| `readOnly` | boolean | false |
| `onChange` | (values) => void | none |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | 'inpatient' when no global context is set |

## Usage

```jsx
<FallRiskScore defaultValues={{ history: 1, secondary: 1, aid: 1, iv: 1, gait: 2, mental: 0 }} previous={{ total: 35, when: "yesterday 20:00" }} />
```

## Accessibility

- Each item is a radiogroup; options show their points.
- Total and band are in a polite live region.

## Do and don't

- **Do:** Pass `band` when the site uses different cut-offs (for example 25 to 50 and 51+).
- **Don't:** Show a band before every item is scored.
