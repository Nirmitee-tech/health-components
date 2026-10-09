# PinEntry

PinEntry is a 4 to 6 digit keypad with dots, for mobile sign-in and quick re-authentication.

**From the screens:** `.pin` grid and `.pk` keys (56px, radius 12) on mob-login.

## When to use

- Unlocking the mobile EHR, confirming an e-prescription for controlled substances (with the second factor).

## When not to use

- First sign-in: use username and password with 2FA.

## Variants and states

| Variant | What it is |
|---|---|
| empty | Hollow dots. |
| partial | Filled dots for entered digits. |
| error | Red dots and message. |
| biometric | Face ID key in the bottom left. |
| locked | Keys disabled after too many tries. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `length` | number | 4 |
| `value` | string | "" |
| `label` | string | none |
| `error` | string | none |
| `biometric` | boolean | false |
| `locked` | boolean | false |
| `lockedText` | string |  |
| `onComplete` | (pin) => void | none |
| `onBiometric` | () => void | none |

## Usage

```jsx
<PinEntry length={4} label="Enter your PIN" biometric onComplete={unlock} error={pinError} />
```

## Accessibility

- Dots have role status with "N of 4 digits entered".
- The delete key is named "Delete last digit".
- Keys are 56px tall, above the 44px touch minimum.

## Do and don't

- **Do:** Offer Face ID next to the PIN.
- **Don't:** Show the digits.
