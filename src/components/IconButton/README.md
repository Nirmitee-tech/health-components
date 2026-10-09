# IconButton

IconButton is a square button that shows only an icon, with its name in aria-label.

**From the screens:** `.cs-ib` in the shell (notifications, menu) and the close button of every modal and drawer (160 screens use icon-only buttons with aria-label).

## When to use

- Close a modal or drawer, open notifications, collapse a panel, expand a table row.
- Toolbars where the icon is universally known (print, close, search).

## When not to use

- The action is unusual or risky: use a Button with a text label.
- More than three icon buttons in a row: use a KebabMenu.

## Variants and states

| Variant | What it is |
|---|---|
| ghost | Default. Muted icon, grey hover. |
| secondary | Bordered, for standalone toolbar buttons. |
| primary | Filled, rare: the compose button on mobile. |
| danger | Red icon for remove-row actions. |
| sizes | sm 30px, md 34px, lg 44px (touch). |
| badge | Count bubble, for example unread notifications. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `icon` | icon name | required |
| `label` | string: aria-label and title | required |
| `variant` | 'ghost' \| 'secondary' \| 'primary' \| 'danger' | 'ghost' |
| `size` | 'sm' \| 'md' \| 'lg' | 'md' |
| `badge` | number \| string | none |
| `disabled` | boolean | false |

## Usage

```jsx
<IconButton icon="x" label="Close" onClick={onClose} />
<IconButton icon="bell" label="Notifications" badge={4} />
```

## Accessibility

- `label` is required. It becomes aria-label and the hover title.
- The badge count is read as "N unread".
- Use lg (44px) on phone screens to meet the touch target.

## Do and don't

- **Do:** `label="Close developer panel"` on the drawer close button.
- **Don't:** A pencil icon alone for "Edit Demographics" in a patient banner: the text matters there.
