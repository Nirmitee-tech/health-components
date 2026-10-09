# UnitToggle

UnitToggle shows a stored measurement in the unit the reader picks (lb or kg, in or cm, °F or °C, mg/dL or mmol/L), converting value and range with exact factors.

**Foundation:** part of the clinical values set. Every number it shows comes from `CareOS.fmt`, so it matches every other component.

## When to use

- Weight, height and temperature where staff and patients use different units.
- Glucose, creatinine and A1c for clinicians trained on SI units.

## When not to use

- Data entry: the input stores one canonical unit; use TextField with a unit suffix.
- Doses: never convert a dose for display.

## Variants and states

| Variant | What it is |
|---|---|
| weight | kg / lb, 1 dp. |
| height | cm / in, 1 dp. |
| temp | °C / °F, 1 dp. |
| glucose | mg/dL 0 dp / mmol/L 1 dp. |
| creatinine | mg/dL 2 dp / µmol/L 0 dp. |
| a1c | % 1 dp / mmol/mol 0 dp. |
| showStored | Shows the stored value under the converted one. |

## Props

| Prop | Type | Default |
|---|---|---|
| `kind` | 'weight' \| 'height' \| 'temp' \| 'glucose' \| 'creatinine' \| 'a1c' | required |
| `value` | number in `unit` | required |
| `unit` | UCUM code of the stored value | required |
| `defaultUnit / displayUnit` | UCUM: uncontrolled start / controlled | first unit |
| `onChange` | (unit) => void | none |
| `showStored` | boolean | false |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | the global context, else 'outpatient' |

## Usage

```jsx
<UnitToggle kind="weight" value={36.3} unit="kg" defaultUnit="[lb_av]" showStored />
```

## Accessibility

- Unit buttons are a labelled group of toggle buttons with aria-pressed.
- The converted value keeps its flag and range.

## Do and don't

- **Do:** Convert from the stored number.
- **Don't:** Store the converted, rounded number back.
