# DocumentViewer

DocumentViewer shows a scanned or outside document page by page with zoom, and lets staff highlight a line or comment on it, listing the annotations beside the page.

## When to use

- Outside records, discharge summaries, faxed consult letters, prior-auth packets.

## When not to use

- Incoming fax triage: FaxDocumentViewer.

## Variants and states

| Variant | What it is |
|---|---|
| viewing | Page, zoom 50 to 200 %, page count. |
| highlight | Yellow mark on a line. |
| comment | Blue mark with the text in the side list. |
| adding | Click a line, then type a comment or Highlight. |
| readOnly | Lock note; no adding. |
| error / empty | Empty state with the reason. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `pages` | Array<{lines: string[]}> | [] |
| `annotations` | Array<{id, page, line, kind: "highlight" \| "comment", text?, author, at?}> | [] |
| `title / subtitle` | string | none |
| `user` | string | 'You' |
| `readOnly` | boolean | false |
| `error` | string | none |
| `maxHeight` | number | 520 |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | the global context, else 'outpatient' |

## Clinical values

Every number renders through CareOS.ClinicalValue and CareOS.fmt (the clinical-values builder), matched by LOINC; measures that table lacks (NT-proBNP, lactate, vancomycin trough, CrCl, PHQ-9, per-kg doses) use a local table with the same rules: tabular figures, the unit always shown, fixed decimals per measure (potassium 1, sodium 0, creatinine 2), the reference range in the title or beside it, and H, L, HH or LL flags in words for screen readers. The flag says where the number sits against the adult reference range in the rules table; it does not say the number was measured correctly.

## Usage

```jsx
<DocumentViewer title="Discharge summary" pages={pages} annotations={notes} />
```

## Accessibility

- Page changes are announced (aria-live).
- Marks are focusable.

## Do and don't

- **Do:** Say who annotated and when.
- **Don't:** Change the source document: annotations sit on top.
