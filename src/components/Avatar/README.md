# Avatar

Avatar shows a person as a photo or initials, in five sizes, with an optional presence dot.

**From the screens:** Initials circle in the patient banner (48px, `primary`, 700 weight) on 28 screens and the account avatar `.cs-av` (30px, `accent`). Photos and the status dot are additions.

## When to use

- Patients in banners and search results, staff in chat, care team, assignees.

## When not to use

- Decoration in empty states.

## Variants and states

| Variant | What it is |
|---|---|
| initials | First and last initial; titles (MD, LCSW) are skipped. |
| photo | `src` image, round. |
| sizes | xs 20, sm 30, md 40, lg 48, xl 64. |
| colour | primary (patients), accent (signed-in user), ai (AI agents), success-strong, ink-2. |
| status | online, busy, away, offline dot with a surface ring. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `name` | string | required |
| `src` | string | none |
| `size` | 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' | 'md' |
| `color` | 'primary' \| 'accent' \| 'ai' \| 'success-strong' \| 'ink-2' | 'primary' |
| `status` | 'online' \| 'busy' \| 'away' \| 'offline' | none |

## Usage

```jsx
<Avatar name="Henna West" size="lg" />
<Avatar name="Mandy Harley LCSW" size="sm" status="online" />
```

## Accessibility

- role img with the full name and status in aria-label.
- Initials on `accent`: below 4.5:1 in Focus Rail (coral) and Command Bar (gold). Source pair kept; see README contrast list.

## Do and don't

- **Do:** Initials for patients without a photo on file.
- **Don't:** Stock photos for patients.
