# SigBuilder

SigBuilder builds the directions from dose, route, frequency and duration and shows the plain-language sig the patient will read.

**From the screens:** cpoe-rx-new. Built from: Card, TextField, Select, Alert.

## When to use

- Every new prescription.

## When not to use

- Free-text only sigs.

## Variants and states

| Variant | What it is |
|---|---|
| default | Structured fields with live preview. |
| C-II | Refills helper says none allowed. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `value` | {dose, route, freq, duration?, prn?, qty, refills, schedule?} | {} |

## Usage

```jsx
<SigBuilder value={{ dose: "1 tablet", route: "by mouth", freq: "twice daily", qty: 60, refills: 3 }} />
```

## Accessibility

- Preview is text, read by screen readers.

## Do and don't

- **Do:** Spell out frequency words.
- **Don't:** Latin abbreviations.
