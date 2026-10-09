# ReferenceRangeBar

ReferenceRangeBar places a result on a bar showing the normal band and critical zones, so distance from normal reads at a glance.

**Foundation:** part of the clinical values set. Every number it shows comes from `CareOS.fmt`, so it matches every other component.

## When to use

- Result detail drawers, patient-facing result views, trend reviews.

## When not to use

- Dense tables: use ClinicalValue with its tooltip.
- Results with no numeric range.

## Variants and states

| Variant | What it is |
|---|---|
| in range | Ink marker inside the green band. |
| low / high | Amber marker outside the band. |
| critical | Red marker inside a red zone. |
| one-sided range | eGFR ≥60 or LDL ≤99: band runs to the edge. |
| no header | `showHeader={false}` for the bar only. |

## Props

| Prop | Type | Default |
|---|---|---|
| `value` | number | required |
| `measure / loinc` | string | none |
| `refLow / refHigh / critLow / critHigh` | number | from measure |
| `min / max` | number: bar ends | auto with 12% padding |
| `label` | string | measure label |
| `showHeader` | boolean | true |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | the global context, else 'outpatient' |

## Usage

```jsx
<ReferenceRangeBar measure="potassium" value={5.4} />
```

## Accessibility

- The bar is role img with one sentence: name, value, unit, range and flag.
- Marker colour repeats the flag; the header shows the flag letter and icon.

## Do and don't

- **Do:** Pass the lab range when it differs from the sample.
- **Don't:** Use it for values with no range; it implies a normal band.
