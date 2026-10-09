# CommandPalette

CommandPalette is the Command Bar style's "Jump to anything" search for screens, patients and actions, opened with Ctrl K or Cmd K.

**From the screens:** `.cs-cbar` and `.cs-pal` in the shell (640px, radius 14, `.cs-pr` rows with `.cs-pk` kind pills and a key hint footer).

## When to use

- Command Bar style, and as a shortcut in every style.

## When not to use

- Patient search inside a form: Combobox.

## Variants and states

| Variant | What it is |
|---|---|
| results | Kind pill (Screen, Patient, Action), icon, label, meta. |
| active row | `primary-soft`. |
| no results | Suggests what to type. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `items` | Array<{kind, label, meta?, icon?}> | required |
| `open` | boolean | true |
| `defaultQuery` | string | "" |
| `placeholder` | string | "Jump to a screen, patient or action" |
| `onSelect` | (item) => void | none |
| `onClose` | () => void | none |
| `inline` | boolean | false |

## Usage

```jsx
{open && <CommandPalette items={searchIndex} onSelect={go} onClose={() => setOpen(false)} />}  // open on Ctrl K / Cmd K
```

```jsx
const [open, setOpen] = useState(false);
useCommandPaletteShortcut(() => setOpen(true));   // Ctrl K / Cmd K
<CommandPalette open={open} items={searchIndex} onSelect={go} onClose={() => setOpen(false)} />
```

## Accessibility

- combobox with listbox; arrows, Enter, Escape. Key hints in the footer.

## Do and don't

- **Do:** Return patients with DOB and MRN in meta.
- **Don't:** Run destructive actions straight from the palette without a confirm.
