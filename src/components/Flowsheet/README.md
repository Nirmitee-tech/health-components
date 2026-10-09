# Flowsheet

Flowsheet is the nurse charting grid: measures down the side, times across the top, with add column, edit in place, abnormal shading, collapsible groups and a graph view.

**Built from:** Card, SegmentedControl, Badge, Button, ClinicalValue. Every number goes through `CareOS.fmt` and renders as `ClinicalValue` (tabular figures, unit always shown, fixed precision per measure, reference range on hover, H / L / HH / LL flags).

## When to use

- Hourly or q4h vitals, neuro checks, drips and I&O on an inpatient or ICU unit.
- Any repeated measure where the nurse needs to compare across time.

## When not to use

- One set of vitals at a clinic visit: VitalsPanel.
- Lab results with reference columns: LabResultTable.

## Variants and states

| Variant | What it is |
|---|---|
| grid | Default. Rows grouped (Vitals, Neuro, Drips, I&O); select a cell to edit, Enter saves, Esc cancels. |
| graph | One small trend chart per numeric row, normal band shaded green, abnormal points coloured. |
| abnormal | Amber cell plus H or L flag; critical is red cell plus HH or LL. |
| collapsed group | Group header keeps a count of abnormal values inside. |
| new column | Add column appends the next charting time. |
| readOnly | View only badge; cells are not buttons. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `rows` | {id, group, label, measure, range?, values: Record<colId, number|string>}[] | required |
| `columns` | {id, label}[] | required |
| `nowColumn` | string: column to mark as current | none |
| `nextTime` | (columns) => string | "New" |
| `defaultView` | 'grid' | 'graph' | 'grid' |
| `defaultCollapsed` | string[] of group names | [] |
| `defaultEditing` | string 'rowId|colId' | none |
| `readOnly` | boolean | false |
| `onChange` | (rowId, colId, value) => void | none |
| `onAddColumn` | (column) => void | none |
| `title / subtitle` | string | "Flowsheet" |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | 'inpatient' when no global context is set |

## Usage

```jsx
<Flowsheet title="Vitals and I&O" columns={cols} rows={rows} nowColumn="c6" nextTime={c => '16:00'} onChange={save} />
```

## Accessibility

- Real table with caption, row headers and column headers; sticky first column.
- Each cell is a button named "Edit Heart rate at 12:00, now 118 bpm".
- Flags are letters plus words for screen readers; colour is never the only signal.
- Graph view has an aria-label listing every value.

## Do and don't

- **Do:** Pass the patient's own range (for example a COPD SpO2 target) through `range` on the row.
- **Don't:** Hide abnormal rows inside a collapsed group without the count.
