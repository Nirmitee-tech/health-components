# MedicationRow

MedicationRow is one medication: name and strength, sig, quantity, refills, prescriber, pharmacy, last fill, and the DEA schedule tag for controlled drugs (C-II to C-V).

**From the screens:** pat-chart-medications, cpoe-erx, cpoe-refill, mob-rx. Built from: Icon, Badge, KebabMenu.

## When to use

- Inside MedicationList, refill queues, eRx review.

## When not to use

- Order entry: DrugSearch and SigBuilder.

## Variants and states

| Variant | What it is |
|---|---|
| controlled | Red shield tag C-II, C-III, C-IV or C-V. |
| PRN | Tag. |
| discontinued | Dimmed with tag. |
| source | Outside source tag, such as Surescripts history. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `med` | {name, sig, qty, refills?, prescriber?, pharmacy?, last?, schedule?, prn?, status?, source?} | required |
| `actions` | boolean | true |

## Usage

```jsx
<ul className="co-list"><MedicationRow med={{ name: "Oxycodone 5 mg tablet", sig: "1 tablet by mouth every 6 hours as needed for pain", qty: 20, refills: 0, schedule: "C-II" }} /></ul>
```

## Accessibility

- Schedule tag has a title with the full meaning.

## Do and don't

- **Do:** Show the sig in plain words.
- **Don't:** Abbreviations like "qd" or "u".
