# CensusList

CensusList is the unit or service list of current inpatients with bed, level of care, length of stay against the expected stay, last vitals with flags, isolation and expected discharge.

## When to use

- Hospitalist and charge nurse lists, handoff, discharge huddles.

## When not to use

- Bed-by-bed layout: BedBoard.

## Variants and states

| Variant | What it is |
|---|---|
| filters | All, Discharge today, Isolation, Critical vitals, Observation, each with a count. |
| LOS over expected | Flagged H with the GMLOS below. |
| critical vitals | H! or L! in red. |
| pending level | Arrow to the requested level. |
| loading | Skeleton rows. |
| empty | No results with how to clear. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `rows` | Array of { bed, name, mrn, age, sex, dx, level, pendingTo, los, gmlos, vitals: [{ measure, value }], isolation, organism, attending, edd, dischargeToday } | required |
| `defaultFilter` | 'all' \| 'dc' \| 'iso' \| 'flag' \| 'obs' | 'all' |
| `loading` | boolean | false |
| `pageSize` | number | 10 |
| `title / subtitle` | string | 'Census' |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | 'inpatient' when no global context is set |
| `filter / onFilterChange` | controlled filter; onFilterChange(filter) | uncontrolled from `defaultFilter` |

## Clinical values

Every number goes through the clinical value rules: tabular digits, unit always shown, fixed precision per measure (temperature 0.1 °C, potassium 0.1 mmol/L, creatinine 0.01 mg/dL, heart rate whole bpm), the reference range in the tooltip and H, L, H! or L! flags. Doses drop trailing zeros and keep a leading zero (0.5 mg, 5 mg).

## Usage

```jsx
<CensusList rows={census} subtitle="Hospital Medicine, Team B" />
```

## Accessibility

- Built on DataTable: sortable headers with aria-sort.
- Flags are read out ("Heart rate 132 bpm, Critical high").

## Do and don't

- **Do:** Pass the lab or unit range when it differs from the defaults.
- **Don't:** Show vitals older than the shift without the time.
