# DescriptionList

DescriptionList shows label and value pairs in two columns, such as Patient, Date of Birth and MRN.

**From the screens:** `dl.kv` (160px label column, 13px, `muted` labels) on 161 screens; collapses to one column under 640px.

## When to use

- Read-only record details in cards, drawers and confirm dialogs.

## When not to use

- Editable forms: use fields.

## Variants and states

| Variant | What it is |
|---|---|
| default | 160px label column. |
| compact | 120px label column. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `items` | Array<[label, value]> | required |
| `compact` | boolean | false |

## Usage

```jsx
<DescriptionList items={[["Patient", "Nora Scott"], ["MRN", "MRN-100377"]]} />
```

## Accessibility

- Native dl, dt, dd.

## Do and don't

- **Do:** Show the claim number, payer and amount in a destructive confirm.
- **Don't:** Put actions inside the value column.
