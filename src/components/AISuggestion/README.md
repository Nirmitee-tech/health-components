# AISuggestion

AISuggestion holds content drafted by AI, in the AI purple, with its source, confidence and Accept or Edit actions.

**From the screens:** `.aibox` (`ai-soft`, `ai-line` border) on 7 screens: ai-scribe, ai-nurse, ai-receptionist, mob-scribe, portal-results.

## When to use

- AI-drafted notes, code suggestions, message replies, coverage guesses.

## When not to use

- Content a person wrote.

## Variants and states

| Variant | What it is |
|---|---|
| default | Sparkle icon, title, "Draft, needs review" tag. |
| confidence | Confidence text on the right. |
| actions | Accept, Edit, Discard. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `title` | string | "AI suggestion" |
| `source` | string: tag text | "Draft, needs review" |
| `confidence` | string | none |
| `children` | content | required |
| `actions` | node | none |

## Usage

```jsx
<AISuggestion title="Suggested codes" confidence="medium" actions={<Button variant="ai" size="sm" onClick={accept}>Accept Codes</Button>}>{suggestion}</AISuggestion>
```

## Accessibility

- Region named after the title.
- Never apply AI output without a person accepting it.

## Do and don't

- **Do:** "Suggested codes from the visit note: 99214, E11.9. Confidence medium."
- **Don't:** AI purple for anything that is not AI.
