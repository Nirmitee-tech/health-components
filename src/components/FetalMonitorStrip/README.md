# FetalMonitorStrip

FetalMonitorStrip is a display placeholder for the cardiotocography feed: fetal heart rate above, uterine activity below, on the standard grid, with an approximate baseline and the category the clinician assigned.

**From the screens:** New for the labor and delivery module. Placeholder: the real tracing comes from the certified bedside monitor. Built from: Card, Alert, Badge, EmptyState.

**Values:** Every number goes through the shared value rules (`CareOS.acuteFmt.format`): tabular figures, unit always shown, fixed decimals per measure, reference range in the hover title, and H, L or critical tags. Colour is never the only signal: flags carry words and an icon.

## When to use

- Central monitoring and the labor room screen, next to the board.

## When not to use

- Interpreting the tracing: the component does not classify it.

## Variants and states

| Variant | What it is |
|---|---|
| live | Streaming, green Live tag. |
| paused | Amber Paused tag. |
| signal loss | Gaps in the line plus a Signal loss tag. |
| category | I, II or III with who assigned it; otherwise Category not assigned. |
| disconnected | Empty state. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `fhr` | Array<number \| null>: bpm samples, null for signal loss | [] |
| `toco` | Array<number \| null>: mmHg | [] |
| `state` | 'live' \| 'paused' \| 'disconnected' | live when data exists |
| `category` | 'I' \| 'II' \| 'III' | none |
| `categoryBy` | string | none |
| `room` | string | none |
| `subtitle` | string | none |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | 'ed' when no global context is set |

## Usage

```jsx
<FetalMonitorStrip fhr={feed.fhr} toco={feed.toco} category="I" categoryBy="T. Ruiz RN 14:10" />
```

## Accessibility

- The tracing has an aria-label with the approximate baseline and signal loss.
- States are words in tags.

## Do and don't

- **Do:** Say this is a display copy.
- **Don't:** Compute a category automatically from this display.
