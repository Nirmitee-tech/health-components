# PainScale

PainScale records pain on the 0 to 10 numeric scale, a faces scale for children, or FLACC for patients who cannot self-report, with severity band and goal check.

**Built from:** Card, SegmentedControl, Badge. Every number goes through `CareOS.fmt` and renders as `ClinicalValue` (tabular figures, unit always shown, fixed precision per measure, reference range on hover, H / L / HH / LL flags).

## When to use

- Pain assessment and reassessment after PRN analgesia.

## When not to use

- Neonates: use NIPS or N-PASS.
- Sedated ICU patients: CPOT or BPS.

## Variants and states

| Variant | What it is |
|---|---|
| numeric | 0 to 10 buttons. |
| faces | Six faces at 0, 2, 4, 6, 8, 10 with words. Drawn faces only; licensed Wong-Baker artwork is not bundled. |
| FLACC | Five categories scored 0 to 2, total 0 to 10. |
| bands | No pain, Mild 1 to 3, Moderate 4 to 6, Severe 7 to 10. |
| goal | Above or at the patient goal. |
| single mode | Pass one entry in `modes` to hide the switch. |
| readOnly | Not selectable. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `modes` | ('numeric' | 'faces' | 'flacc')[] | all three |
| `defaultMode` | string | 'numeric' |
| `defaultValue` | number 0 to 10 | none |
| `defaultFlacc` | Record<category, 0 | 1 | 2> | {} |
| `goal` | number | none |
| `reassess` | string | "60 min" |
| `readOnly` | boolean | false |
| `onChange` | ({mode, score}) => void | none |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | 'inpatient' when no global context is set |

## Usage

```jsx
<PainScale defaultValue={7} goal={3} reassess="30 min" />
```

## Accessibility

- Every scale is a radiogroup; faces carry text, not only a drawing.
- Score and band in a polite live region.

## Do and don't

- **Do:** Record the patient goal and compare against it.
- **Don't:** Use FLACC for a patient who can rate their own pain.
