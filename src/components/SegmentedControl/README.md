# SegmentedControl

SegmentedControl switches between two to five views or values in one compact bar.

**From the screens:** `.seg` (grey track, white selected segment with `shadow-seg`) on 10 phone and portal screens.

## When to use

- View switches: Upcoming, Past; Day, Week, Month; Comfortable, Compact.

## When not to use

- More than five options or long labels: Tabs or Select.

## Variants and states

| Variant | What it is |
|---|---|
| md | 34px segments. |
| sm | 26px, dense toolbars. |
| counts | Number after the label. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `options` | Array<string \| {value, label, count?, disabled?}> | required |
| `value / defaultValue` | string | first |
| `size` | 'sm' \| 'md' | 'md' |
| `label` | string: aria-label | none |
| `onChange` | (value) => void | none |

## Usage

```jsx
<SegmentedControl label="Calendar view" options={["Day", "Week", "Month"]} value={view} onChange={setView} />
```

## Accessibility

- radiogroup with radio buttons and aria-checked.

## Do and don't

- **Do:** Density: Comfortable, Compact.
- **Don't:** Use it to submit.
