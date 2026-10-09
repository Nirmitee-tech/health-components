# MAR

MAR is the medication administration record: scheduled, PRN and continuous orders by time, with Given, Held, Refused, Late and Due states, a two-scan five rights check, a witness for high-alert drugs and co-sign.

**Built from:** Card, SegmentedControl, Badge, Button, BarcodeScanPrompt, ClinicalValue. Every number goes through `CareOS.fmt` and renders as `ClinicalValue` (tabular figures, unit always shown, fixed precision per measure, reference range on hover, H / L / HH / LL flags).

## When to use

- Inpatient medication pass on any unit.
- Reviewing what was given, held or refused this shift.

## When not to use

- Ordering or reconciling medications: MedicationList and MedReconciliation.
- Outpatient prescriptions: PrescriptionForm.

## Variants and states

| Variant | What it is |
|---|---|
| Scheduled | Given (green), Due (amber), Late (red), Held and Refused (grey, with reason), Scheduled (future, outline). |
| PRN | PRN available cell; indication and reassessment window shown in the panel. |
| Continuous | Running state with the current rate in mL/h. |
| High-alert | Red High-alert badge; Given stays disabled until a witness is entered. |
| Co-sign | Records co-sign Pending against the dose. |
| Administer panel | Opens from a Due or Late cell: scan wristband, scan drug, five rights list, reason, Given / Held / Refused. |
| Scan mismatch | Red scan step and red rights; Given stays disabled. |
| readOnly | View only; cells are not buttons. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `rows` | MarRow[] | required |
| `times` | string[]: column times | required |
| `nowTime` | string | none |
| `patientName / patientBarcode` | string | none |
| `nurse` | string: who records | "You" |
| `now` | string | scheduled time |
| `defaultActive` | {row, time} | none |
| `defaultScans` | {patient?: boolean, med?: boolean} | {} |
| `defaultWitness` | string | "" |
| `defaultFilter` | 'all' | 'scheduled' | 'prn' | 'continuous' | 'all' |
| `readOnly` | boolean | false |
| `onRecord` | (event) => void | none |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | 'inpatient' when no global context is set |

## Usage

```jsx
<MAR times={["08:00","12:00","16:00","20:00"]} nowTime="12:00" patientName="Marcus Hill" patientBarcode="MRN0048213" rows={rows} onRecord={post} />
```

## Accessibility

- Table with caption; each actionable cell is a button named with drug, time and status.
- Scan results are announced through a live region.
- Disabled Given says why next to it in text.
- Status is a word in a pill, never colour alone.

## Do and don't

- **Do:** Record the reason with every Held or Refused dose.
- **Do:** Show the drip rate on continuous rows.
- **Don't:** Allow Given before both scans match.
- **Don't:** Let one nurse witness their own high-alert dose.
