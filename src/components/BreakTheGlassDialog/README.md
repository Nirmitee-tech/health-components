# BreakTheGlassDialog

BreakTheGlassDialog asks for a reason before opening a restricted chart and says the access is logged.

**From the screens:** chart-btg. Built from: Modal (destructive), Alert (btg), DescriptionList, RadioGroup, TextArea.

## When to use

- Opening restricted charts (staff patients, behavioral health, VIP).

## When not to use

- Normal charts.

## Variants and states

| Variant | What it is |
|---|---|
| reasons | Emergency, covering, patient asked, other with text. |
| confirm disabled | Until a reason is given. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `patient / dob / careTeam` | string | required |
| `reason` | string | default text |
| `note` | string | none |
| `onConfirm / onClose` | ({reason, note}) => void / () => void | none |
| `inline` | boolean | false |
| `open` | boolean | true |
| `accessReason / onAccessReasonChange` | string / (reason) => void | none selected |
| `loading` | boolean | false |

## Usage

```jsx
<BreakTheGlassDialog patient="Nora Scott" dob="06/11/1999" careTeam="Mandy Harley LCSW" onConfirm={openChart} />
```

## Accessibility

- alertdialog.

## Do and don't

- **Do:** Say who reviews the log.
- **Don't:** Pre-select a reason.
