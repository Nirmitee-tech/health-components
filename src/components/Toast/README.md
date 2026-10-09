# Toast

Toast confirms a finished action at the bottom of the screen for about 2.8 seconds, in the "... Successfully" voice.

**From the screens:** `.toast` on 211 screens: `ink` background, white text, radius 8, bottom 24px, auto-hides after 2800ms. Messages: "Draft Saved Successfully", "Reminder Sent Successfully", "Changes discarded".

## When to use

- Background confirmation that needs no action.

## When not to use

- Errors the user must fix: field error or Alert.
- Big completions (claim submitted): SuccessDialog.

## Variants and states

| Variant | What it is |
|---|---|
| neutral | Default. |
| success | Check icon. |
| error | Alert icon, role alert, stays until dismissed. |
| action | One text action, such as Undo. |
| inline | Static, for previews and docs. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `message` | string | required |
| `tone` | 'neutral' \| 'success' \| 'error' | 'neutral' |
| `action` | string | none |
| `onAction` | () => void | none |
| `inline` | boolean | false |

## Usage

```jsx
{toast && <Toast tone="success" message="Draft Saved Successfully" />}  // hide after 2800 ms
```

## Accessibility

- role status with aria-live polite; errors role alert.
- Do not auto-hide a toast that holds an action in under 5 seconds.

## Do and don't

- **Do:** Title Case object and verb plus Successfully: "Appointment Type Added Successfully".
- **Don't:** "Success!"
- **Don't:** Toasts for errors that block the task.
