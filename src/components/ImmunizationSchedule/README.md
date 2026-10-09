# ImmunizationSchedule

ImmunizationSchedule is the vaccine grid by dose with Given, Due, Overdue, Declined and Later states, synced with the state registry.

**From the screens:** pat-chart-immunizations (IIS sync). Built from: Card, table, Badge.

## When to use

- Pediatric and adult immunization history and forecast.

## When not to use

- Recording one dose: a form in a Drawer.

## Variants and states

| Variant | What it is |
|---|---|
| given | Date in green. |
| due | Blue. |
| overdue | Red. |
| declined | Neutral. |
| later | Outline. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `columns` | string[]: dose ages | required |
| `rows` | Array<{vaccine, doses: Array<{status?, date?}>}> | required |
| `synced` | string | "today" |
| `readOnly` | boolean | false |

## Usage

```jsx
<ImmunizationSchedule columns={["2 mo", "4 mo", "6 mo"]} rows={forecast} />
```

## Accessibility

- Each cell has a word or date and an icon.

## Do and don't

- **Do:** Use the registry forecast.
- **Don't:** Colour-only cells.
