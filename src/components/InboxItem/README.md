# InboxItem

InboxItem is one inbox card for a result, refill, message, co-sign, imaging or fax, with priority and inline actions.

**From the screens:** clin-inbox, notif-center, mob-tasks. Built from: Icon, Badge, Button.

## When to use

- Inbox cards on phones and dashboards.

## When not to use

- Bulk work: InboxList table.

## Variants and states

| Variant | What it is |
|---|---|
| kinds | result, refill, message, cosign, imaging, fax. |
| unread | Bold with primary edge. |
| critical | Red card. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `item` | {kind, patient, title, from, received, priority?, unread?, actions?: string[]} | required |

## Usage

```jsx
<InboxItem item={{ kind: "refill", patient: "Henna West", title: "Metformin 500 mg", from: "Walgreens", received: "9:02 AM", actions: ["Approve", "Deny"] }} />
```

## Accessibility

- Priority in words.

## Do and don't

- **Do:** First action is the likely one.
- **Don't:** More than 3 actions.
