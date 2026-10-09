# DataTable

DataTable lists records with sorting, row selection with bulk actions, a row menu, expandable rows, empty and loading states, and pagination with rows per page.

**From the screens:** `.tbx` frame, `th .th` sort buttons, `td` 9px 12px, row menu `.mwrap`, "Rows per page" with Previous and Next (134 screens), "No records match your search or filters." (159 screens).

## When to use

- Any list of records staff work through: claims, PA queue, patients, appointments, audit log.

## When not to use

- Two or three items: a list in a card.
- Phone screens: list rows.

## Variants and states

| Variant | What it is |
|---|---|
| sortable | Header buttons with aria-sort. |
| selectable | Checkbox column, select all on page (indeterminate), bulk bar "N selected" with actions and Clear selection. |
| row menu | Kebab per row. |
| expandable | Chevron column opens a detail row. |
| empty | Message across all columns. |
| loading | Skeleton rows. |
| pagination | Rows per page 5, 10, 25, 50; Previous, Page N of M, Next. |
| density | Compact sets cell padding to 4px. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `columns` | Array<{key, label, sortable?, align?, render?}> | required |
| `rows` | Array<object> | required |
| `rowKey` | string | "id" |
| `selectable` | boolean | false |
| `bulkActions` | (selectedIds) => node | none |
| `rowMenu` | (row) => MenuItem[] | none |
| `renderExpanded` | (row) => node | none |
| `loading` | boolean | false |
| `emptyText / emptyState` | string / node | "No records match your search or filters." |
| `pageSize` | number | 10 |
| `pagination` | boolean | true |
| `defaultSort` | {key, dir} | none |
| `toolbar` | node | none |
| `caption` | string: screen reader caption | none |

## Usage

```jsx
<DataTable rows={claims} rowKey="id" selectable pageSize={10}
  columns={[{ key: "id", label: "Claim", sortable: true }, { key: "status", label: "Status", render: r => <StatusTag kind="claim" status={r.status} /> }]}
  bulkActions={ids => <Button size="sm" onClick={() => resubmit(ids)}>Resubmit</Button>}
  rowMenu={r => [{ label: "Open Claim", onSelect: () => open(r) }, { divider: true }, { label: "Void Claim", danger: true }]}
  renderExpanded={r => <ClaimLines claim={r} />} />
```

## Accessibility

- Sort buttons sit inside th with aria-sort.
- Row checkboxes are named after the first column ("Select CLM-20871").
- Row menus are named "Actions for CLM-20871".
- Numbers are right aligned with tabular figures.

## Do and don't

- **Do:** Put the status column near the left so it is seen first.
- **Do:** Keep row actions in the menu and the main action as a link on the record ID.
- **Don't:** Horizontal scroll inside a modal.
- **Don't:** Delete as the first item in a row menu.
