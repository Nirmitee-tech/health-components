# Card

Card is the white container every screen section sits in, with an optional title, actions and footer.

**From the screens:** `.card` on 212 screens: `surface`, radius 8px, `shadow-card`, padding 16px, gap 12px. Command Bar and Dark swap the shadow for a 1px `border`.

## When to use

- Group one topic: Allergies, Claim lines, Coverage.

## When not to use

- Nesting a card in a card: use a divider or a DescriptionList.

## Variants and states

| Variant | What it is |
|---|---|
| default | Shadow (Sidebar, Rail) or border (Command, Dark). |
| flat | Always border, no shadow. |
| compact | 10px padding, Compact density. |
| no padding | For tables that run edge to edge. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `title` | string | none |
| `subtitle` | string | none |
| `actions` | node | none |
| `footer` | node | none |
| `flat` | boolean | false |
| `padding` | 'default' \| 'compact' \| 'none' | 'default' |
| `as` | tag name | section |

## Usage

```jsx
<Card title="Coverage" subtitle="Verified 10/08/2026" actions={<Button size="sm">Recheck</Button>}>
  <DescriptionList items={[["Payer", "Aetna PPO"]]} />
</Card>
```

## Accessibility

- The title is an h2, so cards build the page outline.

## Do and don't

- **Do:** One primary action in the card header at most.
- **Don't:** Coloured left borders as decoration.
