# ChatThread

ChatThread is a full secure-message conversation: header, message log and composer with optional AI reply suggestion.

**From the screens:** comm-chat, mob-messages, portal-messages (bubbles `.bub`, composer). Built from: Avatar, ChatMessage, IconButton, Alert.

Also exported from this card: `SecureChatThread`.

## When to use

- Staff to patient and staff to staff messaging.

## When not to use

- Comment threads on a record: a Timeline.

## Variants and states

| Variant | What it is |
|---|---|
| default | Composer with Send. |
| ai | Sparkle button suggests a reply. |
| readOnly | Lock banner instead of the composer (staff previewing the portal). |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `messages` | Array<ChatMessage props & {text}> | [] |
| `title / subtitle` | string | none |
| `placeholder` | string | "Write a message" |
| `ai` | boolean | false |
| `readOnly` | boolean | false |
| `lockText` | string | default |
| `onSend` | (text) => void | none |

## Usage

```jsx
<ChatThread title="Henna West" subtitle="MRN-100231" ai messages={thread} onSend={text => api.send(text)} />
```

## Accessibility

- The log has role log so new messages are announced.

## Do and don't

- **Do:** Show who a message is from and when.
- **Don't:** Auto-send AI replies.
