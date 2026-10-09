# PhoneScaffold

PhoneScaffold is the frame for every phone and portal screen: header, scrolling body with 44px targets, optional lock banner and bottom tabs.

**From the screens:** `.phone` `.ptop` `.pbody` `.bnav` on 39 phone and portal screens; lock text for non-clinical roles on mobile. Built from: MobileHeader, Alert, BottomTabBar.

## When to use

- mob-* and portal-* screens.

## When not to use

- Kiosk: KioskStep.

## Variants and states

| Variant | What it is |
|---|---|
| tabs | Staff or portal tab sets. |
| lock | Read-only preview banner. |
| no tabs | Flows such as login and scribe recording. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `title` | string | required |
| `subtitle` | string | none |
| `back` | string: href | none |
| `action` | node | none |
| `tabs` | BottomTabBar items | none |
| `active` | string | none |
| `lockText` | string | none |
| `children` | body | required |

## Usage

```jsx
<PhoneScaffold title="Today" subtitle="Thu, Oct 9" tabs={STAFF_TABS} active="Home">
  {appointments.map(a => <AppointmentChip key={a.id} {...a} />)}
</PhoneScaffold>
```

## Accessibility

- Controls inside get 44px min height.

## Do and don't

- **Do:** One primary action per screen, full width.
- **Don't:** Desktop tables inside a phone frame.
