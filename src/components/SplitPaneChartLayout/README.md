# SplitPaneChartLayout

SplitPaneChartLayout is the three-pane chart workspace: a resizable left section nav, the note in the middle and a resizable right context panel that can close.

## When to use

- Writing a note while looking at results, medications or a CDS card.

## When not to use

- Phone width: panes stack. Simple pages: use the page layout.

## Variants and states

| Variant | What it is |
|---|---|
| default | Left 220px, right 300px. |
| left collapsed | 44px rail with an expand button. |
| right closed | A floating button reopens it. |
| resizing | Drag the divider, or focus it and use Left and Right (Shift for bigger steps). |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `nav` | node | none |
| `children` | node: the note | none |
| `context` | node | none |
| `rightTitle` | string | 'Context' |
| `leftWidth / rightWidth` | number | 220 / 300 |
| `defaultLeftCollapsed` | boolean | false |
| `defaultRightOpen` | boolean | true |
| `height` | number | 420 |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | the global context, else 'outpatient' |

## Clinical values

Every number renders through CareOS.ClinicalValue and CareOS.fmt (the clinical-values builder), matched by LOINC; measures that table lacks (NT-proBNP, lactate, vancomycin trough, CrCl, PHQ-9, per-kg doses) use a local table with the same rules: tabular figures, the unit always shown, fixed decimals per measure (potassium 1, sodium 0, creatinine 2), the reference range in the title or beside it, and H, L, HH or LL flags in words for screen readers. The flag says where the number sits against the adult reference range in the rules table; it does not say the number was measured correctly.

## Usage

```jsx
<SplitPaneChartLayout nav={<SectionNav />} context={<ResultsTrendPanel groups={g} />} rightTitle="Results">{note}</SplitPaneChartLayout>
```

## Accessibility

- Dividers are role separator with aria-valuenow and keyboard resizing.
- Each pane is a landmark: nav, main, aside.

## Do and don't

- **Do:** Keep the patient banner above the layout.
- **Don't:** Put a second scroll bar inside the note.
