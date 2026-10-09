# Pagination

Pagination shows the record range and lets staff change rows per page and move between pages.

**From the screens:** The table footer on 134 screens: "Rows per page" select (72px, 30px tall), Previous, page info, Next.

## When to use

- Under any paged table.

## When not to use

- Infinite scroll on phones.

## Variants and states

| Variant | What it is |
|---|---|
| default | Range, rows per page, Previous and Next. |
| first or last page | The edge button is disabled. |
| no size | pageSizes false hides the select. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `total` | number | required |
| `page` | number | 1 |
| `pageSize` | number | 10 |
| `pageSizes` | number[] \| false | [5,10,25,50] |
| `onPage` | (n) => void | none |
| `onPageSize` | (n) => void | none |

## Usage

```jsx
<Pagination total={248} page={page} pageSize={size} onPage={setPage} onPageSize={setSize} />
```

## Accessibility

- nav landmark named Pagination; the page info is aria-live.

## Do and don't

- **Do:** "Showing 11-20 of 248".
- **Don't:** Page number lists longer than the table.
