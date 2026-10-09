# IconRail

IconRail is the Focus Rail style's 64px slate icon rail with tooltips, leaving the most room for the chart.

**From the screens:** `.cs-rail` (64px, `nav-bg`), `.cs-ri` 44 by 40 icons, `.cs-tip` tooltips, `.cs-sep` separators between groups.

## When to use

- Focus Rail style on desktop.

## When not to use

- Any place where labels must be visible for new staff: SidebarNav.

## Variants and states

| Variant | What it is |
|---|---|
| default | Muted icons on `nav-bg`. |
| active | `primary` fill. |
| badge | Count bubble. |
| tooltip | Name on hover and focus. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `items` | Array<{label, icon, href?, badge?} \| {separator:true}> | required |
| `active` | string | none |
| `showTip` | string: force a tooltip open for docs | none |
| `inline` | boolean | false |

## Usage

```jsx
<IconRail items={RAIL_ITEMS} active="Patients" />
```

## Accessibility

- Each item has aria-label; tooltips appear on focus too.
- Inactive icons use `nav-ink-muted` (white at 72% on slate), 8.4:1.

## Do and don't

- **Do:** Keep the same order as the sidebar groups, with separators between groups.
- **Don't:** More than about 12 icons.
