# InboxList

InboxList is the clinical inbox: a critical-value alert, type tabs with counts, and a selectable worklist with sign, review and assign.

**From the screens:** clin-inbox (critical potassium alert, Lab Results 3, Imaging 1, Refill Requests 2, Co-sign 2, priority Critical, Abnormal, Urgent, Routine, Normal, Sign selected, Mark reviewed, Assign to...). Built from: Alert, Tabs (pill), DataTable, Badge, Button.

## When to use

- Provider and nurse inbox; task queues with the same shape.

## When not to use

- Patient messaging: ChatThread.

## Variants and states

| Variant | What it is |
|---|---|
| critical | Red alert with Acknowledge and Call Patient. |
| role lock | Nurse can review and route; signing needs a provider (canSign false plus lockText). |
| filtered | Tab per type. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `items` | Array<{id, type, patient, item, received, priority, status}> | required |
| `categories` | Array<{id, count, alert?}> | [] |
| `critical` | {title, body} | none |
| `canSign` | boolean | true |
| `lockText` | string | none |
| `pageSize` | number | 5 |

## Usage

```jsx
<InboxList items={inbox} categories={[{ id: "Lab Results", count: 3 }, { id: "Co-sign", count: 2, alert: true }]}
  critical={{ title: "1 critical value waiting", body: "Ralph Edwards, potassium 6.1 mmol/L" }} canSign={role === "provider"} />
```

## Accessibility

- Priority shows a word and, for Critical, an icon.

## Do and don't

- **Do:** Pin critical values above everything.
- **Don't:** Let Sign Selected act on items the role cannot sign.
