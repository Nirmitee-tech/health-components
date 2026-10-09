# DevDrawer

DevDrawer is the "For developers" panel every screen has: purpose and roles, API, fields, states and entry points.

**From the screens:** The For developers drawer on all 212 app screens (`.devsec`, "For developers: <screen>", "Close developer panel"). Built from: Drawer (developer).

## When to use

- Every screen, opened from the "For developers" button in the page header.

## When not to use

- User help text.

## Variants and states

| Variant | What it is |
|---|---|
| sections | Only the props you pass are shown, in a fixed order. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `screen` | string | required |
| `purpose` | string | required |
| `roles` | string | none |
| `api` | string: shown in mono | none |
| `fields` | string | none |
| `states` | string | none |
| `entry` | string | none |
| `width` | number | 560 |
| `onClose` | () => void | none |
| `inline` | boolean | false |

## Usage

```jsx
<Button iconLeft="code" onClick={() => setDev(true)}>For developers</Button>
{dev && <DevDrawer screen="Claims" purpose="..." api="GET /claims?status=rejected" onClose={() => setDev(false)} />}
```

## Accessibility

- As Drawer.

## Do and don't

- **Do:** Say what a check catches and what it does not.
- **Don't:** Put secrets or real PHI in examples.
