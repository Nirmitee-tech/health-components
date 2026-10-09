# Checkbox

Checkbox turns one option on or off, alone or in a list; it also has an indeterminate state for select-all.

**From the screens:** `.chk` rows on 133 screens (18px native box, 8px gap).

## When to use

- Independent yes/no options: "Send reminder by SMS", "Patient declined".
- Selecting table rows.

## When not to use

- A setting that takes effect at once: Switch.
- One choice from several: RadioGroup.

## Variants and states

| Variant | What it is |
|---|---|
| unchecked / checked | Native box, `primary` accent. |
| indeterminate | Some rows selected. |
| description | Muted line under the label. |
| disabled | 55% opacity. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `label` | string | required |
| `checked / defaultChecked` | boolean |  |
| `indeterminate` | boolean | false |
| `description` | string | none |
| `disabled` | boolean | false |
| `onChange` | (event) => void | none |

## Usage

```jsx
<Checkbox label="Send reminder by SMS" checked={sms} onChange={e => setSms(e.target.checked)} />
```

## Accessibility

- Native input inside its label, so the whole row is clickable.

## Do and don't

- **Do:** "I have reviewed the allergy list" before signing.
- **Don't:** A checkbox that submits a form.
