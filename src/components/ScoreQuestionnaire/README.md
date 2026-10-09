# ScoreQuestionnaire

ScoreQuestionnaire runs GAD-7 or PHQ-9 with a live total and severity band, and flags a positive PHQ-9 item 9.

**From the screens:** enc-intake "Intake GAD-7 / PHQ-9", pat-chart-questionnaires, portal-forms. Built from: Card, segmented answers, Badge, Alert.

## When to use

- Behavioral health screening at intake or in the portal.

## When not to use

- Unscored forms: a normal form.

## Variants and states

| Variant | What it is |
|---|---|
| GAD-7 | Bands 0-4, 5-9, 10-14, 15-21. |
| PHQ-9 | Bands to 27; item 9 alert. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `instrument` | 'GAD-7' \| 'PHQ-9' | required |
| `questions` | string[] | required |
| `answers` | number[] (0 to 3) | [] |
| `title` | string |  |

## Usage

```jsx
<ScoreQuestionnaire instrument="PHQ-9" questions={PHQ9_ITEMS} answers={saved} />
```

## Accessibility

- Each item is a radiogroup; score is aria-live.

## Do and don't

- **Do:** Say a score is a screen.
- **Don't:** Hide item 9 results from the provider.
