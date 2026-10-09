# VitalSign

VitalSign is one vital tile: label, value, unit, High or Low flag (critical shaded), trend sparkline and time taken.

**From the screens:** pat-chart-vitals, enc-intake vitals, mob-patient. Built from: Badge, Sparkline.

## When to use

- Vitals panels and rooming.

## When not to use

- Lab values: LabResultTable.

## Variants and states

| Variant | What it is |
|---|---|
| normal | Plain. |
| H / L | Badge with arrow and word. |
| HH / LL | Critical: shaded tile. |
| trend | Sparkline. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `label` | string | required |
| `value` | string | required |
| `unit` | string | none |
| `flag` | 'H' \| 'L' \| 'HH' \| 'LL' | none |
| `trend` | number[] | none |
| `taken` | string | none |

## Usage

```jsx
<VitalSign label="Blood pressure" value="152/94" unit="mmHg" flag="H" trend={[132, 138, 145, 152]} taken="10:12 AM" />
```

## Accessibility

- Flag has a word and arrow, not only colour.

## Do and don't

- **Do:** Units always shown.
- **Don't:** Colour-only flags.
