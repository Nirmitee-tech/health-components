# LaborDeliveryBoard

LaborDeliveryBoard lists every patient on labor and delivery: room, gravida and para, gestational age, last cervical exam, time since membranes ruptured, fetal heart rate and tracing category, oxytocin rate, status and care team.

**From the screens:** New for the labor and delivery module. Built from: Card, Badge, EmptyState.

**Values:** Every number goes through the shared value rules (`CareOS.acuteFmt.format`): tabular figures, unit always shown, fixed decimals per measure, reference range in the hover title, and H, L or critical tags. Colour is never the only signal: flags carry words and an icon.

## When to use

- L&D charge nurse and provider overview.

## When not to use

- One labor: PartogramChart and FetalMonitorStrip.

## Variants and states

| Variant | What it is |
|---|---|
| Category I / II / III | Green, amber, red; Category III row turns red. |
| preterm | GA under 37 weeks tag. |
| ROM over 18 h | Flagged H; over 24 h critical. |
| oxytocin | Rate in mU/min, Off when not running. |
| statuses | Triage, Antepartum, Latent, Active, Pushing, Delivered, C-section, Postpartum. |
| flags | GBS+, Epidural, Pre-eclampsia, TOLAC, Hemorrhage risk. |
| empty | No patients. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `patients` | Array<{room, name, age, g, p, gaWeeks, gaDays, dilation?, effacement?, station?, checked?, rom?, fhr?, fhrCategory?, oxytocin?, status, provider, nurse, flags?}> | required |
| `title` / `subtitle` | string | 'Labor and Delivery Board' / none |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which shared reference range flags use. The lab range on a result still wins. See Reference ranges and flags in the main README. | 'ed' when no global context is set |

## Usage

```jsx
<LaborDeliveryBoard patients={ldPatients} />
```

## Accessibility

- Tracing category is written out ("Category II"), not colour alone.
- Station uses a real minus sign so screen readers say minus.

## Do and don't

- **Do:** Show time since ROM in hours.
- **Don't:** Show the tracing category without who assigned it in the chart.
