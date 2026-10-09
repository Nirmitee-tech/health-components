# ButtonGroup

ButtonGroup lays out related buttons with the 8px gap the screens use, or joins them into one attached control.

**From the screens:** The `.row` of buttons in every page header (`.ph`) and modal footer (`.mf`), gap 8px.

## When to use

- Page header actions: "Care gaps (3 open)", "Outside records (HIE)", "For developers".
- Modal footers, right aligned (`align="end"`).
- Attached: a small view switch such as Day, Week, Month on the calendar.

## When not to use

- Choosing one value from a set inside a form: use SegmentedControl, which is a radio group.

## Variants and states

| Variant | What it is |
|---|---|
| default | Buttons with 8px gaps, wraps on narrow screens. |
| attached | Joined borders, no gap. |
| align end | Right aligned, for footers. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `attached` | boolean | false |
| `align` | 'start' \| 'end' | 'start' |
| `label` | string: aria-label of the group | none |
| `children` | Buttons | required |

## Usage

```jsx
<ButtonGroup align="end">
  <Button onClick={cancel}>Cancel</Button>
  <Button variant="primary" onClick={save}>Save Changes</Button>
</ButtonGroup>
```

## Accessibility

- The group has role group; give it a label when the buttons only make sense together.
- Primary goes last in a footer, so the reading order ends on the main action.

## Do and don't

- **Do:** Footer: Cancel, then Save Changes.
- **Don't:** More than four buttons in a header: move the rest into a SplitButton or KebabMenu.
