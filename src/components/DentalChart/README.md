# DentalChart

DentalChart draws all 32 adult teeth in universal numbering with five surfaces each, marks caries, restorations, crowns, root canals, implants and missing teeth, and lists the phased treatment plan with fees.

## When to use

- Dental exam, hygiene recall and treatment planning visits.
- Showing the patient what is planned and what it costs before a pre-treatment estimate.

## When not to use

- Periodontal pocket depths: a perio chart.
- Primary (child) teeth A to T: this card charts permanent teeth 1 to 32 only.

## Variants and states

| Variant | What it is |
|---|---|
| surface conditions | Caries (danger fill), existing restoration (primary fill), sealant (success), planned work (dashed warning outline). |
| whole tooth | Crown (purple ring), root canal (red root and dot), implant, missing (cross), planned extraction (dashed cross), bridge pontic, impacted. |
| selected tooth | Click a tooth: it highlights and a panel lists its findings and planned procedures. |
| treatment plan | Phase, tooth, surface, CDT code, status, fee, estimated insurance and patient portion, with open totals. |
| empty plan | EmptyState when nothing is planned. |
| readOnly | Hides the add actions. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `teeth` | Record<number, {surfaces?: {M\|O\|D\|B\|L: caries\|restoration\|planned\|sealant}, whole?: crown\|rct\|implant\|missing\|extract\|bridge\|impacted, note?}> | {} |
| `plan` | Array<{phase, tooth, surface, cdt, desc, status, fee, insurance}> | [] |
| `selected` | number: tooth selected first | none |
| `title / subtitle` | string |  |
| `readOnly` | boolean | false |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | the global context, else 'outpatient' |
| `selectedTooth` | number \| null: selected tooth (controlled) | uncontrolled |
| `onSelectedChange` | (tooth: number \| null) => void | none |
| `onPerioChart / onAddProcedure` | () => void: header actions | none |

## Clinical values

Every number goes through the shared clinical value rules (`CareOS.fmt` and `ClinicalValue` from the clinical-values card): tabular digits, the unit always shown, a fixed precision per measure, the reference range in the tooltip, and H, L or critical flags. Medication amounts follow the ISMP dose style through `fmt.doseNumber`: rounded to the stated precision, then shown with no trailing zero (5 mg, never 5.0 mg) and a leading zero (0.5 mL). The specialty measures this card adds sit in `CareOS.specialty.MEAS` with their precision: fees in US dollars to the cent. Ranges in the previews are sample values for the design system, not clinical guidance; a real deployment passes its own.

## Usage

```jsx
<DentalChart teeth={{ 3: { surfaces: { O: "caries", M: "caries" } }, 19: { whole: "rct" } }} plan={[{ phase: 1, tooth: 3, surface: "MO", cdt: "D2392", desc: "Resin composite, 2 surfaces, posterior", status: "planned", fee: 245, insurance: 196 }]} />
```

## Accessibility

- Each tooth is a button whose name lists the tooth, its type and every finding, so the chart reads without the colours.
- Surfaces are drawn facing the patient; mesial flips side at the midline so the drawing matches the mouth.
- The plan is a real table with a caption.

## Do and don't

- **Do:** Show both arches with the patient right on the left of the screen.
- **Do:** Say that insurance amounts are estimates.
- **Don't:** Rely on colour alone: the legend and the tooth names carry the meaning.
- **Don't:** Mix universal and FDI numbering on one screen.
