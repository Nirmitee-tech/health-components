# BarcodeScanPrompt

BarcodeScanPrompt asks for one barcode scan (wristband, medication or witness badge), checks it against the expected code and shows match, mismatch or skipped.

**Built from:** Button, Icon. Every number goes through `CareOS.fmt` and renders as `ClinicalValue` (tabular figures, unit always shown, fixed precision per measure, reference range on hover, H / L / HH / LL flags).

## When to use

- Positive patient ID and drug scan in MAR, specimen collection, blood transfusion.

## When not to use

- Typing an MRN to search: Combobox.

## Variants and states

| Variant | What it is |
|---|---|
| waiting | Dashed outline, input focused for the scanner. |
| matched | Green, check icon, Rescan. |
| mismatch | Red, says "Do not give", shows expected and scanned. |
| override | Skipped with a reason (barcode damaged). |
| target | patient, medication or witness. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `target` | 'patient' | 'medication' | 'witness' | 'medication' |
| `expected` | string | none (accept any) |
| `expectedLabel` | string | none |
| `step` | number | none |
| `state` | 'waiting' | 'matched' | 'mismatch' | 'override' | internal |
| `defaultCode` | string | "" |
| `allowOverride` | boolean | false |
| `overrideReason` | string | "barcode damaged" |
| `autoFocus` | boolean | false |
| `onScan` | (code, ok) => void | none |
| `onOverride / onReset` | () => void | none |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | 'inpatient' when no global context is set |
| `onStateChange` | (state) => void, called on check, Cannot scan and Rescan | none |

## Usage

```jsx
<BarcodeScanPrompt step={2} target="medication" expected="NDC0409-7332" expectedLabel="cefTRIAXone 1 g" onScan={(c, ok) => ...} />
```

## Accessibility

- Group labelled by the instruction; result announced by a polite live region.
- Scanner input is a labelled text field so keyboard entry works.
- Mismatch uses an icon and words, not only red.

## Do and don't

- **Do:** Match on the full code; compare case-insensitively.
- **Don't:** Treat a match as proof the dose is right; it proves the barcode matches the order only.
