# CPTPicker

CPTPicker adds CPT or HCPCS codes as lines with modifiers, units and diagnosis pointers.

**From the screens:** enc-sign coding, bill-superbill, bill-services. Built from: Combobox (code), table inputs, IconButton, Alert.

## When to use

- Coding a visit before the claim.

## When not to use

- Full claim editing: ClaimForm.

## Variants and states

| Variant | What it is |
|---|---|
| lines | Code rows with modifier, units, pointer. |
| telehealth | Modifier 95 reminder. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `options` | Array<{code, label}> | required |
| `lines` | Array<{code, label, mods?, units?, dx?}> | [] |
| `telehealth` | boolean | false |
| `label` | string | "Procedure (CPT / HCPCS)" |

## Usage

```jsx
<CPTPicker options={cpt} lines={[{ code: "99214", label: "Office visit", mods: "25" }]} telehealth />
```

## Accessibility

- Inputs named per code.

## Do and don't

- **Do:** Show the 95 rule for telehealth.
- **Don't:** Units above the MUE without a warning.
