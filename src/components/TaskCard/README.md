# TaskCard

TaskCard is one staff task with done check, patient, due date, overdue tag, category and owner.

**From the screens:** dash-tasks, mob-tasks. Built from: Checkbox, Badge, Avatar.

## When to use

- Task boards and home dashboards.

## When not to use

- Clinical results: InboxItem.

## Variants and states

| Variant | What it is |
|---|---|
| open / done | Checkbox. |
| overdue | Red border and tag. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `task` | {title, patient?, due?, overdue?, done?, tag?, owner} | required |

## Usage

```jsx
<TaskCard task={{ title: "Call back about MRI auth", patient: "Ralph Edwards", due: "Today 3 PM", owner: "Sam Patel", tag: "Prior Auth" }} />
```

## Accessibility

- Checkbox named after the task.

## Do and don't

- **Do:** Name the owner.
- **Don't:** Unowned tasks.
