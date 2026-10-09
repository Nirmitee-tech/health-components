# AllergyList

AllergyList is the Allergies card: each allergy with type, reaction, severity and status, plus the NKA and not-reviewed states.

**From the screens:** pat-chart-allergies and the allergy review step in enc-intake. Built from: Card, Badge, KebabMenu, Alert.

## When to use

- Chart Allergies section, intake review.

## When not to use

- Banners: AllergyBadge.

## Variants and states

| Variant | What it is |
|---|---|
| list | Rows with severity tags. |
| NKA | Empty array: green No Known Allergies. |
| not reviewed | undefined: amber warning before prescribing. |
| readOnly | No actions. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `items` | Array<{substance, type?, reaction?, severity, onset?, status?}> \| [] \| undefined | undefined |
| `reviewed` | string: date | none |
| `readOnly` | boolean | false |

## Usage

```jsx
<AllergyList items={allergies} reviewed="10/09/2026 by Lisa Chen RN" />
```

## Accessibility

- Severity has icon and word.

## Do and don't

- **Do:** Record "Entered in Error" instead of deleting.
- **Don't:** Treat an empty list as "no allergies" when nobody asked.
