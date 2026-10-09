# DoseDisplay

DoseDisplay writes a medication dose the ISMP way: tall-man drug names, leading zero, no trailing zero, and units, mcg and mL spelled safely.

**Foundation:** part of the clinical values set. Every number it shows comes from `CareOS.fmt`, so it matches every other component.

## When to use

- Medication lists, MAR rows, order review, prescription preview, discharge instructions.

## When not to use

- Lab or vital values: ClinicalValue.
- Free-text sigs from outside sources: show verbatim and label as external.

## Variants and states

| Variant | What it is |
|---|---|
| stacked | Drug and strength above, dose and sig below (default). |
| inline | One line for tables. |
| highAlert | Red High-alert badge (insulin, heparin, opioids). |
| lookAlike | Amber badge naming the look-alike drug. |
| weight-based | `perKg` and `weightKg` show the calculation. |

## Props

| Prop | Type | Default |
|---|---|---|
| `drug` | string: tall-man applied automatically | required |
| `amount / unit` | number \| string / mg, mcg, g, units, mL, mEq... | required |
| `strength / strengthUnit / form` | number / string / string | none |
| `route / frequency` | string | none |
| `prn / prnReason` | boolean / string | false |
| `perKg / weightKg` | number | none |
| `highAlert` | boolean | false |
| `lookAlike` | string | none |
| `layout` | 'stacked' \| 'inline' | 'stacked' |

## Usage

```jsx
<DoseDisplay drug="hydroxyzine" strength={25} unit="mg" form="tablet" amount={25} route="PO" frequency="every 6 hours" prn prnReason="itching" lookAlike="hydralazine" />
```

## Accessibility

- Tall-man capitals are read normally by screen readers; the visual cue is for sighted readers.
- Badges carry text, not colour alone.

## Do and don't

- **Do:** Pass numbers; let fmt drop the trailing zero.
- **Don't:** Write "U", "IU", "cc", "µg" or ".5" anywhere on screen.
