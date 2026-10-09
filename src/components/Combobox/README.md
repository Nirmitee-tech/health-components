# Combobox

Combobox is a search field with a result list, for finding a patient or an ICD-10 or CPT code.

**From the screens:** Shell patient search (Search patients by name, MRN or DOB) and the code pickers on bill-claim-edit, ai-coder, cpoe-lab (28 screens).

## When to use

- Picking from a long list by typing: patients, ICD-10, CPT, payers, pharmacies.

## When not to use

- Short fixed lists: Select.

## Variants and states

| Variant | What it is |
|---|---|
| patient | Avatar, name, DOB and MRN per row; flags such as Restricted show as a badge. |
| code | Code chip then description: "E11.9 Type 2 diabetes mellitus without complications". |
| no results | Message with what to try next. |
| error | Field error under the input. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `label` | string | required |
| `kind` | 'patient' \| 'code' \| 'plain' | 'plain' |
| `options` | Array<{value?, label, meta?, code?, flag?, flagTone?}> | required |
| `placeholder` | string |  |
| `defaultQuery` | string | "" |
| `defaultOpen` | boolean | false |
| `onSelect` | (option) => void | none |
| `limit` | number | 8 |
| `emptyText` | string | "No matches. Check the spelling or search by MRN." |
| `footer` | node, under the list | none |

## Usage

```jsx
<Combobox label="Patient" kind="patient" options={patients.map(p => ({ value: p.id, label: p.name, meta: p.dob + " . " + p.mrn }))} onSelect={openChart} />
<Combobox label="Diagnosis (ICD-10)" kind="code" options={icd10} onSelect={addDx} />
```

## Accessibility

- ARIA combobox pattern: role combobox, aria-expanded, aria-controls, aria-activedescendant; options have role option.
- Arrow keys move, Enter picks, Escape closes.
- A name match is a candidate, not a confirmed patient. Show DOB and MRN in every row so staff confirm identity before opening the chart.

## Do and don't

- **Do:** Show DOB and MRN with every patient result.
- **Do:** Search ICD-10 by code or by words.
- **Don't:** Auto-select the first match on blur.
