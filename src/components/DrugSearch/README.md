# DrugSearch

DrugSearch finds a medication with form, RxNorm, plan coverage and DEA schedule shown in each result.

**From the screens:** cpoe-rx-new and cpoe-erx (Surescripts formulary). Built from: Combobox.

## When to use

- Starting a new prescription.

## When not to use

- Picking from the current list: MedicationList.

## Variants and states

| Variant | What it is |
|---|---|
| covered / prior auth | Coverage text in meta. |
| controlled | Schedule badge. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `options` | Array<{label, form?, rxnorm?, coverage?, schedule?}> | required |
| `payer` | string | none |
| `onSelect` | (drug) => void | none |
| `defaultQuery / defaultOpen` | string / boolean |  |

## Usage

```jsx
<DrugSearch payer="Aetna" options={drugs} onSelect={setDrug} />
```

## Accessibility

- Combobox pattern.

## Do and don't

- **Do:** Show coverage before the provider picks.
- **Don't:** Hide the schedule.
