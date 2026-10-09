# TextField

TextField is a labelled one-line input with masks for phone, SSN, NPI, ZIP and EIN, plus error, helper, required and read-only lock states.

**From the screens:** `.lbl`, `.req`, `.inp`, `.inp.bad`, `.errt`, `.help` on 206 screens; lock wording from the `.lock` banner ("Your role can view this screen but not edit it").

## When to use

- Short free text and identifiers: name, phone, member ID, NPI, policy number.

## When not to use

- Choosing from a known list: Select or Combobox.
- Dates: DatePicker.
- More than one line: TextArea.

## Variants and states

| Variant | What it is |
|---|---|
| mask phone | (###) ###-####, numeric keypad on phones. |
| mask ssn | ###-##-####. Show only the last four after save. |
| mask npi | 10 digits. |
| mask zip | 5 digits or ZIP+4. |
| mask ein | XX-XXXXXXX. |
| error | Red border plus the message under the field, role alert. |
| helper | Muted hint under the field. |
| required | Red asterisk after the label plus aria-required. |
| readOnly lock | Grey fill, lock icon and "Your role can view but not edit" under the field. |
| sizes | sm 30px, md 36px, lg 48px (kiosk). |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `label` | string | required |
| `mask` | 'phone' \| 'ssn' \| 'npi' \| 'zip' \| 'ein' \| 'date' | none |
| `value / defaultValue` | string | "" |
| `onChange` | (value, event) => void | none |
| `error` | string | none |
| `helper` | string | mask hint |
| `required` | boolean | false |
| `readOnly` | boolean | false |
| `lockMessage` | string | 'Your role can view but not edit' |
| `size` | 'sm' \| 'md' \| 'lg' | 'md' |
| `iconLeft` | icon name | none |
| `suffix` | string, such as "units" | none |

## Usage

```jsx
<TextField label="Mobile Phone" mask="phone" required value={phone} onChange={setPhone} error={errors.phone} />
<TextField label="Member ID" value={memberId} readOnly={access === "view"} />
```

## Accessibility

- Every field has a visible label; placeholder is an example, never the label.
- Error and helper text are linked with aria-describedby; aria-invalid is set on error.
- A mask only arranges digits into the pattern. It proves the shape, not that the NPI or ZIP is real; check those on save and say so in the error ("This NPI is not in NPPES").
- Input borders use `border`, which is below 3:1 on `surface` in every light style (source value kept). The label and the field fill carry the boundary; see README, Accessibility.

## Do and don't

- **Do:** Error text names the field and the fix: "Enter the EIN as XX-XXXXXXX."
- **Do:** Read-only for a biller viewing demographics: lock state, value still selectable and copyable.
- **Don't:** "Invalid input".
- **Don't:** Hiding a field the role can view: that is the view level, so lock it; hide only at the none level.
