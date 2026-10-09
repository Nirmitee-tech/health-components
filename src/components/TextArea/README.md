# TextArea

TextArea takes multi-line text such as a reason for visit, a denial note or a message to the patient.

**From the screens:** `textarea.inp` (min-height 76px, padding 8px 10px) on 80 screens.

## When to use

- Notes, reasons, appeal letters, messages.

## When not to use

- Structured clinical data that should be coded (diagnoses, allergies): use Combobox.

## Variants and states

| Variant | What it is |
|---|---|
| default | Grows with rows, user can resize vertically. |
| counter | maxLength shows "N / max" under the field, announced politely. |
| error | Red border and message. |
| readOnly | Lock state like TextField. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `label` | string | required |
| `rows` | number | 3 |
| `maxLength` | number | none |
| `error / helper / required / readOnly / lockMessage` | as TextField |  |

## Usage

```jsx
<TextArea label="Reason for Visit" required maxLength={500} value={reason} onChange={setReason} />
```

## Accessibility

- The counter is aria-live polite so typing is not interrupted.

## Do and don't

- **Do:** Reason for Cancellation with a 500 character limit.
- **Don't:** Free text for the diagnosis on a claim line.
