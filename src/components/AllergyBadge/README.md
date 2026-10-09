# AllergyBadge

AllergyBadge is the red allergy tag used in banners and lists, with severity in its title and optional label.

**From the screens:** The "Allergy: Penicillin" `.tag.r` in the patient banner (64 screens) and the mobile `.alg` strip.

## When to use

- Anywhere a patient is identified and a drug may be ordered.

## When not to use

- Full allergy management: AllergyList.

## Variants and states

| Variant | What it is |
|---|---|
| severe | Alert-circle icon. |
| moderate | Alert icon. |
| mild | Amber tone. |
| showSeverity | Adds "(Severe)" to the text. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `substance` | string | required |
| `severity` | 'severe' \| 'moderate' \| 'mild' | 'moderate' |
| `reaction` | string | none |
| `showSeverity` | boolean | false |

## Usage

```jsx
<AllergyBadge substance="Penicillin" severity="severe" reaction="Hives" showSeverity />
```

## Accessibility

- Icon plus the word Allergy; severity in text when shown.

## Do and don't

- **Do:** Show every allergy; wrap.
- **Don't:** "+2 more" that hides an allergy.
