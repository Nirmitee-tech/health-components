# Modal

Modal asks for input or a decision in a centered dialog: form, confirm and destructive kinds.

**From the screens:** `.ov` overlay with `.modal` (radius 12, 640px, `.mh` `.mb` `.mf`) on 208 screens; `.modal.w` 980px for wide forms.

## When to use

- Short focused forms (Add Appointment Type), confirms ("Discard unsaved changes on this page?"), destructive actions (Void Claim).

## When not to use

- Long forms or reference panels: Drawer.
- Multi-step flows over 3 steps: a page with Stepper.

## Variants and states

| Variant | What it is |
|---|---|
| form | Fields, Cancel and Save. |
| confirm | Short question, two buttons. |
| destructive | Warning icon, record summary, solid red confirm with the verb ("Void Claim"). |
| sizes | sm 420px, md 640px, wide 980px. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `open` | boolean | true |
| `title` | string | required |
| `kind` | 'form' \| 'confirm' \| 'destructive' | 'form' |
| `size` | 'sm' \| 'md' \| 'wide' | 'md' |
| `children` | body | required |
| `primaryLabel` | string | "Save" |
| `cancelLabel` | string | "Cancel" |
| `onPrimary / onClose` | () => void | none |
| `loading` | boolean | false |
| `primaryDisabled` | boolean | false |
| `footer` | node \| null: replace the footer | default |
| `inline` | boolean: render in place for docs | false |

## Usage

```jsx
<Modal title="Void this claim?" kind="destructive" primaryLabel="Void Claim" onPrimary={voidClaim} onClose={close}>
  <DescriptionList items={[["Claim", "CLM-20871"]]} />
</Modal>
```

## Accessibility

- dialog (form) or alertdialog (confirm, destructive), aria-modal, labelled by the title.
- Escape and the x close it; scrim click closes forms only when nothing was typed (app rule).
- Move focus into the dialog on open and back to the trigger on close.
- Renders through a portal, traps Tab inside and locks page scroll. Pass `closeOnScrim={false}` for forms once something was typed.

## Do and don't

- **Do:** Destructive: name the record ("Void CLM-20871 for Henna West?") and the consequence.
- **Don't:** Stacked modals.
- **Don't:** "Are you sure?" with OK and Cancel.
