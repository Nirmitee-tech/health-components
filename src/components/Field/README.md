# Field

Field is the labelled wrapper every form control shares: the label with its required marker, the control, then a read-only lock line and an error or helper line under it.

**From the screens:** `.lbl`, `.req`, `.errt`, `.help` around every input on 206 screens. TextField, TextArea, Select, Combobox and DatePicker are all built on it.

## When to use

- Wrapping a control that has no CareOS component of its own (a native time input, a custom widget) so it lines up with the other fields in a form.

## When not to use

- A plain text, select, date or search field: use TextField, Select, DatePicker or Combobox, which already include Field.
- Checkboxes and radios: they carry their own label (Checkbox, RadioGroup).

## Variants and states

| Variant | What it is |
|---|---|
| label | 13px medium label, linked to the control with `htmlFor`. |
| required | Red asterisk after the label; the control sets aria-required. |
| helper | Muted hint under the control. |
| error | Red message under the control, role alert. Replaces the helper. |
| lock | Lock icon and "Your role can view but not edit" under the control, for read-only fields. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `id` | string: id of the control inside | generated |
| `label` | node | none |
| `required` | boolean | false |
| `error` | node | none |
| `helper` | node | none |
| `lock` | node: read-only lock line | none |
| `children` | the control, or `(control) => node` receiving id and aria attributes | none |

## Usage

```jsx
<Field label="Arrival Time" required helper="Clinic local time" error={errors.time}>
  {(control) => <input type="time" className="co-inp" {...control} />}
</Field>
```

## Accessibility

- The label points at the control with `htmlFor`; pass the control's `id`, or use the function child to receive it.
- Error, helper and lock lines have ids linked with aria-describedby (`fieldDescribedBy` builds the value); aria-invalid is set on error.
- The asterisk is aria-hidden; the control carries aria-required.

## Do and don't

- **Do:** Error text names the field and the fix: "Choose a place of service."
- **Do:** Lock a field the role can view but not edit, and keep the value selectable.
- **Don't:** Use the placeholder as the label.
