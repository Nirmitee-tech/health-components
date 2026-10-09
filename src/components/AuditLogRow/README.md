# AuditLogRow

AuditLogRow is one audit entry: time, action, user and role, what changed, patient, IP and reason, with old and new values.

**From the screens:** set-audit, chart-btg review. Built from: Badge, code chip.

## When to use

- Audit log, privacy review, break-the-glass review.

## When not to use

- Clinical history: Timeline.

## Variants and states

| Variant | What it is |
|---|---|
| actions | view, edit, delete, export, btg, login, sign. |
| change | Old and new value chip. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `event` | {time, action, user, role, what, patient?, ip?, reason?, change?} | required |

## Usage

```jsx
<AuditLogRow event={{ time: "10/09 10:42", action: "btg", user: "Ana Ortiz MD", role: "Provider", what: "opened chart", patient: "Nora Scott", reason: "Emergency treatment" }} />
```

## Accessibility

- Action has icon and word.

## Do and don't

- **Do:** Show reason for break the glass.
- **Don't:** Allow editing audit rows.
