# ProcedureNote

ProcedureNote is a structured procedure note from a template (laceration repair, central line, lumbar puncture, cesarean delivery): procedure, indication, consent, time out, EBL, complications, specimens and the template's own fields.

**From the screens:** New for the acute care module. Built from: Card, DescriptionList, TextArea, Badge, Button, Alert.

**Values:** Every number goes through the shared value rules (`CareOS.acuteFmt.format`): tabular figures, unit always shown, fixed decimals per measure, reference range in the hover title, and H, L or critical tags. Colour is never the only signal: flags carry words and an icon.

## When to use

- Bedside procedures in the ED, ICU and L&D; brief OR notes.

## When not to use

- Full operative reports dictated by the surgeon: VisitNoteEditor.

## Variants and states

| Variant | What it is |
|---|---|
| draft | Template fields are editable; Sign disabled until consent and time out exist. |
| signed | Read-only with lock tag. |
| time out missing | Red tag. |
| addendum | Note alert under a signed note. |
| templates | laceration repair, central line, lumbar puncture, cesarean delivery. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `template` | 'laceration repair' \| 'central line' \| 'lumbar puncture' \| 'cesarean delivery' | 'laceration repair' |
| `values` | {procedure?, indication, performer, consent, timeout, duration?, ebl?, complications?, specimens?, date, location, signedAt?, details: Record<field, string>} | {} |
| `status` | 'draft' \| 'signed' | 'draft' |
| `addendum` | {at, text} | none |
| `onSign` / `onSaveDraft` | (details: Record<field, string>) => void | none |
| `onDetailsChange` | (details) => void: a template field changed | none |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | 'ed' when no global context is set |

## Usage

```jsx
<ProcedureNote template="lumbar puncture" values={lpValues} status="draft" />
```

## Accessibility

- Fields are labelled text areas; signed fields are plain text with headings.
- Why Sign is disabled is written next to it.

## Do and don't

- **Do:** Record the time out time.
- **Don't:** Edit a signed note in place; add an addendum.
