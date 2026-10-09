# SettingRow

SettingRow is the two-column settings row: label and help on the left, control on the right.

**From the screens:** `.set` `.sl` `.sh` on 31 settings screens.

## When to use

- Settings pages.

## When not to use

- Data entry forms: fields in a grid.

## Variants and states

| Variant | What it is |
|---|---|
| any control | Switch, Select, TextField. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `label` | string | required |
| `help` | string | none |
| `children` | control | required |

## Usage

```jsx
<SettingRow label="Density" help="Compact fits more rows."><SegmentedControl options={["Comfortable", "Compact"]} /></SettingRow>
```

## Accessibility

- Label the control itself too.

## Do and don't

- **Do:** One setting per row.
- **Don't:** Hide what a setting does.
