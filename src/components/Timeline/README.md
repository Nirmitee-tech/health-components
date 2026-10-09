# Timeline

Timeline lists the steps of a prior authorization, referral or claim in order, with done, current, pending and failed states.

**From the screens:** `.tline` on mobile result screens and the PA and referral status histories (ins-pa-detail, ref-detail). The dot styles are new; they reuse the step colours.

Also exported from this card: `PATimeline`.

## When to use

- Status history: PA Submitted, In Review, Pended, Approved.

## When not to use

- Free-form activity feeds with many actors: a table.

## Variants and states

| Variant | What it is |
|---|---|
| done | Green dot with check. |
| current | Ringed primary dot, aria-current step. |
| pending | Hollow dot, muted title. |
| failed | Red dot with x. |
| tag | StatusTag next to the title. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `items` | Array<{title, time?, by?, status: done\|current\|pending\|failed, body?, tag?, kind?}> | required |

## Usage

```jsx
<Timeline items={[{ title: "Submitted", time: "10/01/2026", by: "Sam Patel", status: "done", tag: "Submitted" }, { title: "In Review", status: "current" }]} />
```

## Accessibility

- Ordered list; the current step has aria-current="step".
- Each state also has a different icon or fill.

## Do and don't

- **Do:** Show who acted: "Payer (Availity 278)".
- **Don't:** Reverse order without saying so.
