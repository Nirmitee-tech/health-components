# SurgicalSafetyChecklist

SurgicalSafetyChecklist runs the WHO Surgical Safety Checklist in its three phases, Sign In, Time Out and Sign Out, each confirmed by the team before the next unlocks.

**From the screens:** New for the perioperative module. Based on the WHO Surgical Safety Checklist (2009). Built from: Card, Checkbox, Badge, Button, Alert.

**Values:** Every number goes through the shared value rules (`CareOS.acuteFmt.format`): tabular figures, unit always shown, fixed decimals per measure, reference range in the hover title, and H, L or critical tags. Colour is never the only signal: flags carry words and an icon.

## When to use

- In the OR on the room display or the circulator's workstation.

## When not to use

- Pre-op nursing assessment: a form.

## Variants and states

| Variant | What it is |
|---|---|
| Sign In active | First phase open, others locked. |
| in progress | Count of items checked; Confirm disabled until all checked. |
| confirmed | Green phase with the confirmation time. |
| Time Out active | After Sign In. |
| all confirmed | Every phase green. |
| site mismatch | Red stop alert. |
| readOnly | Review after the case. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `defaultChecked` | Record<phase+index, boolean> | {} |
| `confirmed` | {signin?, timeout?, signout?: 'HH:MM'} | {} |
| `clock` | 'HH:MM' used for a new confirmation | the device clock |
| `mismatch` | string | none |
| `readOnly` | boolean | false |
| `onConfirm` | (phase: 'signin' \| 'timeout' \| 'signout', time: 'HH:MM') => void | none |
| `checked` / `onCheckedChange` | controlled checked items and their change callback | uncontrolled |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | 'ed' when no global context is set |

## Usage

```jsx
<SurgicalSafetyChecklist confirmed={{ signin: "07:41" }} clock={nowHHMM} onConfirm={logPhase} />
```

## Accessibility

- Each phase is a labelled section; locked phases say Locked in text.
- Confirm stays disabled with a help line until every item is checked.

## Do and don't

- **Do:** Confirm each phase aloud, then click.
- **Don't:** Pre-check items before the team speaks them.
