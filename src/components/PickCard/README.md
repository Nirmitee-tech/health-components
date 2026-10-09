# PickCard

PickCard is a large selectable card for choosing one option on phones, portal and kiosk (appointment, provider, reason).

**From the screens:** `.pcard` on kiosk-checkin, mob-*, portal-appts, portal-book (10 screens).

## When to use

- Touch choices with two lines of detail.

## When not to use

- Dense lists: RadioGroup.

## Variants and states

| Variant | What it is |
|---|---|
| selected | Primary border and tint. |
| disabled | Faded. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `title` | string | required |
| `meta` | string | none |
| `selected / disabled` | boolean | false |
| `onClick` | () => void | none |
| `children` | node | none |

## Usage

```jsx
<PickCard title="Thu 10/09 9:20 AM" meta="Follow-Up with Dr. Bell" selected onClick={pick} />
```

## Accessibility

- aria-pressed.

## Do and don't

- **Do:** Use for 2 to 6 options.
- **Don't:** Hide what differs between cards.
