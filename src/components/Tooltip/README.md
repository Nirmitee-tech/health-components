# Tooltip

Tooltip shows a short label for an icon or truncated text on hover and keyboard focus.

**From the screens:** `.cs-tip` on the Focus Rail icons (dark pill, 12px 500). Use beyond the rail is an addition.

## When to use

- Naming icon-only controls, explaining an abbreviation (POS, DOS).

## When not to use

- Anything the user must read to finish the task.

## Variants and states

| Variant | What it is |
|---|---|
| top / bottom / right | Placement. |
| open | Forced open for docs. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `label` | string | required |
| `children` | one focusable element | required |
| `placement` | 'top' \| 'bottom' \| 'right' | 'top' |
| `open` | boolean | false |

## Usage

```jsx
<Tooltip label="Print chart"><IconButton icon="file" label="Print chart" /></Tooltip>
```

## Accessibility

- Shown on focus as well as hover; linked with aria-describedby.
- Text is `toast-ink` on `toast-bg`.

## Do and don't

- **Do:** "DOS: date of service".
- **Don't:** Tooltips on disabled buttons (they get no focus).
