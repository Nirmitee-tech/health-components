# PermissionMatrix

PermissionMatrix is the role-by-action grid from Compare roles and Roles and Permissions, showing None, View, Edit or Approve for each role.

**From the screens:** rbac-compare ("Actions allowed and blocked", "Only show differences") and set-roles / set-role-detail. Levels exactly as the screens define them: None hidden, View can open and read with fields locked, Edit can create and change, Approve can edit and sign off. Built from: Badge, Switch, the DataTable frame, native Select when editable.

## When to use

- Comparing 1 to 3 roles side by side; editing a role's permissions.

## When not to use

- Showing one user what they can do: PermissionState.

## Variants and states

| Variant | What it is |
|---|---|
| read | Level tags with icon and word. |
| editable | A select per cell; onChange reports row, role and level. |
| only differences | Hides rows where all roles match; empty text "These roles have the same level on every action." |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `roles` | string[] (1 to 3 recommended) | required |
| `rows` | Array<{module, action, levels: Record<role, none\|view\|edit\|approve>}> | required |
| `editable` | boolean | false |
| `onlyDifferences` | boolean | false |
| `onChange` | (row, role, level) => void | none |

In this React port, `rows` and `onlyDifferences` are controlled props (pair them with `onRowsChange` and `onOnlyDifferencesChange`); `defaultRows` and `defaultOnlyDifferences` make them uncontrolled. The level helper is exported as `LevelTag`, the level map as `permissionLevels`.

## Usage

```jsx
<PermissionMatrix
  roles={["Provider", "Nurse / MA", "Biller"]}
  rows={rows} onRowsChange={setRows}
  editable onChange={(row, role, level) => savePermission(row, role, level)} />

<PermissionMatrix roles={["Provider", "Biller"]} defaultRows={rows} defaultOnlyDifferences />
```

## Accessibility

- Real table with caption, column headers per role and a row header per action.
- Each level has its own icon and word, so the grid reads without colour.

## Do and don't

- **Do:** Group rows by module (Schedule, Billing, Clinical, Settings).
- **Don't:** Invent a fifth level per screen.
