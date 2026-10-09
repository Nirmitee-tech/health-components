# EligibilityResult

EligibilityResult shows the payer's 271 answer: active with benefits, inactive, an AAA error with what it means and what to do, or waiting.

**From the screens:** ins-elig ("Response (271)", "What it means", "What to do", AAA 72, 75, 42, 79, 57, Re-run, Fix coverage details, Self-pay Good Faith Estimate). Built from: Card, Alert, DescriptionList, ProgressBar, Spinner, Button.

## When to use

- After a 270 eligibility check; on check-in.

## When not to use

- Batch results: a DataTable with StatusTag eligibility.

## Variants and states

| Variant | What it is |
|---|---|
| active | Benefits list and deductible meter. |
| inactive | Error alert, fix actions. |
| error | AAA code, meaning, next step. |
| waiting | Spinner, "most answer in 1 to 5 seconds". |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `state` | 'active' \| 'inactive' \| 'error' \| 'waiting' | 'active' |
| `payer` | string | required |
| `headline` | string | by state |
| `aaa` | string: AAA code | none |
| `meaning / todo` | string | none |
| `benefits` | Array<[label, value]> | [] |
| `deductible` | [met, total] | none |
| `checkedAt` | string | none |

## Usage

```jsx
<EligibilityResult state="error" payer="Aetna" aaa="72" headline="Invalid member ID"
  meaning="Aetna has no member with that ID." todo="Check the card and fix the member ID, then Re-run." />
```

## Accessibility

- Result headline in an Alert with role status or alert.

## Do and don't

- **Do:** Say what the AAA code means in plain words.
- **Don't:** Show raw X12 to front desk staff.
