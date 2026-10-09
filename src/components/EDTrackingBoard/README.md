# EDTrackingBoard

EDTrackingBoard is the emergency department whiteboard: every patient with ESI acuity, room, chief complaint, wait against the ESI target, status, provider and nurse, last vitals and safety flags.

**From the screens:** New for the acute care module. Built from: Card, StatCard, SegmentedControl, Badge, EmptyState.

**Values:** Every number goes through the shared value rules (`CareOS.acuteFmt.format`): tabular figures, unit always shown, fixed decimals per measure, reference range in the hover title, and H, L or critical tags. Colour is never the only signal: flags carry words and an icon.

## When to use

- The main ED view for charge nurses, providers and techs.
- A wall display in the department (use density compact).

## When not to use

- One patient: PatientBanner. Inpatient bed boards: a census table.

## Variants and states

| Variant | What it is |
|---|---|
| full | Summary tiles, filter, table with last vitals. |
| compact | density compact hides the vitals column for wall boards. |
| ESI 1 row | Red row and ringed ESI 1 tag. |
| over target | Waiting patients past the ESI wait target get a red "Over N min target" tag. |
| lobby | No room yet shows Lobby. |
| flags | Sepsis, Stroke, STEMI, Trauma, Isolation, Fall Risk, Behavioral, Interpreter. |
| filters | All, Waiting, Boarding, My patients. |
| empty | No patients, or none matching the filter. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `patients` | Array<{room?, name, age, sex, mrn?, esi, complaint, wait, status, provider?, nurse?, pending?, vitals?: {hr, bp: [sys, dia], spo2}, flags?}> | required |
| `waitTargets` | {1..5: minutes} | {1:0, 2:10, 3:30, 4:60, 5:120} |
| `currentProvider` | string: for the My patients filter | none |
| `density` | 'comfortable' \| 'compact' | 'comfortable' |
| `defaultFilter` | 'all' \| 'waiting' \| 'boarding' \| 'mine' | 'all' |
| `summary` | boolean | true |
| `readOnly` | boolean | false |
| `filter` / `onFilterChange` | controlled filter and its change callback | uncontrolled |
| `onQuickRegister` | () => void: Quick Register action | none |
| `title` / `subtitle` | string | 'ED Tracking Board' / none |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | 'ed' when no global context is set |

`ESIBadge` is exported from the same module: `level` (1 to 5 or null, required), `showLabel` (boolean, default false), `size` ('sm' \| 'md', default 'md').

## Usage

```jsx
<EDTrackingBoard patients={edPatients} currentProvider="Dr. Priya Raman" />
<ESIBadge level={2} showLabel />
```

## Accessibility

- Table has a caption; rows sort by ESI then wait, so screen readers hear the sickest first.
- ESI tags say "ESI 2" in words, and the tooltip names the level.
- Wait over target is a text tag, not colour alone.

## Do and don't

- **Do:** Keep the board sorted by acuity.
- **Do:** Show who owns each patient.
- **Don't:** Hide patients without a room.
- **Don't:** Use colour alone for acuity.
