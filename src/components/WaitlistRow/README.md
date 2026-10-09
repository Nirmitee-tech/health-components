# WaitlistRow

WaitlistRow is one waitlisted patient with wanted window, priority, a matched opening and Offer Slot.

**From the screens:** sched-waitlist. Built from: Avatar, Badge, Button, KebabMenu.

## When to use

- Filling cancellations.

## When not to use

- Recalls: CareGapRow.

## Variants and states

| Variant | What it is |
|---|---|
| match | Opening found, Offer Slot primary. |
| no match | Offer disabled. |
| priority | Red tag. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `item` | {patient, type, provider, window, since, priority?, match?} | required |

## Usage

```jsx
<WaitlistRow item={{ patient: "Kristin Watson", type: "Annual Wellness", provider: "Any", window: "mornings this week", since: "09/30", match: "Thu 10/09 9:40 AM" }} />
```

## Accessibility

- Actions named with the patient.

## Do and don't

- **Do:** Text offers that expire.
- **Don't:** Offer the same slot to two people at once.
