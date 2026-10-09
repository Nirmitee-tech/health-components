# PatientTabs

PatientTabs keep several open patients as closable tabs across the top, like a browser, in the Focus Rail style.

**From the screens:** `.cs-tabs` `.cs-tab` (44px, radius 10 top, active gets a 2px `accent` top line) with `.cs-x` close and `.cs-tadd` dashed add button.

## When to use

- Providers switching between charts during a session.

## When not to use

- Phones.
- More than about 8 open charts: suggest closing some.

## Variants and states

| Variant | What it is |
|---|---|
| active | White tab with accent line. |
| inactive | `canvas` tab. |
| pinned | A screen tab such as Schedule that cannot close. |
| meta | Age and sex after the name. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `tabs` | Array<{id, name, meta?, icon?, pinned?}> | required |
| `active` | string | first |
| `onAdd` | () => void | none |

## Usage

```jsx
<PatientTabs tabs={openCharts} active={currentId} onAdd={openSearch} />
```

## Accessibility

- tablist; each close button names the patient ("Close Henna West").

## Do and don't

- **Do:** Show sex and age so two patients with similar names are told apart.
- **Don't:** Close tabs on sign-out without saving drafts.
