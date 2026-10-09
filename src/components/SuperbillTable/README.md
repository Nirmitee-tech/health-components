# SuperbillTable

SuperbillTable is the tick-box fee sheet grouped by visit type with fees and a running total.

**From the screens:** bill-superbill. Built from: Card, fieldset checkboxes, code chips, Button.

## When to use

- Paper-style coding at checkout in small practices.

## When not to use

- Full claim edit: ClaimForm.

## Variants and states

| Variant | What it is |
|---|---|
| groups | Office visits, procedures, labs, by specialty. |
| selected | Highlighted rows, total. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `groups` | Array<{name, codes: Array<{code, label, fee}>}> | required |
| `defaultSelected` | string[]: initial ticked codes | [] |
| `selected` / `onSelectedChange` | string[]: controlled ticked codes | none |
| `subtitle` | string | none |

## Usage

```jsx
<SuperbillTable groups={feeSheet} defaultSelected={["99214"]} onSend={sendToBilling} />
```

## Accessibility

- Real checkboxes with labels.

## Do and don't

- **Do:** Use the practice fee schedule.
- **Don't:** Hardcode fees.
