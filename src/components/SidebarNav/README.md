# SidebarNav

SidebarNav is the Clinical Sidebar style's grouped left navigation, 240px wide, collapsing to a 64px icon strip.

**From the screens:** `.cs-side` in Shell: groups Clinical, Front office, Revenue, Insights, Admin (`.cs-gl` 11px uppercase), items `.cs-ni` with the active inset bar, collapse button at the bottom.

## When to use

- Clinical Sidebar style on desktop.

## When not to use

- Phones: BottomTabBar.
- Focus Rail and Command Bar styles.

## Variants and states

| Variant | What it is |
|---|---|
| expanded | 240px with group labels. |
| collapsed | 64px icons; labels move to title and screen-reader text. |
| active | `primary-soft` with a 3px `primary` inset bar. |
| badge | Count on Inbox. |
| locked | Lock icon on items the role can only view. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `groups` | Array<{label, items: Array<{label, icon, href?, badge?, locked?}>}> | required |
| `active` | string | none |
| `collapsed` | boolean | false |
| `product` | string | "CareOS" |
| `onCollapse` | (collapsed) => void | none |
| `inline` | boolean: bordered, for docs | false |

## Usage

```jsx
<SidebarNav groups={NAV_GROUPS_FOR_ROLE} active="Schedule" collapsed={prefs.collapsed} onCollapse={saveCollapsed} />
```

## Accessibility

- nav "Main"; aria-current="page".
- Collapse button says "Collapse sidebar" or "Expand sidebar" and has aria-expanded.
- Items the role cannot use at all are removed (none level), not shown disabled.

## Do and don't

- **Do:** Same group order for every role; only the items change.
- **Don't:** Reorder groups per user.
