# ICD10Picker

ICD10Picker searches ICD-10-CM by code or words, shows billable codes and the provider's favourites.

**From the screens:** Code search on enc-note, ai-coder, bill-claim-edit, pat-chart-problems. Built from: Combobox (code), FilterChip.

## When to use

- Diagnoses on notes, problems, orders and claims.

## When not to use

- Procedures: CPTPicker.

## Variants and states

| Variant | What it is |
|---|---|
| search | By code or words. |
| favorites | Chips for frequent codes. |
| no match | Help text. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `options` | Array<{code, label}> | required |
| `favorites` | Array<{code, short}> | none |
| `label` | string | "Diagnosis (ICD-10-CM)" |
| `onSelect` | ({code, label}) => void | none |
| `defaultQuery / defaultOpen` | string / boolean |  |
| `value / defaultValue` | string: selected code (highlights its favourite chip) | none |
| `placeholder / error / required` | string / string / boolean | as Combobox |

## Usage

```jsx
<ICD10Picker options={icd10} favorites={[{ code: "E11.9", short: "T2DM" }]} onSelect={addDx} />
```

## Accessibility

- Combobox pattern.

## Do and don't

- **Do:** Pick the most specific billable code.
- **Don't:** Allow header codes on claims.
