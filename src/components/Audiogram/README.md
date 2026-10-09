# Audiogram

Audiogram plots hearing thresholds for each ear from 250 to 8000 Hz with the standard symbols, shades the degree of loss, and lists every value with the pure tone average.

## When to use

- Audiology, ENT and occupational hearing results; hearing screening follow-up.

## When not to use

- A pass or refer newborn screen: a Badge.
- Tympanometry or speech-in-noise results on their own.

## Variants and states

| Variant | What it is |
|---|---|
| air conduction | Right ear red circles (O), left ear blue crosses (X), joined by lines. |
| bone conduction | Right < and left > beside the frequency, not joined. |
| no response | An arrow under the symbol at the limit of the audiometer. |
| degree bands | Normal up to 25, mild 26 to 40, moderate 41 to 55, moderately severe 56 to 70, severe 71 to 90, profound above 90 dB HL. |
| table | Each threshold, the 3-frequency pure tone average and a degree badge per ear. |
| speech | Optional speech results line. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `right / left` | {ac: {250: dB, ...}, bc?: {...}, nr?: number[] frequencies with no response} | required |
| `speech` | string | none |
| `title / subtitle` | string |  |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | the global context, else 'outpatient' |

## Clinical values

Every number goes through the shared clinical value rules (`CareOS.fmt` and `ClinicalValue` from the clinical-values card): tabular digits, the unit always shown, a fixed precision per measure, the reference range in the tooltip, and H, L or critical flags. Medication amounts follow the ISMP dose style through `fmt.doseNumber`: rounded to the stated precision, then shown with no trailing zero (5 mg, never 5.0 mg) and a leading zero (0.5 mL). The specialty measures this card adds sit in `CareOS.specialty.MEAS` with their precision: thresholds whole dB HL. Ranges in the previews are sample values for the design system, not clinical guidance; a real deployment passes its own.

## Usage

```jsx
<Audiogram right={{ ac: { 250: 15, 500: 20, 1000: 20, 2000: 35, 4000: 55, 8000: 60 } }} left={{ ac: { 250: 15, 500: 15, 1000: 20, 2000: 30, 4000: 50, 8000: 55 } }} />
```

## Accessibility

- Colour follows the audiology convention but every ear also has its own symbol shape.
- The chart label gives each ear’s average and degree; the table below has every value.
- Frequency and level axes are labelled in text.

## Do and don't

- **Do:** Use the standard symbols so audiologists can read it at a glance.
- **Do:** Show the table under the chart.
- **Don't:** Swap red and blue between ears.
- **Don't:** Draw bone conduction lines joined like air.
