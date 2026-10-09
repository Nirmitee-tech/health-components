# ConsentSigner

ConsentSigner shows a consent document in a scroll box with agree, signature and guardian fields.

**From the screens:** consent-forms, kiosk-checkin and portal-forms (`.consentdoc`, `.sig`). Built from: Card, Checkbox, SignaturePad, TextField, Button.

## When to use

- Consent to treat, telehealth consent, HIPAA notice, financial policy.

## When not to use

- Unsigned information pages.

## Variants and states

| Variant | What it is |
|---|---|
| patient | Patient signs. |
| guardian | Relationship field. |
| signed | Pre-signed state. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `title / version / body` | string | required |
| `signer` | string | required |
| `guardian` | string | none |
| `agreed / signed` | boolean | false |
| `agreeLabel / signerLabel` | string |  |
| `compact` | boolean | false |
| `agreedValue / onAgreedChange` | boolean / (agreed) => void | uncontrolled |
| `onSignedChange` | (signed) => void | none |
| `onSignConsent / onDecline` | ({signer, guardian?}) => void / () => void | none |

## Usage

```jsx
<ConsentSigner title="Telehealth Consent" version="v3, 01/2026" body={text} signer="Henna West" />
```

## Accessibility

- Document region is focusable for keyboard scroll.

## Do and don't

- **Do:** Version and date on every consent.
- **Don't:** Sign without showing the text.
