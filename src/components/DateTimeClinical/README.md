# DateTimeClinical

DateTimeClinical shows dates as MM/DD/YYYY, times in 12- or 24-hour form with an optional zone, and ages from date of birth down to days for newborns, plus gestational age.

**Foundation:** part of the clinical values set. Every number it shows comes from `CareOS.fmt`, so it matches every other component.

## When to use

- Every date, time, DOB and age on a clinical screen.

## When not to use

- Date entry: DatePicker.
- Relative-only times ("5 min ago") with no absolute time.

## Variants and states

| Variant | What it is |
|---|---|
| date | 03/14/2026. |
| time | 02:05 PM, or 14:05 with `hour24`. |
| datetime | Date and time; zone abbreviation when `timeZone` is set. |
| dob | DOB with age: 03/14/1979 (47 y). |
| age | Age only: 8 d, 6 wk, 9 mo, 47 y. |
| gestational | GA 38w 4d from weeks and days or EDD. |

## Props

| Prop | Type | Default |
|---|---|---|
| `value` | ISO string or Date | required except gestational |
| `mode` | 'date' \| 'time' \| 'datetime' \| 'dob' \| 'age' \| 'gestational' | 'date' |
| `hour24` | boolean | false |
| `timeZone` | IANA zone | browser zone |
| `asOf` | date the age is computed at | today |
| `weeks / days / edd` | gestational inputs | none |
| `prefix / relative` | string | none |

## Usage

```jsx
<DateTimeClinical mode="dob" value="2026-08-28" asOf="2026-10-09" />
```

## Accessibility

- Renders a `<time>` element with an ISO datetime attribute.
- Age has a title with the long form ("6 weeks").

## Do and don't

- **Do:** Pass `timeZone` for anything across sites or telehealth.
- **Don't:** Show a two-digit year.
