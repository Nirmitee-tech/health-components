# RoleSwitcher

RoleSwitcher is the "Viewing as" control in the top bar; it is the same component as RolePill, exported under the composite name.

**From the screens:** Shell `.cs-pill` and its role menu; in Classic a white pill on the navy bar. Built from: RolePill, Menu.

## When to use

- Previewing the app as another role.

## When not to use

- Changing someone's real role.

## Variants and states

| Variant | What it is |
|---|---|
| closed / open | See RolePill. |
| on navy | Inside TopBar variant classic it turns white. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `role` | string | required |
| `roles` | Array<string \| {label, hint?}> | required |
| `onChange` | (role) => void | none |
| `defaultOpen` | boolean | false |

## Usage

```jsx
<RoleSwitcher role={role} roles={ROLES} onChange={r => setPreviewRole(r)} />
```

## Accessibility

- As RolePill.

## Do and don't

- **Do:** Reload the screen in the chosen role and show the lock banners that role gets.
- **Don't:** Persist the preview past the session.
