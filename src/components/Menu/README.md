# Menu

Menu lists actions in a dropdown; KebabMenu opens one from a three-dot button and Popover holds a small form or filter set.

**From the screens:** `.mwrap` `.menu` `.mi` row menus on 123 screens and the shell account and role menus (`.cs-menu`, `.cs-mh`).

Also exported from this card: `KebabMenu`, `Popover`.

## When to use

- Row actions in tables, overflow actions in headers, filter popovers.

## When not to use

- Navigation between screens: SidebarNav or Tabs.

## Variants and states

| Variant | What it is |
|---|---|
| Menu | Items with icon, hint, shortcut; heading, divider, danger item, disabled item, active item. |
| KebabMenu | Vertical or horizontal dots. |
| Popover | Titled panel with any content. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `items` | Array<{label, icon?, hint?, shortcut?, danger?, disabled?, active?, onSelect?} \| {divider:true} \| {heading}> | required |
| `align` | 'right' \| 'left' | 'right' |
| `inline` | boolean: static, for docs | false |
| `KebabMenu label` | string | "Row actions" |
| `Popover trigger / title / children` | string / string / node |  |

## Usage

```jsx
<KebabMenu label={"Actions for " + claim.id} items={[{ label: "Open Claim" }, { divider: true }, { label: "Void Claim", danger: true }]} />
<Popover trigger="Filters (2)" title="Filter claims">...</Popover>
```

## Accessibility

- role menu and menuitem; Escape and outside click close.
- Destructive items go last, after a divider.

## Do and don't

- **Do:** "Open Claim, Check Status, Assign to Me, divider, Void Claim".
- **Don't:** More than about 8 items.
