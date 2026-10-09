# PermissionState

PermissionState renders the four role-based states with the screens' exact wording: lock (view only), denied (no access), patient preview, and hidden.

**From the screens:** `.lock` banner (208 screens), the "You do not have access to this screen" block (168 screens) and the portal and mobile read-only preview banners. Built from: Alert, EmptyState, Button.

Also exported from this card: `PermissionDenied`.

## When to use

- Top of any screen the role can only view (lock), in place of a screen the role cannot open (denied), staff looking at portal screens (preview).

## When not to use

- Errors from the server: Alert error.

## Variants and states

| Variant | What it is |
|---|---|
| lock | View level: banner, fields read-only, save buttons hidden. |
| denied | None level reached by link: full card with Go to my home screen and Compare roles. |
| preview | Staff viewing patient screens. |
| hidden | None level inside a screen: render nothing. Shown here only as a note. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `kind` | 'lock' \| 'denied' \| 'preview' \| 'hidden' | 'lock' |
| `role` | string | required |
| `permission` | string | required for lock and denied |
| `home` | string: href | none |

## Usage

```jsx
{access === "view" && <PermissionState kind="lock" role="Biller" permission="Edit clinical chart" />}
{access === "none" && <PermissionState kind="denied" role="Front Desk" permission="Manage claims" />}
```

## Accessibility

- denied is role alert; lock is role status.

## Do and don't

- **Do:** Always name the role and the permission.
- **Don't:** Disable buttons without saying why.
