# FileUpload

FileUpload is a drop zone with a file list, plus a photo variant for insurance cards and ID.

**From the screens:** `.dz` drop zone (ins-coverage-edit) and `.photo` capture tile (kiosk-checkin, mobile).

## When to use

- Attach referral letters, insurance card photos, scanned documents, outside records.

## When not to use

- Signing a document: SignaturePad.

## Variants and states

| Variant | What it is |
|---|---|
| default | Dashed `line-soft` border on `canvas-soft`. |
| dragging | Primary border and tint. |
| photo | Camera icon, opens the camera on phones. |
| done | Green solid border: "Photo captured". |
| file list | Uploading with progress, Uploaded, Failed with reason. |
| error | Message under the zone. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `label` | string | none |
| `accept` | string | none |
| `multiple` | boolean | false |
| `variant` | 'default' \| 'photo' | 'default' |
| `files` | Array<{name, size?, status: uploading\|done\|error, progress?, error?}> | [] |
| `dragging / done` | boolean: forced state for previews | false |
| `title / hint / doneText` | string |  |
| `error` | string | none |
| `onFiles` | (FileList) => void | none |

## Usage

```jsx
<FileUpload label="Referral Letter" accept=".pdf,.jpg,.png" files={uploads} onFiles={upload} />
<FileUpload variant="photo" label="Front of Card" />
```

## Accessibility

- The whole zone is a label for a visually hidden file input, so keyboard and screen readers get the native picker.
- Each file row has a Remove button named with the file name.

## Do and don't

- **Do:** "Front of insurance card" and "Back of insurance card" as two photo tiles.
- **Don't:** Accept any file type for an insurance card.
