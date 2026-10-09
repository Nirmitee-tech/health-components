# StatCard

StatCard shows one number with its label and context, and can act as a filter button.

**From the screens:** `.kpi` with `.kl` `.kv` `.ks` on 71 screens (dashboards, queues). Clickable KPIs filter the table under them (`.kpi.on`).

## When to use

- Top of dashboards and queues: Claims to Work 42, Denial Rate 6.2%.

## When not to use

- Numbers without a comparison or meaning.

## Variants and states

| Variant | What it is |
|---|---|
| static | Label, value, sub line. |
| trend | Arrow and change; good or bad sets the colour plus the arrow direction. |
| selectable | Button that filters the list; `is-on` ring. |
| meter | Inline ProgressBar. |
| loading | Skeleton for the value. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `label` | string, shown uppercase | required |
| `value` | string \| number | required |
| `sub` | string | none |
| `trend` | string, such as "1.4 pts" | none |
| `trendDir` | 'up' \| 'down' | 'up' |
| `trendGood` | boolean | none |
| `selected` | boolean | false |
| `onClick` | () => void: makes it a button | none |
| `meter` | {value, max, tone?} | none |
| `loading` | boolean | false |

## Usage

```jsx
<StatCard label="Claims to Work" value={42} sub="9 over 30 days" selected={kpi === "work"} onClick={() => setKpi("work")} />
```

## Accessibility

- Selectable cards are buttons with aria-pressed.
- Trend direction is an arrow character as well as a colour.
- Say what the number counts and over what period in the sub line.

## Do and don't

- **Do:** "Claims to Work 42, 9 over 30 days".
- **Don't:** A KPI that cannot be traced to a saved report.
