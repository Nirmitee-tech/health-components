# LabResultTable

LabResultTable shows a lab panel with value, H, L and critical flags, reference range, units, trend and collection time, plus sign and route.

**From the screens:** cpoe-lab-results and portal-results; critical value handling from clin-inbox. Built from: Card, Alert, Badge, Sparkline, Button.

## When to use

- Reviewing and signing lab results.

## When not to use

- Ordering labs: OrderSetPicker.

## Variants and states

| Variant | What it is |
|---|---|
| normal | "Normal" in muted text. |
| H / L | Badge. |
| HH / LL | Row shaded red, alert icon, Critical value alert on top. |
| sign | Sign and Notify Patient. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `rows` | Array<{test, loinc?, value, flag?, range, units, trend?, collected}> | required |
| `title / subtitle` | string |  |
| `critical` | string | none |
| `onSign` | () => void | none |
| `actions` | node | none |

## Usage

```jsx
<LabResultTable title="Basic metabolic panel" rows={bmp} critical="Potassium 6.1 mmol/L" onSign={sign} />
```

## Accessibility

- Flags in words; table semantics.

## Do and don't

- **Do:** Show the lab's own reference range.
- **Don't:** Round values the lab sent.
