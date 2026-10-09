# LevelOfCareBadge

LevelOfCareBadge shows how much monitoring a patient needs, from observation to ICU, and a pending change in level.

## When to use

- Bed board, census, ADT and transfer review, next to the patient or the unit.

## When not to use

- Billing status alone; observation vs inpatient status has its own rules and is shown in ADTPanel.

## Variants and states

| Variant | What it is |
|---|---|
| icu, nicu | Danger tone. |
| stepdown, boarding | Warning tone. |
| tele, l-d | Info tone. |
| medsurg, psych | Neutral. |
| obs | AI purple, so it stands apart: observation is an outpatient status. |
| pendingTo | Shows "ICU -> Step-down pending". |
| compact | Label only. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `level` | 'icu' \| 'stepdown' \| 'tele' \| 'medsurg' \| 'obs' \| 'boarding' \| 'l-d' \| 'nicu' \| 'psych' | required |
| `pendingTo` | level: a requested change | none |
| `compact` | boolean | false |
| `size` | 'sm' \| 'md' | 'md' |

## Usage

```jsx
<LevelOfCareBadge level="icu" pendingTo="stepdown" />
```

## Accessibility

- Full level name is in the tooltip; the arrow is read as text.

## Do and don't

- **Do:** Show a pending downgrade so nobody assigns an ICU bed twice.
- **Don't:** Use it for acuity scores; those are numbers with their own scale.
