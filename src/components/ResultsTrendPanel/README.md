# ResultsTrendPanel

ResultsTrendPanel shows many lab results over time, grouped by LOINC panel, as a grid of sparkline tiles or as a date-by-test table.

## When to use

- Reviewing trends before a visit or a dose change: renal function on an ACE inhibitor, hemoglobin on chemotherapy, A1c over a year.

## When not to use

- A single new result to sign: ResultsReview. One panel in one draw: LabResultTable.

## Variants and states

| Variant | What it is |
|---|---|
| Sparklines | One tile per test: latest value, flag, sparkline, reference range, change since the previous draw. |
| Table | Rows are tests grouped by panel; columns are draw dates; "--" when not drawn. |
| flagged tile | Amber bar for H or L, red border for HH or LL. |
| empty | No results in the period. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `groups` | Array<{name, panel?, items: {code, over?, points: {date, value}[]}[]}> | [] |
| `defaultView` | 'grid' \| 'table' | 'grid' |
| `maxColumns` | number: newest draw dates kept in the table | all |
| `title / subtitle` | string | 'Results Trend' |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | the global context, else 'outpatient' |

## Clinical values

Every number renders through CareOS.ClinicalValue and CareOS.fmt (the clinical-values builder), matched by LOINC; measures that table lacks (NT-proBNP, lactate, vancomycin trough, CrCl, PHQ-9, per-kg doses) use a local table with the same rules: tabular figures, the unit always shown, fixed decimals per measure (potassium 1, sodium 0, creatinine 2), the reference range in the title or beside it, and H, L, HH or LL flags in words for screen readers. The flag says where the number sits against the adult reference range in the rules table; it does not say the number was measured correctly.

## Usage

```jsx
<ResultsTrendPanel groups={groups} defaultView="table" maxColumns={6} />
```

## Accessibility

- The view switch is a radio group.
- The table has a hidden caption, row headers per test and column-group headers per panel.
- Each value carries its unit and flag in its accessible name.

## Do and don't

- **Do:** Keep LOINC codes visible so outside results line up.
- **Don't:** Draw a sparkline across tests with different units.
