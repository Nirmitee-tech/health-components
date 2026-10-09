# LockedField

LockedField is a read-only field for the View access level: value visible and copyable, lock icon and "Your role can view but not edit".

**From the screens:** Locked fields under the `.lock` banner on 208 screens. Built from: TextField readOnly.

## When to use

- Any field the role can read but not change.

## When not to use

- Fields the role must not see: do not render (None).

## Variants and states

| Variant | What it is |
|---|---|
| default | Standard message. |
| custom message | Name the permission. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `label` | string | required |
| `value` | string | required |
| `message` | string | "Your role can view but not edit" |

## Usage

```jsx
<LockedField label="Member ID" value="W123456789" message="Needs Edit coverage" />
```

## Accessibility

- aria-describedby links the lock line.

## Do and don't

- **Do:** Keep value selectable.
- **Don't:** Use disabled grey with no reason.
