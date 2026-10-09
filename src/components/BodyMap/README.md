# BodyMap

BodyMap marks numbered lesions on front and back body outlines, with size in millimetres, change since last visit, status and dated photos for each one.

This version replaces the earlier single-view BodyMap. It keeps the `marks` prop with x and y in a 200 by 262 frame; `view`, `size`, `type` and `photos` are new.

## When to use

- Full skin exams, mole mapping, wound and pressure injury location, injection site rotation.

## When not to use

- Comparing photos side by side at full size: a photo viewer.
- Wound measurements over time: a wound flowsheet.

## Variants and states

| Variant | What it is |
|---|---|
| front / back | SegmentedControl with a count of marks on each side. |
| monitor | Primary pin, Monitor tag. |
| new | Amber pin, New tag. |
| biopsy | Red pin, Biopsy tag. |
| treated | Success tag. |
| size and change | Length by width in mm, and the earlier size and date when it has grown. |
| photos | Dated thumbnails; a camera placeholder when the image is not loaded yet; "No photos yet" when none. |
| selected | Click a pin: it gets a ring and its row highlights. |
| empty side | EmptyState for a view with no marks. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `marks` | Array<{x, y, view: front\|back, site, size: [length, width] mm, prevSize?, prevDate?, type: monitor\|new\|biopsy\|treated, desc, photos?: [{src?, date}]}> | [] |
| `view` | 'front' \| 'back': first view | 'front' |
| `title / subtitle` | string |  |
| `readOnly` | boolean | false |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | the global context, else 'outpatient' |
| `currentView` | 'front' \| 'back': shown view (controlled) | uncontrolled |
| `onViewChange` | (view) => void | none |
| `onMarkSelect` | (n: number) => void: a pin was clicked | none |
| `onAddPhoto` | () => void | none |
| `concern` | boolean on a mark: earlier API, same as `type: "biopsy"` | false |

## Clinical values

Every number goes through the shared clinical value rules (`CareOS.fmt` and `ClinicalValue` from the clinical-values card): tabular digits, the unit always shown, a fixed precision per measure, the reference range in the tooltip, and H, L or critical flags. Medication amounts follow the ISMP dose style through `fmt.doseNumber`: rounded to the stated precision, then shown with no trailing zero (5 mg, never 5.0 mg) and a leading zero (0.5 mL). The specialty measures this card adds sit in `CareOS.specialty.MEAS` with their precision: lesion size whole mm. Ranges in the previews are sample values for the design system, not clinical guidance; a real deployment passes its own.

## Usage

```jsx
<BodyMap marks={[{ x: 88, y: 92, view: "front", site: "Left upper chest", size: [6, 5], prevSize: 4, prevDate: "04/02/2026", type: "biopsy", desc: "Irregular border, two colors", photos: [{ date: "10/09/2026" }] }]} />
```

## Accessibility

- The list repeats every mark in text with its number, so the drawing is never the only record.
- The SVG label says which side is the patient’s left in each view.
- Photos carry alt text with lesion number, site and date.

## Do and don't

- **Do:** Number marks in the order they were found and keep the number across visits.
- **Do:** Record size at every visit so growth is visible.
- **Don't:** Rely on the drawing alone.
- **Don't:** Drop the date from a photo.
