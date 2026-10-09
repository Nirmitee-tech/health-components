# SOAPSection

SOAPSection is one note section with AI draft, smart-phrase insert, required tag and error, or custom content.

**From the screens:** enc-note sections and enc-templates. Built from: Card, AISuggestion, Popover, TextArea.

## When to use

- Inside VisitNoteEditor or a custom note layout.

## When not to use

- Short single fields: TextField.

## Variants and states

| Variant | What it is |
|---|---|
| text | Default textarea. |
| ai | AI Scribe draft on top. |
| macros | Insert popover with smart phrases. |
| custom | children replace the textarea, such as a ScoreQuestionnaire. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `title` | string | required |
| `text` | string | "" |
| `ai` | string | none |
| `macros` | string[] | none |
| `required` | boolean | false |
| `error` | string | none |
| `readOnly` | boolean | false |
| `rows` | number | 3 |
| `children` | node | none |

## Usage

```jsx
<SOAPSection title="Plan" macros={[".diabetesplan", ".followup3m"]} required />
```

## Accessibility

- Textarea named by the section title.

## Do and don't

- **Do:** Keep text when templates switch.
- **Don't:** Auto-accept AI text.
