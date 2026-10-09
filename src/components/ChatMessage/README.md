# ChatMessage

ChatMessage is one bubble in a secure message thread: incoming, outgoing, AI or system.

**From the screens:** `.bub` `.in` `.out` (radius 12, tail corner 4px, 11px time) on mob-messages, mob-scribe, mob-tele and portal-messages.

## When to use

- Patient and staff messaging, AI receptionist transcripts.

## When not to use

- Clinical notes.

## Variants and states

| Variant | What it is |
|---|---|
| in | `surface` with border, author and avatar. |
| out | `primary` fill, status (Sent, Read). |
| ai | AI purple tint and AI tag. |
| system | Centered grey line. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `direction` | 'in' \| 'out' | 'in' |
| `author` | string | none |
| `time` | string | required |
| `status` | string: outgoing only | none |
| `ai` | boolean | false |
| `system` | boolean | false |
| `children` | text | required |

## Usage

```jsx
<ChatMessage author="Henna West" time="9:02 AM">Can I get my refill before Friday?</ChatMessage>
<ChatMessage direction="out" time="9:40 AM" status="Read">Approved.</ChatMessage>
```

## Accessibility

- Author and time are text, not only position.

## Do and don't

- **Do:** Mark AI replies with the AI tag.
- **Don't:** Send PHI in push previews.
