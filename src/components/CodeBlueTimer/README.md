# CodeBlueTimer

CodeBlueTimer runs a resuscitation: elapsed time, the 2-minute CPR cycle, time since epinephrine, rhythm and shocks, one-tap event logging, and the event log for the code record.

## When to use

- The recorder screen during a cardiac arrest.

## When not to use

- A deteriorating patient who still has a pulse: RapidResponsePanel.

## Variants and states

| Variant | What it is |
|---|---|
| running | Live timers, action buttons. |
| rhythm check due | CPR tile turns red at 02:00 and blinks (still under reduced motion it stays red). |
| epinephrine | Amber from 03:00, red from 05:00. |
| ended | Header shows the outcome; actions hidden. |
| readOnly | Review of a past code. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `patient / location` | string | required |
| `startedAt` | number: epoch ms | now |
| `now` | number: freeze the clock (for review and tests) | live |
| `events` | Array of { t: seconds, text, by } | [] |
| `rhythm / energy` | string / number | none / 200 |
| `vitals` | Array of { measure, value } | [] |
| `team` | string[] | none |
| `ended` | string: outcome | none |
| `readOnly` | boolean | false |
| `onEvent / onRosc` | function | none |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | 'inpatient' when no global context is set |
| `eventsValue / onEventsChange` | controlled log; onEventsChange(events) when an event is added | uncontrolled from `events` |

## Clinical values

Every number goes through the clinical value rules: tabular digits, unit always shown, fixed precision per measure (temperature 0.1 °C, potassium 0.1 mmol/L, creatinine 0.01 mg/dL, heart rate whole bpm), the reference range in the tooltip and H, L, H! or L! flags. Doses drop trailing zeros and keep a leading zero (0.5 mg, 5 mg).

## Usage

```jsx
<CodeBlueTimer patient="Ruiz, Carmen, 81 F" location="4 West 404B" startedAt={codeStart} rhythm="VF" energy={200} />
```

## Accessibility

- Elapsed time is role timer; the log is a polite live region so new events are read once.
- Buttons are large and labelled with the drug and dose.

## Do and don't

- **Do:** Keep the reminder intervals to the ACLS guideline the hospital uses.
- **Don't:** Treat the timers as orders; they are reminders.
