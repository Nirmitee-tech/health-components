# VitalsPanel

VitalsPanel groups VitalSign tiles in a Card with Enter Vitals.

**From the screens:** pat-chart-vitals and enc-intake ("Entered by nursing during rooming. Provider can correct."). Built from: Card, VitalSign.

## When to use

- Chart summary, rooming.

## When not to use

- Long-term graphs: LineChart.

## Variants and states

| Variant | What it is |
|---|---|
| editable | Enter Vitals. |
| readOnly | No button. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `items` | VitalSign props[] | required |
| `subtitle` | string | none |
| `readOnly` | boolean | false |

## Usage

```jsx
<VitalsPanel subtitle="Entered by Lisa Chen RN, 10:12 AM" items={vitals} />
```

## Accessibility

- Grid of tiles in reading order.

## Do and don't

- **Do:** Show who entered and when.
- **Don't:** Hide abnormal values below the fold.
