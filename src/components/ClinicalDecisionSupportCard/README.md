# ClinicalDecisionSupportCard

ClinicalDecisionSupportCard renders one CDS Hooks card: info, warning or critical indicator, summary, detail, the values behind it, suggestions to apply, links, and an override that needs a reason.

## When to use

- Showing a CDS Hooks service response at order-select, order-sign or patient-view.

## When not to use

- Drug-drug or allergy checks inside e-prescribing: DrugInteractionAlert.

## Variants and states

| Variant | What it is |
|---|---|
| info | Blue edge. |
| warning | Amber edge and wash. |
| critical | Red edge, role alert; the override button says Override. |
| suggestions | Recommended suggestion is the primary button. |
| overriding | Reason select (plus free text for Other); Continue disabled until a reason is given. |
| accepted / overridden | Collapsed result line with the reason. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `card` | {summary, detail?, indicator, source?: {label}, values?: {code, value, over?}[], suggestions?: {label, isRecommended?}[], links?: {label, type?}[], overrideReasons?: {code, display}[]} | required |
| `defaultState` | 'open' \| 'accepted' \| 'overridden' | 'open' |
| `overrideReason` | string: shown when defaultState is overridden | none |
| `onOverride` | (reasonCode) => void | none |
| `feedback` | boolean | true |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | the global context, else 'outpatient' |

## Clinical values

Every number renders through CareOS.ClinicalValue and CareOS.fmt (the clinical-values builder), matched by LOINC; measures that table lacks (NT-proBNP, lactate, vancomycin trough, CrCl, PHQ-9, per-kg doses) use a local table with the same rules: tabular figures, the unit always shown, fixed decimals per measure (potassium 1, sodium 0, creatinine 2), the reference range in the title or beside it, and H, L, HH or LL flags in words for screen readers. The flag says where the number sits against the adult reference range in the rules table; it does not say the number was measured correctly.

## Usage

```jsx
<ClinicalDecisionSupportCard card={hooksCard} onOverride={log} />
```

## Accessibility

- Critical cards use role alert; others are labelled regions.
- Values carry their flag in words and show the reference range.

## Do and don't

- **Do:** Name the source of the rule.
- **Don't:** Let a critical card be dismissed with no reason.
