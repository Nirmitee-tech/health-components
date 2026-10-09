# WoundCareDoc

WoundCareDoc documents one wound: site, stage and cause, length, width and depth in cm with computed area and change since first measure, tissue mix, exudate, treatment and the measurement history.

**Built from:** Card, Badge, Button, ClinicalValue. Every number goes through `CareOS.fmt` and renders as `ClinicalValue` (tabular figures, unit always shown, fixed precision per measure, reference range on hover, H / L / HH / LL flags).

## When to use

- Pressure injuries, surgical wounds, diabetic foot ulcers, venous ulcers.

## When not to use

- Risk only, no wound: BradenScore.
- Body location picking: BodyMap.

## Variants and states

| Variant | What it is |
|---|---|
| editable | Inputs for L, W, D; area updates as you type. |
| healing | Area change negative, shown green. |
| worsening | Area change positive, shown red; Stage 4 or Unstageable shows red stage badge. |
| hospital-acquired | Red badge. |
| tissue check | Warns when percentages do not add to 100. |
| readOnly | Values only. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `wound` | {label, location, stage?, etiology?, onset?, hapi?, photo?, current: {length, width, depth, tissue, exudate, odor, periwound, pain, undermining, tunneling, dressing, nextChange}} | required |
| `history` | {date, length, width, depth, by}[] | [] |
| `readOnly` | boolean | false |
| `onSave` | (current) => void | none |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | 'inpatient' when no global context is set |

## Usage

```jsx
<WoundCareDoc wound={sacrum} history={measurements} onSave={save} />
```

## Accessibility

- Inputs are labelled with their unit.
- Tissue bar has an aria-label listing each tissue and percent.
- Area change has a sign character, not only colour.

## Do and don't

- **Do:** Measure head-to-toe for length and side-to-side for width every time.
- **Don't:** Compare areas taken with different methods.
