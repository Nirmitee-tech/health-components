# Spinner

Spinner shows that something is loading when the wait is short or its length is unknown.

**From the screens:** `.spin` (14px ring, `line-soft` with a `primary` top, 0.8s) on ins-elig and ins-coverage-edit, and the 36px purple AI spinner on mob-scribe.

## When to use

- Inside buttons (Button loading) and for waits under a few seconds.

## When not to use

- Known layouts that load: Skeleton. Long jobs: ProgressBar.

## Variants and states

| Variant | What it is |
|---|---|
| sm | 14px. |
| lg | 36px. |
| ai | AI purple top, for AI work. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `size` | 'sm' \| 'lg' | 'sm' |
| `tone` | 'primary' \| 'ai' | 'primary' |
| `label` | string | "Loading" |

## Usage

```jsx
<Spinner label="Checking coverage" />  <Spinner size="lg" tone="ai" />
```

## Accessibility

- role status with a label; slows under prefers-reduced-motion.

## Do and don't

- **Do:** "Checking coverage with Aetna" next to it.
- **Don't:** A spinner with no text for more than 2 seconds.
