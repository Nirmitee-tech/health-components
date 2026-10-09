# BradenScore

BradenScore is the Braden Scale for pressure injury risk: six subscales, automatic total from 6 to 23 and the risk band (lower is higher risk).

**Built from:** Card, Badge. Every number goes through `CareOS.fmt` and renders as `ClinicalValue` (tabular figures, unit always shown, fixed precision per measure, reference range on hover, H / L / HH / LL flags).

## When to use

- Pressure injury risk on admission and daily, more often in ICU.

## When not to use

- Documenting an existing wound: WoundCareDoc.
- Neonates and young children: Braden Q.

## Variants and states

| Variant | What it is |
|---|---|
| incomplete | Count of scored subscales. |
| No risk (19+) | Green. |
| Mild (15 to 18) | Amber. |
| Moderate (13 to 14) | Amber. |
| High (10 to 12) | Red. |
| Very high (9 or less) | Red with consults. |
| readOnly | Not selectable. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `defaultValues` | Record<itemId, optionIndex> | {} |
| `band` | (total) => band | standard bands |
| `previous` | {total, when} | none |
| `readOnly` | boolean | false |
| `onChange` | (values) => void | none |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | 'inpatient' when no global context is set |

## Usage

```jsx
<BradenScore defaultValues={{ sensory: 1, moisture: 1, activity: 0, mobility: 1, nutrition: 1, friction: 0 }} />
```

## Accessibility

- Each subscale is a radiogroup; options show their points.
- The total says lower is higher risk in words.

## Do and don't

- **Do:** Score friction and shear on its 1 to 3 range.
- **Don't:** Read a high number as high risk.
