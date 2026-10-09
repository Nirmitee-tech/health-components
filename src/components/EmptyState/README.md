# EmptyState

EmptyState fills a screen or card that has nothing to show, including the access-denied screen.

**From the screens:** "You do not have access to this screen" block (56px circle on `surface-alt`, padding 56px 16px) on 168 screens.

## When to use

- No data yet, no search results, no access, load failed.

## When not to use

- A table with filters applied: use the table empty row.

## Variants and states

| Variant | What it is |
|---|---|
| empty | Inbox icon, what will appear here, first action. |
| noresults | Search icon, how to widen the search. |
| denied | Lock icon, the missing permission and who can grant it. |
| error | Red circle, what failed and Try Again. |
| compact | 24px padding, inside cards. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `kind` | 'empty' \| 'noresults' \| 'denied' \| 'error' | 'empty' |
| `title` | string | required |
| `children` | body text | none |
| `actions` | node | none |
| `icon` | icon name | by kind |
| `compact` | boolean | false |

## Usage

```jsx
<EmptyState kind="noresults" title="No patients match" actions={<Button>Clear Filters</Button>}>Try the MRN or date of birth.</EmptyState>
```

## Accessibility

- denied and error use role alert.

## Do and don't

- **Do:** Denied: name the permission ("Manage claims") and the person (Practice Admin).
- **Don't:** "Oops!"
- **Don't:** Hiding the screen from the menu and then showing a denied page from a link: same rule both places.
