# Skeleton

Skeleton shows grey placeholder shapes while content loads.

**From the screens:** Addition asked for in the brief: no screen uses a skeleton (screens show a Spinner). Built from `surface-muted` and the radius scale.

## When to use

- Loads over about 300ms where the layout is known: table rows, cards, KPI values.

## When not to use

- Actions that run after a click: Button loading.

## Variants and states

| Variant | What it is |
|---|---|
| text | One or more lines; the last is shorter. |
| row | Table-like rows with an avatar circle. |
| card | A card placeholder. |
| avatar | Circle. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `variant` | 'text' \| 'row' \| 'card' \| 'avatar' | 'text' |
| `lines` | number | 1 |
| `rows` | number | 3 |
| `width` | CSS width | 100% |
| `label` | string: aria-label | "Loading" |

## Usage

```jsx
{loading ? <Skeleton variant="row" rows={5} /> : <PatientRows />}
```

## Accessibility

- aria-busy with a label; the pulse stops under prefers-reduced-motion.

## Do and don't

- **Do:** Match the shape of the content that will load.
- **Don't:** Skeletons for more than a few seconds: show progress or an error.
