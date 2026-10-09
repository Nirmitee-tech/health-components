# DrugInteractionAlert

DrugInteractionAlert (and AllergyAlert) stops an order for an interaction, duplicate or allergy and asks for an override reason or a change.

**From the screens:** cpoe-rx-new and cpoe-erx alerts. Built from: Alert, Select, Button.

Also exported from this card: `AllergyAlert`.

## When to use

- At order signing when a check fires.

## When not to use

- General warnings: Alert.

## Variants and states

| Variant | What it is |
|---|---|
| interaction / duplicate / allergy | Title prefix. |
| severity | severe and contraindicated are red, others amber. |
| overridable false | No override possible. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `kind` | 'interaction' \| 'duplicate' \| 'allergy' | 'interaction' |
| `title` | string | required |
| `body` | string | required |
| `severity` | 'contraindicated' \| 'severe' \| 'moderate' | 'moderate' |
| `source` | string | none |
| `overridable` | boolean | true |

## Usage

```jsx
<DrugInteractionAlert title="Sertraline + Tramadol" body="Serotonin syndrome risk." severity="severe" />
<AllergyAlert title="Amoxicillin" body="Patient allergic to penicillin (anaphylaxis)." severity="contraindicated" />
```

## Accessibility

- Override needs a reason; button stays disabled until chosen.

## Do and don't

- **Do:** Name the source (First Databank).
- **Don't:** Allow silent overrides.
