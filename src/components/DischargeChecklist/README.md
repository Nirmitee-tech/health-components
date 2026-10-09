# DischargeChecklist

DischargeChecklist tracks the tasks that must be done before a patient leaves, who owns each one, and turns on Ready for Discharge only when the required ones are done.

## When to use

- Discharge huddles, case management, nursing discharge.

## When not to use

- The patient's own instructions: AfterVisitSummary.

## Variants and states

| Variant | What it is |
|---|---|
| in progress | Progress bar in warning, button shows how many required items remain. |
| ready | All required done, success bar, button on. |
| auto items | Ticked from the chart and locked (signed med rec, for example). |
| readOnly | Locked. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `items` | Array of { label, detail, required, done, auto, owner, by } | required |
| `patient` | string | none |
| `edd` | string | 'not set' |
| `user` | string: name stamped on ticks | 'You' |
| `readOnly` | boolean | false |
| `onReady` | function | none |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | 'inpatient' when no global context is set |
| `itemsValue / onItemsChange` | controlled list; onItemsChange(items) on every tick | uncontrolled from `items` |

## Usage

```jsx
<DischargeChecklist patient="Okafor, Grace" edd="Today 14:00" items={tasks} onReady={sendToADT} />
```

## Accessibility

- Each task is a real checkbox with its detail as description.
- Progress bar has a text value.

## Do and don't

- **Do:** Name an owner for every open item.
- **Don't:** Let staff untick an item that came from a signed chart record.
