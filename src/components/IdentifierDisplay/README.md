# IdentifierDisplay

IdentifierDisplay shows SSN, MRN, NPI, DEA and member IDs in a monospace face, masking the sensitive ones, with reveal and copy buttons and a check-digit warning.

**Foundation:** part of the clinical values set. Every number it shows comes from `CareOS.fmt`, so it matches every other component.

## When to use

- Patient banner, registration, claims, provider directory, prescriptions.

## When not to use

- Identifier entry: TextField with mask.

## Variants and states

| Variant | What it is |
|---|---|
| ssn | Masked to last 4 by default: •••-••-6789. |
| member | Masked except last 4. |
| mrn / npi | Shown in full. |
| dea | Masked by default; reveal is logged by `onReveal`. |
| check digit fails | NPI (Luhn) or DEA checksum fails: amber note. |
| revealable / copyable | Eye and copy buttons. |

## Props

| Prop | Type | Default |
|---|---|---|
| `type` | 'ssn' \| 'mrn' \| 'npi' \| 'dea' \| 'member' \| 'other' | required |
| `value` | string | required |
| `masked` | boolean | by type |
| `revealable` | boolean | false |
| `onReveal` | () => void: audit hook | none |
| `copyable` | boolean | true |
| `label / showLabel` | string / boolean | type label / true |

## Usage

```jsx
<IdentifierDisplay type="ssn" value="123456789" revealable onReveal={logAccess} />
```

## Accessibility

- Masked values are announced as "SSN ending 6789".
- Copy and reveal buttons have names that change with state.

## Do and don't

- **Do:** Log every reveal of an SSN or DEA through `onReveal`.
- **Don't:** Read "check digit OK" as proof the number is real: it only catches typing errors. NPPES or DEA lookup confirms the provider.
