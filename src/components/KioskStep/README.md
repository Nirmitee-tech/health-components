# KioskStep

KioskStep is one step of front-desk tablet check-in: kiosk header with Help, step segments, big title, content and large Back and Continue buttons.

**From the screens:** kiosk-checkin (Step N of 6, "Find your appointment", 48px inputs and buttons, "I need help from the front desk", inactivity warning). Built from: MobileHeader (kiosk), Stepper (segments), Button lg, fields at lg size.

## When to use

- Self check-in tablets.

## When not to use

- Patient phones: PhoneScaffold.

## Variants and states

| Variant | What it is |
|---|---|
| first step | No Back. |
| next disabled | Until required fields are filled. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `step / total` | number | required |
| `stepName / title` | string | required |
| `subtitle` | string | none |
| `practice` | string | "Valley Family Clinic" |
| `nextLabel` | string | "Continue" |
| `nextDisabled` | boolean | false |
| `onBack / onNext` | () => void | none |
| `children` | fields | required |

## Usage

```jsx
<KioskStep step={1} total={6} stepName="Find appointment" title="Find your appointment" onNext={find}>
  <TextField label="Last name" size="lg" required />
</KioskStep>
```

## Accessibility

- 48px controls; progress announced as Step N of 6.

## Do and don't

- **Do:** Clear the screen after 30 seconds idle, with a warning first.
- **Don't:** Show other patients' names in results.
