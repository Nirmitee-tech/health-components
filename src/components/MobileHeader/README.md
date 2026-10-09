# MobileHeader

MobileHeader is the dark bar at the top of phone, portal and kiosk screens, with back, title, subtitle and one action.

**From the screens:** `.ptop` (`primary-strong`, white 17px title, 12px subtitle) on 39 phone screens; `.ktop` on the kiosk (19px).

## When to use

- Every phone, portal and kiosk screen.

## When not to use

- Desktop: TopBar.

## Variants and states

| Variant | What it is |
|---|---|
| default | Title and subtitle. |
| back | Chevron back link. |
| action | One small button on the right. |
| kiosk | Wider, 19px title. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `title` | string | required |
| `subtitle` | string | none |
| `back` | string: href | none |
| `action` | node | none |
| `variant` | 'phone' \| 'kiosk' | 'phone' |

## Usage

```jsx
<MobileHeader back="/m/patients" title="Henna West" subtitle="F 38 . MRN-100231" />
```

## Accessibility

- Back link named "Back".
- White on `primary-strong` passes 4.5:1 in all three light styles; Dark uses `surface-alt` with `ink`.

## Do and don't

- **Do:** Subtitle with the patient or the date.
- **Don't:** Two actions on the right.
