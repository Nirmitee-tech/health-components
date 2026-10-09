# NursingAssessment

NursingAssessment is the head-to-toe shift assessment: one row per body system with a WDL or Exception choice, finding chips and a note for exceptions.

**Built from:** Card, Button, Badge, ProgressBar. Every number goes through `CareOS.fmt` and renders as `ClinicalValue` (tabular figures, unit always shown, fixed precision per measure, reference range on hover, H / L / HH / LL flags).

## When to use

- Admission and every-shift assessments on inpatient units.

## When not to use

- Provider physical exam: use the note template.
- A single focused assessment such as wound or pain: WoundCareDoc, PainScale.

## Variants and states

| Variant | What it is |
|---|---|
| not assessed | Shows what WDL means for the system. |
| WDL | Within defined limits; shows the unit definition. |
| Exception | Finding chips plus a free-text note. |
| Mark remaining WDL | Fills only untouched systems. |
| signed | readOnly with Signed badge. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `systems` | {id, label, wdl, options?}[] | NursingAssessment.defaultSystems |
| `values` | Record<id, {wdl: boolean | null, findings: string[], note}> | all null |
| `readOnly` | boolean | false |
| `onChange` | (id, value) => void | none |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | 'inpatient' when no global context is set |

## Usage

```jsx
<NursingAssessment subtitle="Day shift, 08:20" systems={systems} values={saved} onChange={save} />
```

## Accessibility

- Each system is a group with a radiogroup for WDL or Exception.
- Finding chips are toggle buttons with aria-pressed.
- Progress is text plus a ProgressBar.

## Do and don't

- **Do:** Show the WDL definition so "WDL" is not a guess.
- **Don't:** Let "Mark remaining WDL" overwrite systems already charted.
