# Select

Select picks one value from a short fixed list, such as Provider, Location or Status filters.

**From the screens:** `select.inp` on 202 screens (filters on sched-calendar: Provider, Specialty, Location, Status, Visit Mode).

## When to use

- Up to about 15 known options.

## When not to use

- Long or searchable lists (patients, codes, payers): Combobox.
- Two to four options shown at once: SegmentedControl or RadioGroup.

## Variants and states

| Variant | What it is |
|---|---|
| default | Native select with a chevron. |
| sm | 30px, for table toolbars and rows-per-page. |
| error | Red border and message. |
| readOnly | Disabled with lock icon and lock line. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `label` | string | required |
| `options` | Array<string \| {value, label}> | required |
| `placeholder` | string: first empty option | none |
| `size` | 'sm' \| 'md' | 'md' |
| `error / helper / required / readOnly` | as TextField |  |

## Usage

```jsx
<Select label="Provider" options={["All", ...providers]} value={provider} onChange={e => setProvider(e.target.value)} />
```

## Accessibility

- Native select keeps platform keyboard and screen reader behaviour.

## Do and don't

- **Do:** "All" as the first option of a filter.
- **Don't:** A select with one option.
