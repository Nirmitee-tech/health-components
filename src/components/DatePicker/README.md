# DatePicker

DatePicker takes a date as MM/DD/YYYY by typing or from a month grid.

**From the screens:** MM/DD/YYYY date fields on 67 screens (DOB, service dates, coverage dates). The calendar popover is built from the `.mo` month grid style.

## When to use

- Date of birth, date of service, coverage start and end, follow-up date.

## When not to use

- Picking an appointment time: TimeSlotPicker.

## Variants and states

| Variant | What it is |
|---|---|
| closed | Typed entry with mask. |
| open | Month grid, today ringed, selected filled. |
| limits | disablePast, disableFuture (DOB), disableWeekends (scheduling). |
| error | Bad or impossible date: "Enter a real date as MM/DD/YYYY." |
| readOnly | Lock state. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `label` | string | required |
| `defaultValue` | string MM/DD/YYYY | "" |
| `onChange` | (value) => void | none |
| `today` | string MM/DD/YYYY | 10/09/2026 |
| `defaultOpen` | boolean | false |
| `disablePast / disableFuture / disableWeekends` | boolean | false |
| `error / helper / required / readOnly` | as TextField |  |

## Usage

```jsx
<DatePicker label="Date of Birth" required disableFuture defaultValue="03/14/1988" onChange={setDob} />
```

## Accessibility

- Typing always works; the grid is optional.
- Grid days are buttons with aria-selected and aria-current="date" for today; month changes are announced.
- The check on typed dates proves the date exists on the calendar. It does not prove it is plausible (a DOB of today): add that rule where it matters.

## Do and don't

- **Do:** DOB with disableFuture.
- **Don't:** A three-dropdown date (month, day, year).
