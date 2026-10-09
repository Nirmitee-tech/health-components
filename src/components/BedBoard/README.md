# BedBoard

BedBoard shows every bed on one or more units by room, with its status, the patient in it and their precautions, and lets bed management drag a waiting patient onto a clean bed.

## When to use

- House supervisor, bed management and charge nurse views.
- Any time a person picks a bed for an admission or transfer.

## When not to use

- A list of patients without beds: CensusList.
- Outpatient rooms: the scheduling components.

## Variants and states

| Variant | What it is |
|---|---|
| clean | Green edge. Ready for a patient. |
| dirty | Amber fill. Waiting for environmental services. |
| occupied | Blue edge with patient, day of stay and badges. |
| blocked | Hatched. With the reason. |
| pending | Purple dashed. Assigned, patient on the way. |
| drag target | While a patient is selected, beds that pass the placement check get an outline and an Assign button; others fade and say why. |
| rejected drop | Error alert with the rule that failed. |
| readOnly | Lock alert, no dragging. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `units` | Array of { id, name, level, ratio, rooms: [{ id, negativePressure, beds: [{ id, status, note, patient }] }] } | required |
| `queue` | Array of patients waiting for a bed { id, name, age, sex, reason, level, isolation, waiting } | [] |
| `defaultSelected` | string: queue id selected at start | none |
| `onAssign` | function(patient, bed, room) | none |
| `readOnly` | boolean | false |
| `title / subtitle` | string | 'Bed Board' |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | 'inpatient' when no global context is set |
| `unitsValue / onUnitsChange` | controlled board; onUnitsChange(units) after an assignment | uncontrolled from `units` |
| `queueValue / onQueueChange` | controlled queue; onQueueChange(queue) after an assignment | uncontrolled from `queue` |
| `selected / onSelectedChange` | controlled selected queue id (null for none) | uncontrolled from `defaultSelected` |

## Usage

```jsx
<BedBoard units={units} queue={waiting} onAssign={(pt, bed, room) => api.assignBed(pt.id, room.id + bed.id)} />
```

## Accessibility

- Drag is never the only way: select a waiting patient, then press Assign on a bed.
- Each bed has an aria-label with room, status, patient and, while a patient is selected, why it cannot take them.
- Bed status is in words as well as colour.

## Do and don't

- **Do:** Run the placement check before the drop so airborne patients only land in negative-pressure rooms.
- **Do:** Treat the check as a guard. The charge nurse still confirms the bed.
- **Don't:** Show a patient's full diagnosis list on a public hallway display.
