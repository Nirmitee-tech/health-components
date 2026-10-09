# InpatientOrderEntry

InpatientOrderEntry writes one inpatient medication order with dose, route, frequency, duration, PRN reason and priority, shows the order sentence as it is built, and tracks pharmacist verification.

## When to use

- CPOE for inpatient medication orders, and the pharmacist verification view of the same order.

## When not to use

- Outpatient prescriptions: the e-prescribing components.
- Order sets with many orders.

## Variants and states

| Variant | What it is |
|---|---|
| draft | Not signed. |
| PRN | Reason required; maximum in 24 hours shown. |
| priority | Routine, Now, STAT. STAT pages pharmacy. |
| pending | Pending pharmacist verification; pharmacist role gets Verify and Return. |
| verified | Pharmacist name and time. |
| rejected | Returned, with the pharmacist note. |
| override | Given before verification, reviewed after. |
| warnings | Dose, renal or interaction alerts. |
| readOnly | Locked. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `order` | { name, dose, unit, route, freq, prn, prnReason, maxDaily, duration, priority, weightBased, warnings: [{ tone, title, text }] } | required |
| `status` | 'draft' \| 'pending' \| 'verified' \| 'rejected' \| 'override' | 'draft' |
| `role` | 'prescriber' \| 'pharmacist' | 'prescriber' |
| `patient` | string | none |
| `verifiedBy / verifiedAt / pharmacist / pharmacistNote / overrideBy` | string | none |
| `showErrors / readOnly` | boolean | false |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | 'inpatient' when no global context is set |
| `value / onChange` | controlled draft { freq, prn, prnReason, priority, duration }; onChange(draft) | uncontrolled from `order` |
| `onSign` | function(draft, sentence): Sign Order | none |
| `onVerify / onReturn / onCancel` | function: pharmacist Verify, Return to Prescriber, Cancel | none |

## Clinical values

Every number goes through the clinical value rules: tabular digits, unit always shown, fixed precision per measure (temperature 0.1 °C, potassium 0.1 mmol/L, creatinine 0.01 mg/dL, heart rate whole bpm), the reference range in the tooltip and H, L, H! or L! flags. Doses drop trailing zeros and keep a leading zero (0.5 mg, 5 mg).

## Usage

```jsx
<InpatientOrderEntry patient="Ruiz, Carmen" order={{ name: "Oxycodone", dose: 5, unit: "mg", route: "PO", freq: "q4h", prn: true }} />
```

## Accessibility

- Order sentence is a polite live region.
- Priority is a radiogroup.

## Do and don't

- **Do:** Require a PRN reason on every PRN order.
- **Don't:** Write 5.0 mg or .5 mg.
