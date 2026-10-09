# TriageForm

TriageForm records the chief complaint, arrival mode and triage vitals, and suggests an Emergency Severity Index (ESI v4) level that the nurse confirms or overrides.

**From the screens:** New for the acute care module. Built from: Card, TextField, Select, Checkbox, Alert, Button, ESIBadge.

**Values:** Every number goes through the shared value rules (`CareOS.acuteFmt.format`): tabular figures, unit always shown, fixed decimals per measure, reference range in the hover title, and H, L or critical tags. Colour is never the only signal: flags carry words and an icon.

## When to use

- Triage at the ED front door or in a triage room.

## When not to use

- Repeat vitals in a room: VitalsPanel. Pediatric triage with PAT: extend the danger-zone limits first.

## Variants and states

| Variant | What it is |
|---|---|
| empty | No suggestion until A, B or C is answered. |
| ESI 1 to 5 | Suggested level with the decision point that produced it. |
| danger zone | Two or more resources plus HR above 100, RR above 20 or SpO2 below 92% suggests ESI 2. |
| override | Nurse override; the suggested level stays visible in the reason. |
| isolation screen | Warning alert at the top. |
| errors | showErrors marks the missing complaint. |
| readOnly | Signed triage, all fields locked. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `defaultValues` | {complaint, arrival, hr, sbp, dbp, rr, spo2, temp, pain, glucose, lifeSaving, highRisk, confused, severePain, resources, override} | {} |
| `isolation` | string: positive screen name | none |
| `showErrors` | boolean | false |
| `readOnly` | boolean | false |
| `onSubmit` | (values) => void | none |
| `onSaveDraft` | (values) => void | none |
| `subtitle` | string | none |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | 'ed' when no global context is set |

## Usage

```jsx
<TriageForm onSubmit={saveTriage} defaultValues={{ complaint: "Chest pressure", arrival: "EMS ground" }} />
```

## Accessibility

- Each vital input has a visible label and unit; its flag reads out next to it.
- The ESI result is a polite live region.
- Decision points are checkboxes with plain descriptions.

## Do and don't

- **Do:** Show why the level was suggested.
- **Do:** Let the nurse override and keep the suggestion on record.
- **Don't:** Auto-assign ESI without a nurse confirming.
- **Don't:** Hide abnormal vitals until submit.
