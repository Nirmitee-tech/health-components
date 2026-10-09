# AbnormalFlag

AbnormalFlag marks a result as normal, low, high, critical or abnormal with a letter, an icon and a word, never colour alone.

**Foundation:** part of the clinical values set. Every number it shows comes from `CareOS.fmt`, so it matches every other component.

## When to use

- Next to a result value, in result tables and in the inbox.
- Standalone when only the interpretation is shown.

## When not to use

- Status of a workflow item: StatusTag.
- Allergy severity: AllergyBadge.

## Variants and states

| Variant | What it is |
|---|---|
| N | Normal, grey with a check. |
| L / H | Amber with down or up arrow. |
| LL / HH | Solid red with warning icon; ClinicalValue always shows the word. |
| A / AA | Abnormal and critical abnormal, for results with no direction. |
| full | Letter plus the word. |

## Props

| Prop | Type | Default |
|---|---|---|
| `flag` | 'N' \| 'L' \| 'H' \| 'LL' \| 'HH' \| 'A' \| 'AA' | required |
| `variant` | 'compact' \| 'full' | 'compact' |

## Usage

```jsx
<AbnormalFlag flag="HH" variant="full" />
```

## Accessibility

- role img with aria-label set to the full word (Critical high).
- Solid critical colours meet 4.5:1 for the white text.

## Do and don't

- **Do:** Use the codes from HL7 v2 OBX-8 / FHIR interpretation.
- **Don't:** Invent new letters; map them to these.
