# CareTeamPanel

CareTeamPanel lists everyone caring for the patient, inside and outside the practice, with role, specialty, NPI, last contact and call or message actions.

## When to use

- Chart sidebar, referral routing, care coordination and transitions of care.

## When not to use

- Staff scheduling: ProviderDayColumns.

## Variants and states

| Variant | What it is |
|---|---|
| internal | Primary avatar, message action. |
| outside | Accent avatar, Outside tag, no secure message. |
| primary | PCP tag (or a custom label). |
| ended | Dimmed with end date. |
| empty | Asks to add the PCP. |
| readOnly | No add or row menu. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `members` | Array<{name, role, specialty?, org?, npi?, phone?, primary?, primaryLabel?, external?, status?, ended?, lastSeen?, presence?}> | [] |
| `updated` | string | none |
| `readOnly` | boolean | false |
| `title` | string | 'Care Team' |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | the global context, else 'outpatient' |

## Clinical values

Every number renders through CareOS.ClinicalValue and CareOS.fmt (the clinical-values builder), matched by LOINC; measures that table lacks (NT-proBNP, lactate, vancomycin trough, CrCl, PHQ-9, per-kg doses) use a local table with the same rules: tabular figures, the unit always shown, fixed decimals per measure (potassium 1, sodium 0, creatinine 2), the reference range in the title or beside it, and H, L, HH or LL flags in words for screen readers. The flag says where the number sits against the adult reference range in the rules table; it does not say the number was measured correctly.

## Usage

```jsx
<CareTeamPanel members={team} />
```

## Accessibility

- Icon buttons name the person and the number.

## Do and don't

- **Do:** Show NPI for outside clinicians.
- **Don't:** Delete an ended relationship: end it.
