# ClaimStatusTag

ClaimStatusTag names where a claim is in the X12 cycle: 837 sent, 999 accepted or rejected, 277CA, 277 pending and 835 paid, partial or denied.

**From the screens:** bill-claims, bill-clearinghouse, bill-rejections, bill-era. Built from: Badge.

## When to use

- Claim lists and claim detail.

## When not to use

- Simple business status: StatusTag kind claim.

## Variants and states

| Variant | What it is |
|---|---|
| states | Ready to Send, Sent (837), Accepted (999), Rejected (999), Accepted (277CA), Rejected (277CA), Pending (277), Paid (835), Partially Paid (835), Denied (835), Appealed. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `status` | one of ClaimStatusTag.statuses | required |

## Usage

```jsx
<ClaimStatusTag status="Rejected (277CA)" />
```

## Accessibility

- Icon plus words; title explains the step.

## Do and don't

- **Do:** Show the transaction in brackets.
- **Don't:** Mix with internal workflow words.
