# PatientBanner

PatientBanner identifies the patient at the top of every chart screen: name, sex, age, DOB, MRN, phone, insurance, allergies, flags and code status.

**From the screens:** The banner card on pat-chart and 63 other screens: 48px initials circle, h1 name, muted line "F, 38 y (03/14/1988) . MRN-100231 . (312) 555-0142 . Aetna W123456789", then tags (Allergy red, conditions amber, Code status green) and actions. Mobile allergy strip `.alg`.

## When to use

- Top of every screen about one patient.

## When not to use

- Lists of patients: table rows.

## Variants and states

| Variant | What it is |
|---|---|
| full | Desktop chart. |
| compact | Encounter and billing screens. |
| mobile | Stacked, phone. |
| allergies | Red tags with alert icon; "No Known Allergies" green; "Allergies not reviewed" amber when the list is unknown. |
| flags | Diabetic, Fall Risk, Interpreter: Spanish, Behavioral Health. |
| code status | Full Code green; DNR, DNI, Comfort Care red with an icon. |
| restricted | Restricted badge (break-the-glass charts). |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `name` | string | required |
| `sex / age / dob` | string | required |
| `mrn` | string | required |
| `phone / insurance / preferred` | string | none |
| `allergies` | string[] \| [] (none known) \| undefined (not reviewed) | undefined |
| `flags` | Array<string \| {label, tone}> | [] |
| `codeStatus` | string | none |
| `restricted` | boolean | false |
| `photo` | string | none |
| `actions` | node | none |
| `variant` | 'full' \| 'compact' \| 'mobile' | 'full' |

## Usage

```jsx
<PatientBanner name="Henna West" sex="F" age={38} dob="03/14/1988" mrn="MRN-100231" allergies={["Penicillin"]}
  flags={["Diabetic"]} codeStatus="Full Code" actions={<Button variant="primary">Start Visit Note</Button>} />
```

## Accessibility

- Region named "Patient <name>"; the name is the page h1 on chart screens.
- Allergy and code status carry icons and words, not only red and green.
- Two identifiers (name plus DOB or MRN) are always visible, for patient safety.

## Do and don't

- **Do:** Show DNR in red with "Code status: DNR" text.
- **Don't:** Truncate allergies; wrap instead.
