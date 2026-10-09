# CodeDisplay

CodeDisplay shows a clinical or billing code with its code system label and description: ICD-10-CM, CPT, HCPCS, LOINC, SNOMED CT, RxNorm and NDC.

**Foundation:** part of the clinical values set. Every number it shows comes from `CareOS.fmt`, so it matches every other component.

## When to use

- Problem list, claim lines, order details, result headers, medication details.

## When not to use

- Code search and pick: Combobox.

## Variants and states

| Variant | What it is |
|---|---|
| inline | System tag, code, description on one line. |
| stacked | Tag and code above, description below. |
| no system | `showSystem={false}` in single-system tables. |
| inactive | Amber Inactive code note. |
| normalised | ICD-10 gets its dot (E119 to E11.9); 11-digit NDC shows 5-4-2. |

## Props

| Prop | Type | Default |
|---|---|---|
| `system` | 'icd10' \| 'cpt' \| 'hcpcs' \| 'loinc' \| 'snomed' \| 'rxnorm' \| 'ndc' | required |
| `code` | string | required |
| `display` | string | none |
| `variant` | 'inline' \| 'stacked' | 'inline' |
| `showSystem` | boolean | true |
| `status` | 'active' \| 'inactive' | 'active' |

## Usage

```jsx
<CodeDisplay system="icd10" code="E119" display="Type 2 diabetes mellitus without complications" />
```

## Accessibility

- The system tag is an abbr whose title is the FHIR system URI.

## Do and don't

- **Do:** Show the system: 99213 alone is ambiguous.
- **Don't:** Print full CPT descriptors without an AMA licence; use your licensed short text.
