# Drawer

Drawer slides a panel in from the right for detail and secondary forms, including the "For developers" panel, or up from the bottom on phones.

**From the screens:** `.ov.r` with `.drawer` (560px) on 212 screens; every screen has a "For developers" drawer (`.devsec` sections); `.ov.b` `.sheet` bottom sheet on portal screens.

## When to use

- Record detail while keeping the list visible (claim detail from the queue), filters, the developer panel, phone action sheets.

## When not to use

- A yes or no decision: Modal.

## Variants and states

| Variant | What it is |
|---|---|
| right | 560px, full height. |
| developer | Code icon, "For developers: <screen>", sections of purpose, data, API and states in mono. |
| bottom | Sheet with grab handle, radius 16 top corners, 430px max. |
| width | Custom px. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `open` | boolean | true |
| `title` | string | required |
| `side` | 'right' \| 'bottom' | 'right' |
| `developer` | boolean | false |
| `sections` | Array<{title, body?, code?}>: developer drawer | none |
| `children` | body | none |
| `footer` | node | none |
| `width` | number | 560 |
| `onClose` | () => void | none |
| `inline` | boolean | false |

## Usage

```jsx
<Drawer title="Claim CLM-20871" onClose={close} footer={<Button variant="primary">Resubmit</Button>}>...</Drawer>
<Drawer side="bottom" title="Visit options">...</Drawer>
```

## Accessibility

- dialog with aria-modal, labelled by the title; Escape closes.
- The developer close button is named "Close developer panel", as in the screens.

## Do and don't

- **Do:** Developer drawer: purpose and roles, data fields, API calls, states, in that order.
- **Don't:** A drawer that opens another drawer.
