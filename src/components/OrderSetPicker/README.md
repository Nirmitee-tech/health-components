# OrderSetPicker

OrderSetPicker shows order sets as tabs and lets the provider tick the labs, imaging, meds and referrals to sign together.

**From the screens:** cpoe-ordersets and cpoe-orders. Built from: Card, Tabs (pill), Checkbox, Badge, Button.

## When to use

- Common workups: diabetes follow-up, prenatal first visit, chest pain.

## When not to use

- One-off orders: DrugSearch or lab search.

## Variants and states

| Variant | What it is |
|---|---|
| sets | Tabs with counts. |
| defaults | Items on by default can be turned off. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `sets` | Array<{name, items: Array<{name, type, detail?, default?}>}> | required |
| `subtitle` | string | none |
| `current / defaultCurrent / onCurrentChange` | number: index of the shown set | 0 |
| `onSign` | (items, set) => void | none |

## Usage

```jsx
<OrderSetPicker sets={orderSets} />
```

## Accessibility

- Checkbox list with type tags.

## Do and don't

- **Do:** Show what each item will order.
- **Don't:** Sign without showing the count.
