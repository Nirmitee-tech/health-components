# ProblemList

ProblemList is the coded problem list with ICD-10 codes, onset, chronic and HCC tags, filtered by Active, Resolved or All.

**From the screens:** pat-chart-problems. Built from: Card, SegmentedControl, Badge, ICD10Picker.

## When to use

- Chart Problems section; assessment review.

## When not to use

- Encounter diagnoses on a claim: ClaimForm.

## Variants and states

| Variant | What it is |
|---|---|
| active / resolved / all | Filter. |
| chronic | Info tag. |
| HCC | Outline tag for risk adjustment. |
| readOnly | Hides the add picker. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `items` | Array<{code, label, onset?, by?, chronic?, hcc?, status?}> | required |
| `icdOptions` | Array<{code,label}> | [] |
| `readOnly` | boolean | false |

## Usage

```jsx
<ProblemList items={problems} icdOptions={icd10} />
```

## Accessibility

- Code and words both shown.

## Do and don't

- **Do:** Keep resolved problems for history.
- **Don't:** Free-text problems without a code.
