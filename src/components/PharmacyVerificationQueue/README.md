# PharmacyVerificationQueue

PharmacyVerificationQueue is the pharmacist queue: orders on the left, the selected order on the right with weight, renal function, potassium, a weight-based dose check and interaction alerts, then Verify, Clarify or Reject.

## When to use

- Inpatient and infusion pharmacist verification; specialty pharmacy review.

## When not to use

- Outpatient refill requests: InboxItem. Prescribing: SigBuilder.

## Variants and states

| Variant | What it is |
|---|---|
| pending | Amber; Verify, Clarify, Reject. |
| dose in range | Green dose check. |
| dose above usual | Amber dose check; Verify allowed. |
| dose above hard limit | Red; Verify blocked. |
| no weight | Amber "No weight" tag; no dose check. |
| clarify / verified / rejected | Status tag and result note. |
| empty | Queue is clear. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `orders` | Array<{id, drug, sig, patient, unit, age, prescriber, ordered, indication?, status, stat?, schedule?, weight?, scr?, crcl?, k?, dosePerKg?: {amount, unit, per?, min?, max?, hardMax?}, alerts?: {severity, title, detail}[], by?}> | [] |
| `defaultSelected` | string: order id | first order |
| `oldest` | string | none |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | the global context, else 'outpatient' |

## Clinical values

Every number renders through CareOS.ClinicalValue and CareOS.fmt (the clinical-values builder), matched by LOINC; measures that table lacks (NT-proBNP, lactate, vancomycin trough, CrCl, PHQ-9, per-kg doses) use a local table with the same rules: tabular figures, the unit always shown, fixed decimals per measure (potassium 1, sodium 0, creatinine 2), the reference range in the title or beside it, and H, L, HH or LL flags in words for screen readers. The flag says where the number sits against the adult reference range in the rules table; it does not say the number was measured correctly.

## Usage

```jsx
<PharmacyVerificationQueue orders={orders} oldest="42 min" />
```

## Accessibility

- The list is a listbox with selected state.
- Dose check values read as words with their flag.

## Do and don't

- **Do:** Show the per-kg dose next to the ordered dose.
- **Don't:** Let a dose over the hard limit be verified without a new order.
