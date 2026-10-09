# Icon

Icon draws one of the inline 24px stroke icons used across CareOS, at stroke width 2 in the current text colour.

**From the screens:** Every screen draws its icons as inline SVG with viewBox 0 0 24 24, fill none, stroke currentColor, stroke-width 2 (for example the lock in the `.lock` banner). There is no icon font. The set here redraws the shapes the screens use plus the extra ones the components need.

## When to use

- Next to a label in buttons, menus, tags and banners; alone only inside IconButton.

## When not to use

- Decoration in empty space; emoji.

## Variants and states

| Variant | What it is |
|---|---|
| sizes | 12, 14, 16 (default), 18, 20, 22, 26. |
| stroke | 2 by default; 3 inside small filled dots. |
| labelled | label gives role img and aria-label; otherwise aria-hidden. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `name` | one of Icon.names | required |
| `size` | number | 16 |
| `strokeWidth` | number | 2 |
| `label` | string: makes it meaningful to screen readers | none |

## Usage

```jsx
<Icon name="lock" size={14} />
<Icon name="alert" label="Critical" />
```

## Accessibility

- Icons that carry meaning on their own need `label`; icons beside text are hidden.
- Icons that carry meaning need 3:1 against their ground.

## Do and don't

- **Do:** Lock icon plus words in every read-only state.
- **Don't:** Mixing filled and outline icon sets.
