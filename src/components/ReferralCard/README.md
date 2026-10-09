# ReferralCard

ReferralCard summarizes an outgoing or incoming referral with status, reason, urgency, authorization and its status timeline.

**From the screens:** ref-list, ref-detail, ref-incoming, ref-in-review. Built from: Card, Badge, DescriptionList, Timeline.

## When to use

- Referral detail and queues.

## When not to use

- Prior auth itself: PriorAuthTimeline.

## Variants and states

| Variant | What it is |
|---|---|
| statuses | Draft, Sent, Received, Scheduled, Seen, Report Back, Declined, Needs Info. |
| timeline | Optional history. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `referral` | {specialty, patient, to, status, reason, urgency, auth?, from, timeline?} | required |
| `actions` | node | none |

## Usage

```jsx
<ReferralCard referral={ref} actions={<Button size="sm">Send Records</Button>} />
```

## Accessibility

- Status word in a badge.

## Do and don't

- **Do:** Close the loop: track Report Back.
- **Don't:** Lose referrals after Sent.
