# Switch

Switch turns a setting on or off immediately, such as "Sidebar starts collapsed" or "Allow online booking".

**From the screens:** `.sw` (40 by 22, green when on, on set-appearance and pat-chart-insurance) and `.tgl` toggle rows (portal settings).

## When to use

- Settings that apply straight away.

## When not to use

- A choice that only applies after Save in a form: Checkbox.

## Variants and states

| Variant | What it is |
|---|---|
| off / on | Grey `border-strong` track, `success` when on. |
| row | 56px row with a top border, as in portal settings. |
| description | Muted explanation. |
| disabled | 45% opacity. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `label` | string | required |
| `checked / defaultChecked` | boolean |  |
| `description` | string | none |
| `row` | boolean | false |
| `disabled` | boolean | false |
| `onChange` | (on) => void | none |

## Usage

```jsx
<Switch label="Sidebar starts collapsed" description="Clinical Sidebar only." checked={collapsed} onChange={setCollapsed} />
```

## Accessibility

- role switch with aria-checked; labelled by its text.
- The on state is green AND the knob moves right, so colour is not the only cue.

## Do and don't

- **Do:** "Start collapsed" under the Sidebar option in Appearance.
- **Don't:** A switch inside a modal form that still needs Save.
