# ShiftHandoff

ShiftHandoff is the SBAR nurse-to-nurse report: Situation, Background, Assessment with formatted values, Recommendation, what is due next, and the receiving nurse accepting it.

**Built from:** Card, Badge, Button, ClinicalValue. Every number goes through `CareOS.fmt` and renders as `ClinicalValue` (tabular figures, unit always shown, fixed precision per measure, reference range on hover, H / L / HH / LL flags).

## When to use

- Shift change, transfer between units, handoff to rapid response.

## When not to use

- Provider sign-out with a task list: use the I-PASS pattern.

## Variants and states

| Variant | What it is |
|---|---|
| full | All four sections, flags, due list. |
| accepted | Green "Received by" badge with time. |
| missing section | Shows "Not filled in". |
| flags | Isolation, fall risk, code status in the header. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `situation / background / assessment / recommendation` | {text?, items?: string[], values?: {label, measure, value, range?}[]} | none |
| `pending` | string[] | none |
| `flags` | {label, tone?, icon?}[] | none |
| `from / to` | string | none |
| `acknowledged` | boolean | false |
| `ackTime` | string | none |
| `onAcknowledge` | () => void | none |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | 'inpatient' when no global context is set |
| `defaultAcknowledged` | boolean: initial accepted state when `acknowledged` is not set | false |

## Usage

```jsx
<ShiftHandoff from="L. Chen RN" to="J. Ortiz RN" situation={{ text: "..." }} assessment={{ values: [...] }} />
```

## Accessibility

- Each section has a visible heading; the S, B, A, R letters are decorative.
- Values carry their flags in words.

## Do and don't

- **Do:** Put numbers in `values` so they are formatted and flagged.
- **Don't:** Paste vitals as free text.
