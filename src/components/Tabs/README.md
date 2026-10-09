# Tabs

Tabs switch between views of the same record or list: line tabs under a header, or pill tabs, both with optional counts.

**From the screens:** `.tabs` `.tab` (2px `primary` underline, 14px 500 `muted` labels) on 108 screens. Pill tabs and counts reuse `.cs-pill` and the badge styles.

## When to use

- Views of one thing: claim Overview, Lines, History; queue All, Mine, Overdue.

## When not to use

- Moving through steps: Stepper.
- Separate screens in a chart: SectionNav.

## Variants and states

| Variant | What it is |
|---|---|
| line | Default, under page or card titles. |
| pill | Inside cards and toolbars. |
| counts | Number per tab; `alert` makes it red. |
| disabled | Not available to this role. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `items` | Array<{id, label, count?, alert?, disabled?}> | required |
| `value / defaultValue` | string | first |
| `variant` | 'line' \| 'pill' | 'line' |
| `label` | string: aria-label | none |
| `onChange` | (id) => void | none |

## Usage

```jsx
<Tabs items={[{ id: "o", label: "Overview" }, { id: "l", label: "Lines", count: 3 }]} value={tab} onChange={setTab} />
```

## Accessibility

- tablist, tab, aria-selected; arrow keys move between tabs (roving tabindex).
- Home and End jump to the first and last tab; disabled tabs are skipped. Give items a `panelId` to set aria-controls; each tab's id is `<id>-<item.id>` for the panel's aria-labelledby.

## Do and don't

- **Do:** "Needs Review 4" as a count, red when overdue.
- **Don't:** Tabs that submit or save.
