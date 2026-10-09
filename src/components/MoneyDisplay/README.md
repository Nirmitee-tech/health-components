# MoneyDisplay

MoneyDisplay shows US dollar amounts with two decimals, grouping and tabular figures, and negative adjustments in parentheses.

**Foundation:** part of the clinical values set. Every number it shows comes from `CareOS.fmt`, so it matches every other component.

## When to use

- Charges, payments, adjustments, balances, copays, estimates.

## When not to use

- Counts or units of service: plain numbers.

## Variants and states

| Variant | What it is |
|---|---|
| positive | $1,234.50. |
| negative | ($45.00), read as "minus $45.00". |
| zero | $0.00. |
| missing | En dash when there is no amount. |
| emphasis | Bold, for balance due. |
| align end | Right aligned for columns. |

## Props

| Prop | Type | Default |
|---|---|---|
| `value` | number in dollars | required |
| `emphasis` | boolean | false |
| `align` | 'start' \| 'end' | 'start' |
| `label` | string: appended to the spoken text | none |

## Usage

```jsx
<MoneyDisplay value={-45} label="contractual adjustment" />
```

## Accessibility

- aria-label says "minus" for negatives; parentheses are not read reliably.

## Do and don't

- **Do:** Right-align money columns.
- **Don't:** Use red alone for negatives.
