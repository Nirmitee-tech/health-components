# AnesthesiaRecord

AnesthesiaRecord is the intraoperative record: vitals every 5 minutes as a trend and a grid, case events, medications given, airway details and fluid totals.

**From the screens:** New for the perioperative module. Built from: Card, Badge, Button, Alert, DescriptionList.

**Values:** Every number goes through the shared value rules (`CareOS.acuteFmt.format`): tabular figures, unit always shown, fixed decimals per measure, reference range in the hover title, and H, L or critical tags. Colour is never the only signal: flags carry words and an icon.

## When to use

- During and after a case, by the anesthesia provider.

## When not to use

- PACU vitals: VitalsPanel.

## Variants and states

| Variant | What it is |
|---|---|
| in progress | Add Event and Give Medication actions. |
| flagged cells | Out-of-range values in red with H, L, HH or LL. |
| not recorded | n/r in a cell. |
| events | Dashed lines labelled Induction, Incision. |
| controlled drugs | C-II tag on fentanyl and similar. |
| alert | Critical event banner, such as hypotension. |
| signed | Locked. |
| no airway | Airway not documented, such as MAC cases. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `times` | string[] 'HH:MM' | required |
| `vitals` | {hr?, bp?: [sys,dia][], map?, spo2?, etco2?, temp?}: arrays aligned to times | required |
| `events` | Array<{time, label}> | [] |
| `meds` | Array<{time, drug, dose, unit, route, controlled?, dp?}> | [] |
| `airway` | {device, size, sizeUnit?, view, attempts, depth, confirm} | none |
| `totals` | {fluids?, ebl?, urine?} mL | {} |
| `alert` | {title, body} | none |
| `readOnly` | boolean | false |
| `onAddEvent` / `onGiveMedication` | () => void: header actions | none |
| `subtitle` | string | none |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | 'ed' when no global context is set |

## Usage

```jsx
<AnesthesiaRecord times={times} vitals={vitals} meds={meds} airway={airway} totals={{ fluids: 1200, ebl: 150, urine: 220 }} />
```

## Accessibility

- Grid has a caption and row headers; each value has a range title.
- Chart has an aria-label with the heart rate series.

## Do and don't

- **Do:** Record dose units every time.
- **Don't:** Write trailing zeros like 2.0 mg.
