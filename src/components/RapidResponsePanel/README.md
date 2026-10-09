# RapidResponsePanel

RapidResponsePanel supports a rapid response call: who called and why, vitals against calling criteria, recent labs, what has been done, outcome, and escalation to Code Blue.

## When to use

- Rapid response team documentation at the bedside.

## When not to use

- Pulseless patient: CodeBlueTimer.

## Variants and states

| Variant | What it is |
|---|---|
| active | Timer since call, outcome not chosen, Close off. |
| meets criteria | Critical vitals listed under the reason and tiles in red. |
| closed | Outcome chosen. |
| readOnly | Review. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `patient / location / calledBy / reason` | string | required |
| `calledAt / now` | number: epoch ms | now / live |
| `vitals / labs` | Array of { measure, value, range, taken } | [] |
| `interventions` | Array of { at, text } | [] |
| `outcome` | string | none |
| `onEscalate` | function | none |
| `readOnly` | boolean | false |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | 'inpatient' when no global context is set |
| `outcomeValue / onOutcomeChange` | controlled outcome; onOutcomeChange(outcome) | uncontrolled from `outcome` |
| `onClose` | function(outcome): Close Call | none |

## Clinical values

Every number goes through the clinical value rules: tabular digits, unit always shown, fixed precision per measure (temperature 0.1 °C, potassium 0.1 mmol/L, creatinine 0.01 mg/dL, heart rate whole bpm), the reference range in the tooltip and H, L, H! or L! flags. Doses drop trailing zeros and keep a leading zero (0.5 mg, 5 mg).

## Usage

```jsx
<RapidResponsePanel patient="Kowalski, Anna" location="4 West 403A" reason="SpO2 86% on 4 L" vitals={vitals} />
```

## Accessibility

- Timer has role timer.
- Criteria are in words, not only the red tile.

## Do and don't

- **Do:** Pass the hospital's own calling criteria ranges.
- **Don't:** Hide Escalate to Code Blue behind a menu.
