# SignaturePad

SignaturePad captures a patient or provider signature on consent forms, check-in and note signing.

**From the screens:** `.sig` (kiosk, consent-forms) and `.sigpad` (mobile, portal-forms): typed signature in Brush Script, 28px.

## When to use

- Consent to treat, HIPAA acknowledgement, financial policy, proxy access.

## When not to use

- Provider note signing that uses a PIN or password: PinEntry.

## Variants and states

| Variant | What it is |
|---|---|
| empty | "Tap to sign". |
| signed | Name in script ink with time stamp and Clear. |
| compact | 90px, phone screens. |
| error | "Signature is required to continue." |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `label` | string | "Signature" |
| `name` | string: signer | "patient" |
| `signed` | boolean | false |
| `when` | string: stamp | now |
| `compact` | boolean | false |
| `required` | boolean | false |
| `error` | string | none |
| `onSign` | () => void | none |

## Usage

```jsx
<SignaturePad label="Patient Signature" name={patient.name} required onSign={recordConsent} />
```

## Accessibility

- The pad is a button named "Tap to sign as Henna West", so it works without drawing.

## Do and don't

- **Do:** Show what the patient is signing above the pad.
- **Don't:** A signature with no date and time.
