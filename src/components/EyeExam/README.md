# EyeExam

EyeExam records right eye (OD) and left eye (OS) visual acuity, intraocular pressure and refraction in one place, with flags for reduced acuity, high pressure and pressure asymmetry.

## When to use

- Optometry and ophthalmology exams, diabetic eye screening, glaucoma follow-up.

## When not to use

- Slit lamp and fundus findings: a structured exam note.
- Contact lens fitting parameters.

## Variants and states

| Variant | What it is |
|---|---|
| acuity | Snellen distance without (sc) and with (cc) correction, pinhole and near. Worse than 20/40 shows a warning; 20/200 or worse shows danger. |
| IOP | mmHg, whole numbers, range 10 to 21. High above 21, critical at 30 or more with a same-day action. |
| asymmetry | A 4 mmHg or larger difference between eyes raises a warning. |
| refraction | Manifest, cycloplegic, autorefraction or final Rx rows: sphere and cylinder to 0.25 D in signed form, axis in degrees, add and prism. |
| not tested | Missing values say so in words. |
| readOnly | Hides the actions. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `exam` | {od: {vaSc, vaCc, ph, near, iop}, os: {...}, iopMethod, iopTime} | required |
| `refractions` | Array<{type, od: {sph, cyl, axis, add, prism, va}, os: {...}}> | [] |
| `title / subtitle` | string |  |
| `readOnly` | boolean | false |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | the global context, else 'outpatient' |
| `onCopyLastExam / onFinalizeRx` | () => void: header actions | none |

## Clinical values

Every number goes through the shared clinical value rules (`CareOS.fmt` and `ClinicalValue` from the clinical-values card): tabular digits, the unit always shown, a fixed precision per measure, the reference range in the tooltip, and H, L or critical flags. Medication amounts follow the ISMP dose style through `fmt.doseNumber`: rounded to the stated precision, then shown with no trailing zero (5 mg, never 5.0 mg) and a leading zero (0.5 mL). The specialty measures this card adds sit in `CareOS.specialty.MEAS` with their precision: IOP 0 decimals mmHg, sphere, cylinder and add 2 decimals D with a sign, axis whole degrees. Ranges in the previews are sample values for the design system, not clinical guidance; a real deployment passes its own.

## Usage

```jsx
<EyeExam exam={{ od: { vaCc: "20/25", iop: 16 }, os: { vaCc: "20/30", iop: 17 }, iopMethod: "Goldmann" }} refractions={[{ type: "Manifest", od: { sph: -2.25, cyl: -0.5, axis: 180, va: "20/20" }, os: { sph: -2, cyl: 0, va: "20/20" } }]} />
```

## Accessibility

- Each eye is a row header with the abbreviation and its plain name.
- Flags are words and icons, not just red text.
- Signed lens powers read as plus or minus.

## Do and don't

- **Do:** Always print a sign on sphere and cylinder.
- **Do:** Record the IOP method and time; readings vary through the day.
- **Don't:** Write OD/OS without the plain name the first time.
- **Don't:** Show a blank where a test was not done.
