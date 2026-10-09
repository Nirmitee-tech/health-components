# IntakeOutputPanel

IntakeOutputPanel lists intake and output entries for a shift with a running balance, totals and urine output in mL/kg/h.

**Built from:** Card, Button, Badge, Alert, ClinicalValue. Every number goes through `CareOS.fmt` and renders as `ClinicalValue` (tabular figures, unit always shown, fixed precision per measure, reference range on hover, H / L / HH / LL flags).

## When to use

- Shift I&O on med-surg, ICU, peds, post-op and renal patients.

## When not to use

- Hour-by-hour drip volumes alongside vitals: Flowsheet I&O group.

## Variants and states

| Variant | What it is |
|---|---|
| default | Totals, net balance and the entry table with a running balance column. |
| urine output check | Alert when weight and hours are given; amber below target (default 0.5 mL/kg/h, peds 1.0). |
| adding | Inline form for time, type, source and amount. |
| empty | No entries yet. |
| readOnly | View only. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `entries` | {time, kind: "in" | "out", category, amount, note?}[] | [] |
| `weightKg / hours` | number | none |
| `uoTarget` | number mL/kg/h | 0.5 |
| `inCategories / outCategories` | string[] | PO, IV ... / Urine, Emesis ... |
| `now` | string | "" |
| `defaultAdding` | boolean | false |
| `readOnly` | boolean | false |
| `onAdd` | (entry) => void | none |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | 'inpatient' when no global context is set |

## Usage

```jsx
<IntakeOutputPanel entries={io} weightKg={82} hours={8} onAdd={save} />
```

## Accessibility

- Table with caption; amounts right-aligned in tabular figures.
- Net balance sign is a character (+ or −), not only colour.

## Do and don't

- **Do:** Give weight and hours so mL/kg/h is computed, not guessed.
- **Don't:** Mix mL and oz in one panel.
