# Radio

Radio and RadioGroup choose exactly one option from a short visible list.

**From the screens:** Native radios on 30 screens (auth-2fa method, bill-patient-pay method, clin-handoff).

Also exported from this card: `RadioGroup`.

## When to use

- Two to six options that need explanation: "Text message", "Authenticator app".

## When not to use

- Many options: Select.
- A compact view switch: SegmentedControl.

## Variants and states

| Variant | What it is |
|---|---|
| vertical | Default, one per line with optional description. |
| inline | Options in a row. |
| error | Message under the group. |
| disabled option | Greyed. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `label` | string: legend | required |
| `options` | Array<string \| {value, label, description?, disabled?}> | required |
| `value / defaultValue` | string |  |
| `inline` | boolean | false |
| `required` | boolean | false |
| `error` | string | none |
| `onChange` | (value) => void | none |

## Usage

```jsx
<RadioGroup label="Visit Mode" inline required options={["In person", "Telehealth"]} value={mode} onChange={setMode} />
```

## Accessibility

- Fieldset with legend; arrow keys move between options natively.

## Do and don't

- **Do:** Describe the cost of each choice: "Card on file (Visa ending 4242)".
- **Don't:** A radio group with one option.
