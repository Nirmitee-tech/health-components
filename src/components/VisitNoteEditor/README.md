# VisitNoteEditor

VisitNoteEditor is the section-by-section visit note with AI Scribe drafts and ICD-10 and CPT search, from Draft to Signed.

**From the screens:** enc-note (template sections, "Template changes keep anything you already typed"), enc-scribe and ai-scribe (`.aibox`), enc-sign, code search on ai-coder. Built from: Card, TextArea, AISuggestion, Combobox (code), Badge, Button, Alert.

Also exported from this card: `VisitNote`.

## When to use

- Writing and signing a visit note.

## When not to use

- Viewing an old signed note in a list: the Encounters table.

## Variants and states

| Variant | What it is |
|---|---|
| draft | Editable sections, Save Draft, Sign Note. |
| ai section | AI Scribe draft with Accept and Edit. |
| required / error | Badge and field error per section. |
| signed | Locked, addendum note. |
| readOnly | Lock banner for roles without Edit clinical chart. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `sections` | Array<{id, title, text?, ai?, required?, error?, rows?}> | required |
| `diagnoses / procedures` | Array<{code, label}> | [] |
| `icdOptions / cptOptions` | Array<{code, label}> | [] |
| `title` | string | "Visit Note" |
| `meta` | string | none |
| `signed` | boolean | false |
| `readOnly` | boolean | false |
| `lockText` | string | default |
| `onSign / onAiDraft` | () => void | none |

In this React port, `diagnoses`, `procedures` and `signed` are controlled props (with `onDiagnosesChange`, `onProceduresChange`, `onSign`); `defaultDiagnoses`, `defaultProcedures` and `defaultSigned` make them uncontrolled. Accept puts the AI draft into the section field; Edit does the same and focuses the field. `onSectionChange(id, text)` and `onSaveDraft` report edits.

## Usage

```jsx
<VisitNoteEditor meta="10/09/2026 10:30 AM . Primary Care SOAP" icdOptions={ICD10} cptOptions={CPT}
  sections={[{ id: "s", title: "Subjective", required: true }, { id: "a", title: "Assessment and Plan", ai: draftText }]}
  onSign={signNote} onAiDraft={runScribe} />
```

## Accessibility

- Each section textarea is named by its title.
- AI text is never saved without Accept.

## Do and don't

- **Do:** Show the visit date, place and template in meta.
- **Don't:** Let a template switch drop typed text.
