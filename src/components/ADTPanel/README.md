# ADTPanel

ADTPanel admits, transfers and discharges a patient: level of care, attending and reason for admit and transfer, and disposition for discharge.

## When to use

- Admitting, transfer centre and discharge workflows, from the chart or the bed board.

## When not to use

- Picking the bed itself: BedBoard.
- Order review at transfer: OrderReconciliation.

## Variants and states

| Variant | What it is |
|---|---|
| admit | Level of care, inpatient vs observation, attending, admitting diagnosis. |
| transfer | New level, target unit, attending, reason. Warns when stepping down from ICU. |
| discharge | Disposition, date and time, transport. Lists blockers; AMA shows the form reminder. |
| done | Success alert after submit. |
| errors | showErrors marks missing reason or disposition. |
| blocked | Discharge button off while blockers remain. |
| readOnly | Locked fields. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `patient` | { name, mrn, location, level, isolation, status } | required |
| `mode` | 'admit' \| 'transfer' \| 'discharge' | 'admit' |
| `level / reason` | string: starting values | 'medsurg' / '' |
| `blockers` | string[]: open discharge items | [] |
| `units / attendings` | string[] | sample lists |
| `showErrors` | boolean | false |
| `done` | boolean | false |
| `readOnly` | boolean | false |
| `onSubmit / onCancel` | function | none |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | 'inpatient' when no global context is set |
| `modeValue / onModeChange` | controlled action; onModeChange(mode) | uncontrolled from `mode` |
| `levelValue / onLevelChange`, `reasonValue / onReasonChange` | controlled level and reason | uncontrolled from `level` / `reason` |
| `dischargeAt` | string: discharge date and time shown at start | '10/09/2026 14:30' |

## Usage

```jsx
<ADTPanel mode="transfer" patient={pt} onSubmit={({ mode, level, reason }) => adt.send(mode, level, reason)} />
```

## Accessibility

- The action tabs are a tablist; tabs that do not apply to the status are disabled with a reason in the status.
- Errors are linked to the fields.

## Do and don't

- **Do:** Show the blockers in the discharge tab itself.
- **Don't:** Let a discharge go through with a medication reconciliation still open.
