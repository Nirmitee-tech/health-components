# CodeStatusBanner

CodeStatusBanner shows code status and advance directive, red for DNR, DNI or comfort care and green for Full Code.

**From the screens:** chart-advance and the Code status tag in the patient banner. Built from: Icon, Button.

## When to use

- Top of chart, inpatient-style handoff, on-call mobile.

## When not to use

- Inside lists: Badge.

## Variants and states

| Variant | What it is |
|---|---|
| full code | Green, heart icon. |
| DNR / DNI / comfort | Red, alert icon, role alert. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `status` | string | required |
| `directive / polst / proxy` | string | none |
| `onViewDocuments` | () => void | none |
| `documentsHref` | string: makes View Documents a link | none |

## Usage

```jsx
<CodeStatusBanner status="DNR / DNI" polst="03/02/2026" proxy="Maria Edwards (wife)" />
```

## Accessibility

- DNR uses role alert.

## Do and don't

- **Do:** Link to the signed documents.
- **Don't:** Show a status with no document behind it.
