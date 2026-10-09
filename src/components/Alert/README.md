# Alert

Alert is an inline banner for information, success, warnings, errors, the read-only lock, access denied and break-the-glass.

**From the screens:** `.lock` (208 screens), `.warnbox` (58), `.dangerbox` (35), `.note` (201), `.aibox` (7) and the restricted-chart box on chart-btg.

## When to use

- A message about this screen or record that must stay visible: coverage inactive, chart restricted, role is read-only.

## When not to use

- Confirmation of an action that just finished: Toast.
- Blocking decisions: Modal.

## Variants and states

| Variant | What it is |
|---|---|
| info | `primary-strong` on `primary-soft`. |
| success | `success-strong` on `success-soft`. |
| warning | `ink` on `warning-box`, `warning-line` border. |
| error | `danger-ink` on `danger-soft`. |
| lock | The read-only banner: "Your role (Biller) can view this screen but not edit it." |
| denied | Permission missing for a part of the screen. |
| btg | Break the glass: restricted chart, reason required, access is logged. |
| note | Neutral grey note. |
| ai | AI notice. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `tone` | 'info' \| 'success' \| 'warning' \| 'error' \| 'lock' \| 'denied' \| 'btg' \| 'note' \| 'ai' | 'info' |
| `title` | string | none |
| `children` | body | none |
| `actions` | node | none |
| `onDismiss` | () => void | none |

## Usage

```jsx
<Alert tone="warning" title="Prior authorization expires in 6 days" actions={<Button size="sm">Request Extension</Button>}>PA-2026-11873 covers 20 visits; 12 used.</Alert>
<Alert tone="lock">Your role (Biller) can view this screen but not edit it.</Alert>
```

## Accessibility

- error, denied and btg use role alert; others role status.
- Every tone has its own icon.

## Do and don't

- **Do:** Lock text names the role and the missing permission.
- **Do:** Break the glass states who normally has access and that the reason is audited.
- **Don't:** Stacking more than two alerts at the top of a screen.
