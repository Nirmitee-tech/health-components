# SplitButton

SplitButton pairs a main action with a menu of related ones, such as Submit Claim with Submit and Print.

**From the screens:** Composed from `.btn` and the row menu (`.mwrap` `.menu` `.mi`), as used for export and submit options on bill-claims and rep-run.

## When to use

- One action is clearly the default and two to five variations exist: Submit Claim, Submit and Print, Save as Draft.

## When not to use

- The options are equally likely: use separate buttons.
- The menu holds unrelated actions: use a KebabMenu.

## Variants and states

| Variant | What it is |
|---|---|
| primary | Main action filled. |
| secondary | Outlined, for less important groups such as Export. |
| open | Menu shown; closes on Escape or outside click. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `label` | string | required |
| `onClick` | () => void | none |
| `items` | Array<{label, hint?, icon?, danger?, disabled?, onSelect?}> | required |
| `variant` | 'primary' \| 'secondary' | 'primary' |
| `size` | 'sm' \| 'md' | 'md' |
| `menuLabel` | string: aria-label of the arrow | "More options" |
| `defaultOpen` | boolean | false |

## Usage

```jsx
<SplitButton label="Submit Claim" onClick={submit}
  items={[{ label: "Submit and Print CMS-1500", onSelect: submitPrint }, { label: "Save as Draft", onSelect: saveDraft }]} />
```

## Accessibility

- The arrow is its own button with aria-haspopup="menu" and aria-expanded.
- Escape closes the menu.

## Do and don't

- **Do:** "Submit Claim" with "Submit and Print CMS-1500" and "Save as Draft" in the menu.
- **Don't:** Hiding "Void Claim" in a split menu under "Submit Claim".
