# InsuranceCard

InsuranceCard shows the front and back of a member card with the fields billing needs and the scan state.

**From the screens:** pat-chart-insurance "View card images", kiosk-checkin and portal insurance capture. Built from: DescriptionList, SegmentedControl, Badge, Button.

## When to use

- Check-in and coverage review.

## When not to use

- Coverage order: CoverageStack.

## Variants and states

| Variant | What it is |
|---|---|
| front / back | Toggle. |
| scanned | Badge with date, or Scan Card. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `payer / plan / member / memberId / group / copay / rx` | string | front |
| `payerId / claimsAddress / phone / precert` | string | back |
| `side` | 'front' \| 'back' | 'front' |
| `scanned` | string | none |

## Usage

```jsx
<InsuranceCard payer="Aetna" plan="Open Access PPO" memberId="W123456789" scanned="10/09/2026" />
```

## Accessibility

- role img with payer and side.

## Do and don't

- **Do:** Show the payer ID for claims.
- **Don't:** Show a card image without the typed fields.
