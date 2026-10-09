# PrenatalFlowsheet

PrenatalFlowsheet tracks every prenatal visit in one table, gestational age, weight, blood pressure, urine, fundal height and fetal heart rate, with flags for hypertension, size and dates mismatch and abnormal heart rate.

## When to use

- Obstetric and midwifery prenatal visits from the first visit to delivery.

## When not to use

- Labor: a labor flowsheet and fetal monitoring strip.
- Postpartum visits.

## Variants and states

| Variant | What it is |
|---|---|
| header | EDD and how it was set, G/P, blood type, rubella, GBS and pre-pregnancy BMI. |
| risk badges | Warning badges for risks such as advanced maternal age or prior preterm birth. |
| BP flags | High above 139/89; severe range 160/110 or more turns the row red and shows an error Alert with the treatment window; 140/90 after 20 weeks shows a warning Alert. |
| size and dates | Fundal height more than 2 cm away from weeks after 20 weeks gets a badge. |
| FHR | Range 110 to 160 bpm; below 100 or above 180 is critical. |
| urine | Negative, trace, then 1+ warning and 2+ or more danger. |
| not yet | Fundal height before 20 weeks and Doppler before about 10 weeks read "Not yet". |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `header` | {edd, eddBy, gp, blood, rubella, gbs, bmi, risks: string[]} | {} |
| `visits` | Array<{date, ga: [weeks, days], wt, sbp, dbp, protein, glucose, fh, fhr, fm, pres, edema, by}> | [] |
| `title / subtitle` | string |  |
| `readOnly` | boolean | false |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | 'pregnancy' when no global context is set |
| `onAddVisit` | () => void | none |

## Clinical values

Every number goes through the shared clinical value rules (`CareOS.fmt` and `ClinicalValue` from the clinical-values card): tabular digits, the unit always shown, a fixed precision per measure, the reference range in the tooltip, and H, L or critical flags. Medication amounts follow the ISMP dose style through `fmt.doseNumber`: rounded to the stated precision, then shown with no trailing zero (5 mg, never 5.0 mg) and a leading zero (0.5 mL). The specialty measures this card adds sit in `CareOS.specialty.MEAS` with their precision: maternal weight 1 decimal kg, BP whole mmHg, fundal height whole cm, FHR whole bpm, GA as weeks and days. Ranges in the previews are sample values for the design system, not clinical guidance; a real deployment passes its own.

## Usage

```jsx
<PrenatalFlowsheet header={{ edd: "01/14/2027", eddBy: "8w US", gp: "G2 P1001" }} visits={[{ date: "10/09/2026", ga: [26, 3], wt: 71.4, sbp: 118, dbp: 74, protein: "neg", glucose: "neg", fh: 26, fhr: 148 }]} />
```

## Accessibility

- Gestational age has a spoken label in weeks and days.
- Critical rows have a red background and flags in words, never colour alone.
- The table scrolls sideways on small screens instead of squashing.

## Do and don't

- **Do:** Show GA on every row.
- **Do:** Repeat a severe-range BP and act within the window.
- **Don't:** Hide trace protein as normal.
- **Don't:** Compare fundal height before 20 weeks.
