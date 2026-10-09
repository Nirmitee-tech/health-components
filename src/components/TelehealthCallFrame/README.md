# TelehealthCallFrame

TelehealthCallFrame is the video visit frame: waiting room, live call, weak connection, controls and the consent and billing note.

**From the screens:** sched-tele, mob-tele, portal-telehealth (`.vid`, `.pip`). Built from: Avatar, Spinner, IconButton, Button, Alert.

## When to use

- Provider and patient video visits.

## When not to use

- Phone-only visits.

## Variants and states

| Variant | What it is |
|---|---|
| waiting | Admit Patient. |
| live | Timer, End Visit. |
| poor | Weak connection notice. |
| consent | POS and modifier note. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `remote` | string | required |
| `state` | 'waiting' \| 'live' \| 'poor' | 'live' |
| `elapsed` | string | "00:00" |
| `consent` | boolean | false |
| `location` | string | none |
| `pos` | string | "10" |

## Usage

```jsx
<TelehealthCallFrame remote="Nora Scott" state="live" elapsed="12:41" consent location="Home, Chicago IL" />
```

## Accessibility

- Controls are labelled icon buttons, 44px.

## Do and don't

- **Do:** Record patient location each visit.
- **Don't:** Start without consent.
