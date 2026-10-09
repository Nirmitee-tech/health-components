# PartogramChart

PartogramChart plots cervical dilation and head descent against hours of active labor, with the WHO alert line (1 cm per hour) and action line 4 hours to its right, and an hourly row of fetal heart rate and contractions.

**From the screens:** New for the labor and delivery module. Built from: Card, Alert, EmptyState. WHO partograph layout.

**Values:** Every number goes through the shared value rules (`CareOS.acuteFmt.format`): tabular figures, unit always shown, fixed decimals per measure, reference range in the hover title, and H, L or critical tags. Colour is never the only signal: flags carry words and an icon.

## When to use

- Monitoring progress of active labor.

## When not to use

- Latent phase before 4 cm. Second stage pushing timing: a timer.

## Variants and states

| Variant | What it is |
|---|---|
| normal progress | Dilation left of the alert line. |
| alert crossed | Points between the lines. |
| action crossed | Red alert naming the hour and dilation. |
| descent | Fifths palpable as circles on a dashed line. |
| FHR and contractions | Hourly row, flagged. |
| empty | No exams yet. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `dilation` | Array<[hours, cm]> | required |
| `descent` | Array<[hours, fifths 0-5]> | [] |
| `fhr` | Array<[hours, bpm]> | [] |
| `contractions` | Array<[hours, per 10 min]> | [] |
| `hours` | number | 12 |
| `subtitle` | string | 'Active phase, alert line at 1 cm per hour, action line 4 hours to the right' |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | 'ed' when no global context is set |

## Usage

```jsx
<PartogramChart dilation={[[0,4],[2,6],[4,8]]} descent={[[0,4],[4,2]]} fhr={fhr} />
```

## Accessibility

- The chart has an aria-label listing every exam; FHR and contractions are also a table.
- Lines are labelled Alert and Action in text, not only colour.

## Do and don't

- **Do:** Plot every exam at its real hour.
- **Don't:** Treat the chart as a diagnosis; it prompts review.
