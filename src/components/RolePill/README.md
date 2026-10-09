# RolePill

RolePill shows which role the screen is previewed as ("Viewing as: Biller") and switches it.

**From the screens:** `.cs-pill` "Viewing as" in the shell top bar and its role menu (9 roles from the screens' access maps).

Also exported from this card: `ViewingAs`.

## When to use

- Admins previewing what another role sees; demos.

## When not to use

- Changing a user's real role: Settings, Users.

## Variants and states

| Variant | What it is |
|---|---|
| closed | Pill with eye icon and role. |
| open | Menu with a heading and the roles, current one marked. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `role` | string | required |
| `roles` | Array<string \| {label, hint?}> | required |
| `defaultOpen` | boolean | false |
| `onChange` | (role) => void | none |

## Usage

```jsx
<RolePill role="Biller" roles={ROLES} onChange={setPreviewRole} />
```

## Accessibility

- Button named "Change the role you are viewing as", aria-haspopup menu.

## Do and don't

- **Do:** Say in the menu that nothing is saved.
- **Don't:** Let a preview grant extra rights.
