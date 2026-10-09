# FaxDocumentViewer

FaxDocumentViewer shows an incoming fax page next to the indexing form: patient, document type, route, file or junk, with an AI match suggestion.

**From the screens:** comm-fax, comm-fax-detail, doc-scan. Built from: page viewer, AISuggestion, Combobox, Select, Button.

## When to use

- Indexing faxes and scans to charts.

## When not to use

- Sending faxes: a form.

## Variants and states

| Variant | What it is |
|---|---|
| suggested | AI match with confidence. |
| paging | Previous and next page. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `from` | string | required |
| `pages` | number | required |
| `patients` | Combobox options | [] |
| `patientQuery` | string | none |
| `ai` | {text, confidence} | none |

## Usage

```jsx
<FaxDocumentViewer from="Quest Diagnostics" pages={3} patients={patients} ai={{ text: "...", confidence: "high" }} />
```

## Accessibility

- Page image has a text label; pager buttons labelled.

## Do and don't

- **Do:** A person confirms the patient match.
- **Don't:** Auto-file on a name match.
