# StyleChooser

StyleChooser picks the practice style (Classic, Clinical Sidebar, Focus Rail, Command Bar) with Preview and Apply to practice.

**From the screens:** set-appearance style cards. Built from: StatCard frame, Badge, Button.

## When to use

- Settings, Appearance.

## When not to use

- Per-user theme switches elsewhere.

## Variants and states

| Variant | What it is |
|---|---|
| current | Practice setting tag. |
| no permission | Apply disabled; Preview still works. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `styles` | Array<{id, name, who, swatch: string[], current?}> | required |
| `value` | string | 'classic' |
| `canApply` | boolean | false |

## Usage

```jsx
<StyleChooser canApply={isAdmin} value={previewed} onChange={setPreviewed} onApply={savePracticeStyle} />
<StyleChooser canApply={isAdmin} styles={STYLES} defaultValue="classic" />
```

## Accessibility

- Preview buttons carry radio semantics.

## Do and don't

- **Do:** Say who each style suits.
- **Don't:** Apply without a preview.
