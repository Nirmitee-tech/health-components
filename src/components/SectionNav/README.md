# SectionNav

SectionNav is the left list of sections inside a record, such as the 20 sections of a patient chart.

**From the screens:** `.snav` in a `.side.card` on 44 screens (pat-chart sections, bill-claim-edit, settings).

## When to use

- Records with many sections that are separate pages.

## When not to use

- Two to six views: Tabs.

## Variants and states

| Variant | What it is |
|---|---|
| default | Active item on `primary-soft`. |
| counts | Number after the label. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `items` | Array<string \| {label, href?, count?}> | required |
| `active` | string | none |
| `label` | string | "Section menu" |
| `onChange` | (label) => void | none |

## Usage

```jsx
<SectionNav items={CHART_SECTIONS} active="Medications" onChange={goSection} />
```

## Accessibility

- nav landmark "Section menu", aria-current="page" on the active link.

## Do and don't

- **Do:** Keep the order the same for every patient.
- **Don't:** Hide sections per patient; show them empty.
