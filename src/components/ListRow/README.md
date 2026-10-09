# ListRow

ListRow is the 56px tappable row used for lists on phone and portal screens.

**From the screens:** `.li` `.lic` and `.rowb` on 29 phone, portal and kiosk screens.

## When to use

- Lists of patients, messages, settings on phones.

## When not to use

- Desktop tables: DataTable.

## Variants and states

| Variant | What it is |
|---|---|
| static / button | onClick makes it a button with a chevron. |
| leading / trailing | Avatar, badge. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `title` | string | required |
| `meta` | string | none |
| `leading / trailing` | node | none |
| `onClick` | () => void | none |

## Usage

```jsx
<ListRow leading={<Avatar name="Henna West" size="sm" />} title="Henna West" meta="9:20 AM . Follow-Up" onClick={open} />
```

## Accessibility

- Whole row is one button.

## Do and don't

- **Do:** Two lines max.
- **Don't:** Nested buttons inside a button row.
