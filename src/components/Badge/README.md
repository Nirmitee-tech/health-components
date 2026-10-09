# Badge

Badge is a small coloured label for a status or attribute; StatusTag picks the right colour for claim, PA, appointment and eligibility statuses.

**From the screens:** `.tag` with `.g` `.r` `.a` `.b` `.p` (158 screens), `.dtag` pill (167 screens) and `.pill` (54 screens).

Also exported from this card: `StatusTag`.

## When to use

- Statuses in tables and banners: Paid, Denied, Pended, Confirmed, Eligible.
- Attributes: "Behavioral Health", "New Patient".

## When not to use

- Actions: Button. Filters: FilterChip.

## Variants and states

| Variant | What it is |
|---|---|
| neutral | `surface-muted` with `ink-2`. |
| success | `success-strong` on `success-soft`. |
| danger | `danger-strong` on `danger-soft`. |
| warning | `warning-strong` on `warning-soft`. |
| info | `primary-strong` on `primary-soft`. |
| ai | `ai` on `ai-soft`. |
| outline | Border only. |
| shape pill | Radius 999, the `.dtag` look. |
| StatusTag | kind claim, pa, appointment or eligibility maps the status word to a tone and adds an icon (check, x, clock, info, sparkle) so colour is never the only cue. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `tone` | 'neutral' \| 'success' \| 'danger' \| 'warning' \| 'info' \| 'ai' \| 'outline' | 'neutral' |
| `shape` | 'square' \| 'pill' | 'square' |
| `size` | 'sm' \| 'md' | 'md' |
| `icon` | icon name | none |
| `dot` | boolean | false |
| `StatusTag kind` | 'claim' \| 'pa' \| 'appointment' \| 'eligibility' | required |
| `StatusTag status` | string, Title Case, as in the maps below | required |

## Usage

```jsx
<Badge tone="info" shape="pill">Behavioral Health</Badge>
<StatusTag kind="claim" status="Denied" />
<StatusTag kind="pa" status="Pended" />
```

## Accessibility

- Each status has a word and an icon; never colour alone.
- All tone pairs pass 4.5:1 in every theme (checked in tokens.json).

## Do and don't

- **Do:** Claim statuses: Draft, Ready, Submitted, Accepted, Rejected, Denied, Pending, Partially Paid, Paid, Appealed, Void.
- **Do:** PA statuses: Not Started, Submitted, In Review, Pended, More Info Needed, Approved, Partially Approved, Denied, Expired, Not Required.
- **Do:** Appointment: Scheduled, Confirmed, Arrived, Checked In, In Room, Checked Out, Completed, No Show, Cancelled. Eligibility: Active, Inactive, Unknown, Not Checked, Error, Self-Pay.
- **Don't:** New status words per screen ("Approved-ish"). Add them to the StatusTag map first.
