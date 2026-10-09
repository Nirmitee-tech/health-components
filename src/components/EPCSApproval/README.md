# EPCSApproval

EPCSApproval is the two-factor signing step for controlled-substance e-prescriptions: summary, PDMP check, PIN and token code.

**From the screens:** cpoe-erx (EPCS). Built from: Card, DescriptionList, PinEntry, TextField, Button, Alert.

## When to use

- Signing any C-II to C-V prescription.

## When not to use

- Non-controlled prescriptions.

## Variants and states

| Variant | What it is |
|---|---|
| pin | Waiting for factors. |
| done | Signed and sent. |
| locked | Too many failures. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `drug / schedule / sig / qty / prescriber / dea` | string | required |
| `pdmp / pharmacy / audit` | string | none |
| `state` | 'pin' \| 'done' \| 'locked' | 'pin' |
| `pin / error` | string | none |

## Usage

```jsx
<EPCSApproval drug="Oxycodone 5 mg" schedule="C-II" sig="..." qty={20} prescriber="Tom Reyes" dea="BR1234563" />
```

## Accessibility

- PIN dots announce progress.

## Do and don't

- **Do:** Show the PDMP check time.
- **Don't:** Store or prefill factors.
