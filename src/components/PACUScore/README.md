# PACUScore

PACUScore scores recovery with the modified Aldrete scale (activity, respiration, circulation, consciousness, oxygen saturation; 0 to 2 each, total out of 10) and shows when the patient meets phase I discharge criteria.

**From the screens:** New for the perioperative module. Built from: Card, Badge, Radio styling. Aldrete JA, 1995 modification with SpO2.

**Values:** Every number goes through the shared value rules (`CareOS.acuteFmt.format`): tabular figures, unit always shown, fixed decimals per measure, reference range in the hover title, and H, L or critical tags. Colour is never the only signal: flags carry words and an icon.

## When to use

- PACU nursing on arrival and every 15 minutes until discharge.

## When not to use

- Phase II or home readiness (PADSS): a separate score.

## Variants and states

| Variant | What it is |
|---|---|
| not scored | Total says Not scored. |
| incomplete | Some items answered. |
| not ready | Complete with total under 9 or any 0. |
| ready | Total 9 or 10, no 0: green Meets discharge criteria. |
| history | Earlier scores by time. |
| readOnly | Locked review. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `defaultValues` | {activity, respiration, circulation, consciousness, spo2}: 0 \| 1 \| 2 | {} |
| `history` | Array<{time, activity, respiration, circulation, consciousness, spo2}> | [] |
| `name` | string: radio group prefix when several are on a page | a generated unique prefix |
| `readOnly` | boolean | false |
| `onChange` | (values) => void | none |
| `values` | controlled item scores (pair with `onChange`) | uncontrolled |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | 'ed' when no global context is set |

## Usage

```jsx
<PACUScore name="bay3" history={earlier} onChange={saveScore} />
```

## Accessibility

- Each criterion is a fieldset with a legend; options are native radios with the score number in the label.
- Total and readiness are a live region.

## Do and don't

- **Do:** Score at fixed intervals and keep the history.
- **Don't:** Discharge on the total alone if any item is 0.
