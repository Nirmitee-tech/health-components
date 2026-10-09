# Breadcrumb

Breadcrumb shows where a deep screen sits and links back up the path.

**From the screens:** Addition asked for in the brief: no screen has a breadcrumb; they use "Back to Settings" buttons. Built from link and muted text styles.

## When to use

- Three or more levels deep in Settings or Reports.

## When not to use

- Inside the patient chart (the banner already anchors it).

## Variants and states

| Variant | What it is |
|---|---|
| default | Links, chevrons, current page in `ink` 500. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `items` | Array<{label, href?}> | required |

## Usage

```jsx
<Breadcrumb items={[{ label: "Settings", href: "/settings" }, { label: "Roles and Permissions", href: "/settings/roles" }, { label: "Biller" }]} />
```

## Accessibility

- nav "Breadcrumb", ordered list, aria-current="page" on the last item.

## Do and don't

- **Do:** Settings, Roles and Permissions, Biller.
- **Don't:** Repeat the page title as a link.
