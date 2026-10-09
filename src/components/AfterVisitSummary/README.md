# AfterVisitSummary

AfterVisitSummary is the plain-language discharge summary a patient takes home: why they were here, last results, new, changed, continued and stopped medicines, appointments, home care and warning signs.

## When to use

- Printed at discharge and sent to the patient portal.

## When not to use

- Clinician discharge summary for the next provider; that is a note.

## Variants and states

| Variant | What it is |
|---|---|
| medicine groups | New, Changed, Keep taking, Stop, each shown only if present. |
| results | Last values with range so the patient can compare at follow-up. |
| other language | Info alert that a translated copy prints too. |
| warnings | Red box with when to call 911. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `patient / dates` | string | none |
| `reason` | string: plain words | required |
| `meds` | Array of { name, dose, unit, route, freq, action: new \| changed \| continue \| stop, note } | [] |
| `results` | Array of { measure, value, range } | [] |
| `followups` | Array of { when, with, where } | [] |
| `instructions / warnings` | string[] | none |
| `language` | string | 'English' |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | 'inpatient' when no global context is set |
| `onPrint / onSendToPortal` | function: the Print and Send to Portal buttons | none |

## Clinical values

Every number goes through the clinical value rules: tabular digits, unit always shown, fixed precision per measure (temperature 0.1 °C, potassium 0.1 mmol/L, creatinine 0.01 mg/dL, heart rate whole bpm), the reference range in the tooltip and H, L, H! or L! flags. Doses drop trailing zeros and keep a leading zero (0.5 mg, 5 mg).

## Usage

```jsx
<AfterVisitSummary patient="Grace Okafor" reason="Your heart was not pumping well..." meds={meds} followups={appts} warnings={redFlags} />
```

## Accessibility

- Headings for each section so screen readers can jump.
- Written at about a sixth-grade reading level; no abbreviations like BID.

## Do and don't

- **Do:** Say what changed and why in one line per medicine.
- **Don't:** Print "q12h" or "PRN" to a patient.
