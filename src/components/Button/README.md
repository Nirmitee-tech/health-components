# Button

Button runs one action on the screen, from Save Claim to Start Visit Note.

**From the screens:** `.btn` with `.pri`, `.sec`, `.dng`, `.ai`, `.sm`, `.lnk`, `.full` on 211 screens. Ghost (tertiary) and large are additions: large copies the kiosk button (48px, 16px text).

## When to use

- Commit or move a task forward: Save, Submit Claim, Start Visit Note, Check In.
- Use `primary` once per area for the main action; everything else is `secondary`.
- Use `ai` only for actions that run an AI model (Draft with AI Scribe, Suggest Codes).

## When not to use

- Navigation to another screen inside running text: use a link.
- Filtering a list: use FilterChip or SegmentedControl.
- Destroying data without a confirm step: pair `danger` with a destructive Modal.

## Variants and states

| Variant | What it is |
|---|---|
| primary | Main action. One per card, modal footer or page header. |
| secondary | Default. Every other action. Shows `is-on` when it toggles a view (`pressed`). |
| tertiary / ghost | Low-weight actions in dense toolbars and table rows. |
| danger | Outlined red: Delete, Void Claim, Remove Allergy. The solid red (`danger-solid`) is only for the confirm button inside a destructive Modal. |
| link | Inline text action, 13px: View history, Clear selection. |
| ai | Purple fill for AI actions. |
| sizes | `sm` 30px (tables, toolbars, Compact density), `md` 36px, `lg` 48px (kiosk and patient portal). |
| states | hover, focus ring, `disabled` (45% opacity), `loading` (spinner, label kept, button disabled, `aria-busy`). |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `variant` | 'primary' \| 'secondary' \| 'tertiary' \| 'ghost' \| 'danger' \| 'danger-solid' \| 'link' \| 'ai' | 'secondary' |
| `size` | 'sm' \| 'md' \| 'lg' | 'md' |
| `loading` | boolean | false |
| `disabled` | boolean | false |
| `iconLeft / iconRight` | icon name (see Icon) | none |
| `full` | boolean: full width (phone screens) | false |
| `pressed` | boolean: toggle state, sets aria-pressed | undefined |
| `href` | string: renders an `<a>` with button styling | none |
| `children` | label text | required |

## Usage

```jsx
<Button variant="primary" iconLeft="plus" onClick={startNote}>Start Visit Note</Button>
<Button variant="danger" size="sm">Void Claim</Button>
<Button variant="primary" loading={checking}>Check Coverage</Button>
```

## Accessibility

- Labels are verbs in Title Case and say what happens: "Submit Claim", not "OK".
- Loading keeps the label so screen readers still announce it; the spinner has role status.
- Disabled buttons are skipped by Tab. When the reason is not obvious, say it in helper text next to the button.
- Focus ring: 2px `focus-ring` with 2px offset.

## Do and don't

- **Do:** "Save Claim" as primary and "Cancel" as secondary in a claim modal footer.
- **Do:** Show `loading` while an eligibility check runs, then a Toast "Coverage Checked Successfully".
- **Don't:** Two primary buttons side by side ("Save" and "Submit").
- **Don't:** A red button for a non-destructive action such as "Mark No Show" without a confirm.
