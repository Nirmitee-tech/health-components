# BottomTabBar

BottomTabBar is the phone and portal bottom navigation with four or five tabs and badges.

**From the screens:** `.bnav` `.bn` (56px min, 11px labels, `primary` when on, red `.bdg` count) on 36 mobile and portal screens.

## When to use

- Phone EHR and patient portal.

## When not to use

- Desktop.

## Variants and states

| Variant | What it is |
|---|---|
| staff | Home, Schedule, Patients, Messages, More. |
| portal | Home, Appointments, Messages, Health, More. |
| badge | Unread count. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `items` | Array<{label, icon, href?, badge?}> | required |
| `active` | string | none |
| `label` | string | "Main" |

## Usage

```jsx
<BottomTabBar items={STAFF_TABS} active="Schedule" />
```

## Accessibility

- nav with aria-current="page"; 56px targets.

## Do and don't

- **Do:** Five tabs at most.
- **Don't:** Hide the bar on scroll in forms.
