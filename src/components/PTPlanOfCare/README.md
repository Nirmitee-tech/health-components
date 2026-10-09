# PTPlanOfCare

PTPlanOfCare shows a therapy plan of care: diagnosis and certification, visits used against the authorization, functional outcome scores against their minimal important change, and short and long term goals.

## When to use

- Physical, occupational and speech therapy evaluations, progress notes and recertifications.

## When not to use

- A single visit note: the daily note template.
- Authorization requests: PriorAuthCard.

## Variants and states

| Variant | What it is |
|---|---|
| authorization meter | Primary under 80%, warning from 80%, danger at 100%; two visits or fewer left asks for more now. |
| progress note due | Warning badge at 10 visits since the last progress note. |
| scores | Each measure with baseline, current, signed change and MCID: Change beyond MCID (success), better but under MCID (info), no improvement (danger). |
| goals | Short and long term goals with baseline, current and target values and status Met, Progressing, Not met or New. |
| readOnly | Hides actions. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `diagnosis / cert / frequency / referring` | string |  |
| `auth` | {used, authorized, payer, expires} | required |
| `visitsSinceProgressNote` | number | 0 |
| `scores` | Array<{name, range, k, baseline, current, mcid, higherBetter}> | [] |
| `goals` | Array<{term, text, k, baseline, current, target, status}> | [] |
| `title / subtitle` | string |  |
| `readOnly` | boolean | false |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | the global context, else 'outpatient' |
| `progressNoteDue` | boolean: show Progress note due before visit 10 | false |
| `onProgressNote / onSendForCertification` | () => void: header actions | none |

## Clinical values

Every number goes through the shared clinical value rules (`CareOS.fmt` and `ClinicalValue` from the clinical-values card): tabular digits, the unit always shown, a fixed precision per measure, the reference range in the tooltip, and H, L or critical flags. Medication amounts follow the ISMP dose style through `fmt.doseNumber`: rounded to the stated precision, then shown with no trailing zero (5 mg, never 5.0 mg) and a leading zero (0.5 mL). The specialty measures this card adds sit in `CareOS.specialty.MEAS` with their precision: scores whole points or percent, range of motion whole degrees, pain whole numbers out of 10. Ranges in the previews are sample values for the design system, not clinical guidance; a real deployment passes its own.

## Usage

```jsx
<PTPlanOfCare auth={{ used: 9, authorized: 12, payer: "Aetna" }} scores={[{ name: "LEFS", k: "pts", baseline: 32, current: 51, mcid: 9, higherBetter: true }]} goals={[]} />
```

## Accessibility

- The authorization meter has a value text in words.
- Change is signed and the meaning is a word badge.
- Goals and scores are tables with captions.

## Do and don't

- **Do:** Show MCID next to every change.
- **Do:** Warn before the last authorized visit, not after it.
- **Don't:** Call a change an improvement when it is under MCID.
- **Don't:** Count unsigned notes as used visits.
