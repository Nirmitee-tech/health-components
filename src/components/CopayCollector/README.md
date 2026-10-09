# CopayCollector

CopayCollector (PatientBalance) shows today's copay, prior balance and total, and collects by card, tap, cash or text link.

**From the screens:** sched-checkin, bill-patient-pay, rcm-textpay, portal-pay. Built from: Card, StatCard, Alert, TextField, RadioGroup, Button.

Also exported from this card: `PatientBalance`.

## When to use

- Check-in and checkout.

## When not to use

- Posting insurer payments: ERAPostingRow.

## Variants and states

| Variant | What it is |
|---|---|
| methods | Card on file, tap, cash, text link. |
| plan | Payment plan note. |
| skip | Skip needs a reason. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `patient` | string | required |
| `copay` | number | required |
| `prior` | number | 0 |
| `priorNote / plan / cardLast4` | string | none |
| `due` | number | copay |
| `defaultMethod` | 'card' \| 'tap' \| 'cash' \| 'text' | 'card' |
| `method` / `onMethodChange` | controlled method | none |
| `amount` / `onAmountChange` | controlled amount text | none |
| `onCollect` / `onSkip` | callbacks | none |

## Usage

```jsx
<CopayCollector patient="Henna West" copay={25} prior={40} cardLast4="Visa 4242" />
```

## Accessibility

- Amounts as text.

## Do and don't

- **Do:** Show what the balance is for.
- **Don't:** Charge without showing the amount on the button.
