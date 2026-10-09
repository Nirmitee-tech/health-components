# QuickActions

QuickActions is the 3-column grid of big icon tiles on phone and portal home screens.

**From the screens:** `.qa` `.qb` on mob-home, mob-patient, portal-home, portal-records.

## When to use

- Phone and portal home.

## When not to use

- Desktop: buttons in the page header.

## Variants and states

| Variant | What it is |
|---|---|
| badge | Count on a tile. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `items` | Array<{label, icon, href?, badge?}> | required |

## Usage

```jsx
<QuickActions items={[{ label: "Book Visit", icon: "calendar" }, { label: "Messages", icon: "message", badge: 2 }]} />
```

## Accessibility

- Links with text labels, 44px tall.

## Do and don't

- **Do:** Six tiles at most.
- **Don't:** Icons without labels.
