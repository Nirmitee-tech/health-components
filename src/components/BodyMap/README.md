# BodyMap

BodyMap marks numbered lesions on a body outline with a matching list, for dermatology and wound care.

**From the screens:** Dermatology Skin Exam template in enc-note ("Skin Check" visit type). Built from: Card, SVG, Badge.

## When to use

- Skin checks, wound location, injection sites.

## When not to use

- Photo comparison: Documents.

## Variants and states

| Variant | What it is |
|---|---|
| monitor | Primary pin. |
| concern | Red pin, Biopsy tag. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `marks` | Array<{x, y, site, desc, concern?}> in a 200 by 260 frame | [] |
| `title / subtitle` | string |  |

## Usage

```jsx
<BodyMap marks={[{ x: 92, y: 90, site: "Left upper chest", desc: "6 mm irregular border", concern: true }]} />
```

## Accessibility

- List repeats every mark in text.

## Do and don't

- **Do:** Number marks in order.
- **Don't:** Rely on the drawing alone.
