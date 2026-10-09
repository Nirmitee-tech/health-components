# ClaimForm

ClaimForm is the claim line-item editor: DOS, CPT, modifiers, diagnosis pointers, units and charge per line, with totals, claim check and submit.

**From the screens:** bill-claim-edit (Services rendered, payer order SBR01, claim frequency CLM05-3, claim check errors and warnings, Save draft) and bill-services. Built from: Badge, inputs in the DataTable frame, IconButton, Button, SplitButton, Alert.

Also exported from this card: `ClaimLineEditor`.

## When to use

- Creating or correcting a professional claim.

## When not to use

- Read-only claim lists: DataTable.

## Variants and states

| Variant | What it is |
|---|---|
| edit | Inline inputs per line, Add Service Line, remove per line. |
| line errors | Red input with the message under it. |
| claim check | "N errors" or "Claim check passed". |
| readOnly | Lock banner, inputs read-only, no buttons. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `lines` | Array<{dos, cpt, mods?, dx?, units, charge, errors?: Record<field, string>}> | required |
| `payerOrder` | 'Primary' \| 'Secondary' \| 'Tertiary' | 'Primary' |
| `frequency` | string, such as "7 Corrected" | '1 Original' |
| `errorsCount` | number | 0 |
| `readOnly` | boolean | false |
| `lockText` | string | default |
| `onChange` | (lines) => void | none |

## Usage

```jsx
<ClaimForm payerOrder="Primary" frequency="1 Original" errorsCount={check.errors.length}
  lines={[{ dos: "10/06/2026", cpt: "99214", mods: "25", dx: "A,B", units: 1, charge: 182 }]} onChange={setLines} />
```

## Accessibility

- Every cell input is named "<field> line N"; errors set aria-invalid and a title.

## Do and don't

- **Do:** Explain X12 meaning in helper text (Box 22, REF*F8).
- **Don't:** Let a line point to a diagnosis that is not on the claim.
