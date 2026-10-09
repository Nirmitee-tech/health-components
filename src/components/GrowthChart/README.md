# GrowthChart

GrowthChart plots a child’s measurements against WHO (birth to 24 months) or CDC (2 to 20 years) percentile lines and names the percentile band of every point.

This version replaces the earlier GrowthChart. Built-in curves are rounded illustrations for the preview; production must pass `curves` built from the published WHO or CDC LMS tables for the right sex and measure.

## When to use

- Well-child visits, failure to thrive and obesity follow-up, endocrine and nutrition clinics.

## When not to use

- Preterm infants before 2 years corrected: a Fenton chart.
- Adult weight trends: LineChart.

## Variants and states

| Variant | What it is |
|---|---|
| WHO 0-2 | Weight-for-age in kg to 0.01, ages in months, 3rd to 97th lines. |
| CDC 2-20 | BMI-for-age in kg/m² to 0.1, ages in years, 5th to 95th lines. |
| edge lines | Outer percentiles in warning colour; 50th solid. |
| band badge | Latest point: "Between the 50th and 85th" (success) or above or below the outer lines (warning). |
| table | Every plotted point with date, age, value and band. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `standard` | 'who' \| 'cdc' | 'who' |
| `measure` | 'weight' \| 'bmi' \| string | 'weight' |
| `sex` | 'male' \| 'female' | 'male' |
| `points` | Array<[age, value, date?]> | [] |
| `curves` | {unit, ages, ageUnit: mo\|y, lines: {percentile: number[]}, title} | built-in sample |
| `onStandardChange` | function | none |
| `title / subtitle / note` | string |  |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | the global context, else 'outpatient' |
| `defaultStandard` | 'who' \| 'cdc': first standard when `standard` is not controlled | 'who' |
| `percentiles / ages / unit / min / max` | earlier API: percentile values per age in months, axis bounds; use `curves` instead | none |

## Clinical values

Every number goes through the shared clinical value rules (`CareOS.fmt` and `ClinicalValue` from the clinical-values card): tabular digits, the unit always shown, a fixed precision per measure, the reference range in the tooltip, and H, L or critical flags. Medication amounts follow the ISMP dose style through `fmt.doseNumber`: rounded to the stated precision, then shown with no trailing zero (5 mg, never 5.0 mg) and a leading zero (0.5 mL). The specialty measures this card adds sit in `CareOS.specialty.MEAS` with their precision: infant weight 2 decimals kg, BMI 1 decimal kg/m². Ranges in the previews are sample values for the design system, not clinical guidance; a real deployment passes its own.

## Usage

```jsx
<GrowthChart standard="cdc" measure="bmi" points={[[8, 17.2, "03/2022"], [10, 19.8, "03/2024"]]} curves={cdcBmiBoys} />
```

## Accessibility

- The SVG label lists every point; each point also has a title.
- The band is stated in words in a badge and in the table.
- The 50th line is solid, others dashed, so they differ without colour.

## Do and don't

- **Do:** Pick WHO under 2 years and CDC from 2 years.
- **Do:** Plot every measurement, not only the latest.
- **Don't:** State an exact percentile from the drawn lines.
- **Don't:** Ship the sample curves.
