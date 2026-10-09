# FilterChip

FilterChip toggles a quick filter above a list, such as Rejected or Needs Review, and can show a count.

**From the screens:** `.chipb` pills (radius 999, 13px 500, filled `primary` when on) on 51 screens.

## When to use

- Quick filters over a table or queue.
- Removable active filters (with onRemove).

## When not to use

- Mutually exclusive views: SegmentedControl or Tabs.

## Variants and states

| Variant | What it is |
|---|---|
| off | Outlined pill. |
| on | Primary fill with check. |
| count | Number bubble. |
| removable | x button to clear. |
| disabled | 45% opacity. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `children` | label | required |
| `selected / defaultSelected` | boolean |  |
| `count` | number | none |
| `check` | boolean: show the check when on | true |
| `onRemove` | () => void: removable chip | none |
| `onChange` | (on) => void | none |

## Usage

```jsx
<FilterChip selected={f.rejected} count={12} onChange={on => setF({ ...f, rejected: on })}>Rejected</FilterChip>
```

## Accessibility

- aria-pressed shows the state; the check icon adds a non-colour cue.

## Do and don't

- **Do:** "Rejected 12" over the claims queue.
- **Don't:** Chips that each open a different screen.
