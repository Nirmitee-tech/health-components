# PriorAuthTimeline

PriorAuthTimeline shows a prior authorization: status, units used against approved (UnitsMeter), any alert and the status history.

**From the screens:** ins-pa-detail and ins-pa-tracker (status history, units, expiry) and ins-pa-queue. Built from: Card, StatusTag, ProgressBar (as UnitsMeter), Alert, Timeline. UnitsMeter is also exported alone.

Also exported from this card: `UnitsMeter`, `PriorAuthCard`.

## When to use

- PA detail drawer or page; referral status uses the same parts.

## When not to use

- The queue list: DataTable with StatusTag.

## Variants and states

| Variant | What it is |
|---|---|
| pending | No units yet, current step In Review. |
| approved | UnitsMeter turns amber at 75% and red at 90%. |
| alert | Expiry or more-info warning with an action. |
| denied | Failed step, danger tag. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `authId / service / payer / patient` | string | required: authId |
| `status` | PA status (see StatusTag) | required |
| `used / approved` | number | none |
| `unit` | string | "units" |
| `expires` | string | none |
| `events` | Timeline items | [] |
| `alert` | {title, body, action?} | none |
| `alertTone` | 'warning' \| 'error' \| 'info' | 'warning' |
| `UnitsMeter` | {used, approved, unit?, label?, helper?} |  |

## Usage

```jsx
<PriorAuthTimeline authId="PA-2026-11873" service="Physical therapy 97110" payer="Aetna" status="Approved"
  used={12} approved={20} unit="visits" expires="10/01/2026 to 12/31/2026" events={history} />
<UnitsMeter used={12} approved={20} unit="visits" />
```

## Accessibility

- Meter role with "12 of 20 visits" text.

## Do and don't

- **Do:** Offer Request Extension when 1 to 2 units remain.
- **Don't:** Show units without the expiry date.
