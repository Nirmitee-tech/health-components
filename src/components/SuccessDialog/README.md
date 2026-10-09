# SuccessDialog

SuccessDialog confirms a major completed task with a green check, an "... Successfully" title and an Okay button.

**From the screens:** `.okc` 64px green circle with check and the Okay button on 206 screens ("Electronic Claim Submitted Successfully", "ERA Posted and Closed Successfully").

## When to use

- End of a multi-step flow: claim submitted, patient added, ERA posted, check-in complete.

## When not to use

- Small saves: Toast.

## Variants and states

| Variant | What it is |
|---|---|
| default | Title, body, Okay. |
| with next step | A secondary button such as "Add Another Patient". |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `title` | string | required |
| `children` | body | none |
| `okayLabel` | string | "Okay" |
| `onOkay` | () => void | none |
| `secondary` | string | none |
| `onSecondary` | () => void | none |
| `inline` | boolean | false |

## Usage

```jsx
<SuccessDialog title="Electronic Claim Submitted Successfully" onOkay={close}>The 277CA usually arrives within 24 hours.</SuccessDialog>
```

## Accessibility

- alertdialog; Okay gets focus.
- The check is white on `success` (an icon, 3:1 rule).

## Do and don't

- **Do:** Body says what happens next: "Availity will return a 277CA within 24 hours."
- **Don't:** Use it for errors.
