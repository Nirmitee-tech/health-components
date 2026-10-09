# StepperForm

StepperForm runs a multi-step form such as the 7-step Add Patient, with the step bar, an error summary and Back, Next and Save buttons.

**From the screens:** pat-add (Demographics, Contact, Insurance, Guarantor, Care Team, Consents, Review) and sched-tele's `.stp` bar. Built from: Card, Stepper, Alert, Button, any fields.

## When to use

- Forms with 3 to 8 sections that must be done in order.

## When not to use

- Edits to one section of an existing record: a Card with Save.

## Variants and states

| Variant | What it is |
|---|---|
| steps | Any number; each has label, content and an error flag. |
| error summary | Alert above the fields. |
| save draft | Extra button when onSaveDraft is set. |
| finish | Last step shows the finish label. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `title` | string | required |
| `steps` | Array<{label, content: node, error?}> | required |
| `current` | number | 0 |
| `finishLabel` | string | "Save" |
| `errorSummary` | node | none |
| `saving` | boolean | false |
| `onStep` | (index) => void | none |
| `onFinish / onCancel / onSaveDraft` | () => void | none |

In this React port, `current` is controlled (update it from `onStep`, which fires on Next and Back); `defaultCurrent` makes it uncontrolled.

## Usage

```jsx
<StepperForm title="Add Patient" finishLabel="Save Patient" onFinish={save}
  steps={[{ label: "Demographics", content: <DemographicsFields/> }, { label: "Insurance", content: <InsuranceFields/>, error: true }]} />
```

## Accessibility

- Step text "Step 4 of 7 . Guarantor" in the card subtitle.
- Next button names the next step.

## Do and don't

- **Do:** Keep entered data when going Back.
- **Don't:** Validate a step only at the end.
