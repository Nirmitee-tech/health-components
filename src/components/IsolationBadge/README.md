# IsolationBadge

IsolationBadge names the transmission-based precautions a patient is on, so staff put on the right protection before they enter the room.

## When to use

- On the bed board, census rows, patient banner and door signs, wherever a person decides whether to enter a room.

## When not to use

- Allergies (AllergyBadge) or code status; those are different risks.
- Standard precautions on every patient: it is hidden by default because it applies to everyone.

## Variants and states

| Variant | What it is |
|---|---|
| contact | Gown and gloves. MRSA, VRE, ESBL. |
| contact-plus | Contact plus soap and water hand hygiene. C. difficile, norovirus. |
| droplet | Surgical mask within 6 feet. Influenza, pertussis. |
| airborne | N95 and a negative-pressure room. TB, measles, varicella. |
| airborne-contact | Both, for example disseminated zoster. |
| neutropenic | Protective precautions for the patient. |
| standard | Hidden unless showStandard. |
| organism | Organism in brackets. |
| pending | Rule-out: on precautions while the test is pending. |
| compact | Drops the "Isolation:" prefix in dense rows. |
| size sm | For bed tiles and table cells. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `type` | 'contact' \| 'contact-plus' \| 'droplet' \| 'airborne' \| 'airborne-contact' \| 'neutropenic' \| 'standard' | required |
| `organism` | string | none |
| `pending` | boolean: rule-out | false |
| `compact` | boolean | false |
| `size` | 'sm' \| 'md' | 'md' |
| `showStandard` | boolean | false |

## Usage

```jsx
<IsolationBadge type="contact-plus" organism="C. diff" />
<IsolationBadge type="airborne" organism="TB" pending compact size="sm" />
```

## Accessibility

- The precaution is in words, never colour alone; the shield icon is decorative.
- The tooltip names the protection to wear.

## Do and don't

- **Do:** Show the organism when it is known.
- **Do:** Mark rule-out precautions as pending.
- **Don't:** Abbreviate to colour dots only.
- **Don't:** Show "Standard" on every patient.
