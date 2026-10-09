# Stepper

Stepper shows progress through a multi-step flow, such as the 7-step Add Patient form, as a numbered bar, a vertical list or thin segments.

**From the screens:** `.stp` step bar (3px underline, done green) on sched-tele and the add-patient flow; `.steps` 4px segments on 9 kiosk and portal flows.

## When to use

- Flows of 3 to 8 steps: Add Patient, check-in, new prior auth.

## When not to use

- Two steps: just two screens.

## Variants and states

| Variant | What it is |
|---|---|
| bar | Numbered, horizontal. |
| vertical | For side panels. |
| segments | Thin bars on phones and kiosk. |
| states | done (green check), current (primary), todo, error ("!" and red). |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `steps` | Array<string \| {label, error?}> | required |
| `current` | number, 0-based | 0 |
| `variant` | 'bar' \| 'vertical' \| 'segments' | 'bar' |
| `count` | number: segments without labels | 4 |
| `label` | string | "Steps" |

## Usage

```jsx
<Stepper steps={["Demographics", "Contact", "Insurance"]} current={1} />
<Stepper variant="segments" count={6} current={0} />
```

## Accessibility

- Ordered list with aria-current="step"; state words are in screen-reader text.
- Segments use role progressbar with "Step 2 of 5".

## Do and don't

- **Do:** Let people go back to a done step.
- **Don't:** Hide errors in later steps until the end.
