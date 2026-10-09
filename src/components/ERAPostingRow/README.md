# ERAPostingRow

ERAPostingRow is one ERA (835) service line to post: billed, allowed, paid, contractual and patient amounts, CARC and RARC codes, balance check and Post.

**From the screens:** bill-era ("ERA Posted and Closed Successfully"), rcm-denials. Built from: Badge, Button.

## When to use

- Payment posting.

## When not to use

- Patient payments: CopayCollector.

## Variants and states

| Variant | What it is |
|---|---|
| balanced | Post enabled. |
| out of balance | Red border, amount, Post disabled. |
| codes | Group-CARC with amount; RARC tags with titles. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `row` | {patient, cpt, dos, claim, billed, allowed, paid, patientResp?, adjustments?: [{group, code, amount, text}], remarks?: [{code, text}]} | required |

## Usage

```jsx
<ERAPostingRow row={{ patient: "Henna West", cpt: "99214", billed: 182, allowed: 118.4, paid: 93.4, patientResp: 25, adjustments: [{ group: "CO", code: "45", amount: 63.6 }] }} />
```

## Accessibility

- Codes have titles with their meaning.

## Do and don't

- **Do:** Explain CO-45 and PR-2 on hover.
- **Don't:** Post an out-of-balance line.
