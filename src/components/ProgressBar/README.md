# ProgressBar

ProgressBar shows progress of a task or how much of an allowance is used, such as PA units used 12 of 20.

**From the screens:** `.bar` (8px, `border` track, `primary` fill) on 23 screens, `.prog` and `.meter` on mobile and telehealth.

## When to use

- Authorized units or visits used, upload progress, onboarding completeness.

## When not to use

- Unknown duration: Spinner.

## Variants and states

| Variant | What it is |
|---|---|
| progress | role progressbar. |
| meter | role meter, for allowances. |
| thresholds | Turns warning then danger at set percentages. |
| tones | primary, success, warning, danger, ai. |
| compact | Bar only, for tables and file rows. |
| lg | 12px. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `value` | number | required |
| `max` | number | 100 |
| `label` | string | required |
| `unit` | string: "visits" gives "12 of 20 visits used" | none |
| `valueText` | string | auto |
| `meter` | boolean | false |
| `thresholds` | [warnPct, dangerPct] | none |
| `tone` | 'primary' \| 'success' \| 'warning' \| 'danger' \| 'ai' | auto |
| `compact` | boolean | false |
| `helper` | string | none |

## Usage

```jsx
<ProgressBar label="PA units used" value={12} max={20} unit="visits" meter thresholds={[75, 90]} />
```

## Accessibility

- aria-valuenow, valuemax and a valuetext in words.
- The number is always shown as text too.

## Do and don't

- **Do:** "12 of 20 visits used" with "Expires 12/31/2026" helper.
- **Don't:** A bar with no number.
