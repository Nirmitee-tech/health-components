# TopBar

TopBar is the 52px app header in all four styles: Classic navy bar with module links, patient search (Sidebar), patient tabs (Rail) or the Jump to anything bar (Command), then Viewing as, notifications and the account.

**From the screens:** `.cs-top` (52px, `surface`, bottom `border`) with `.cs-sbox`, `.cs-cbar`, `.cs-modb`, `.cs-pill`, `.cs-ib`, `.cs-av`.

## When to use

- Top of every desktop staff screen.

## When not to use

- Phone, portal and kiosk screens: MobileHeader.

## Variants and states

| Variant | What it is |
|---|---|
| classic | Default style. Navy `nav-bg` bar (#285278) with white logo and module links, white Viewing as pill. |
| sidebar | Search box left. |
| rail | PatientTabs left. |
| command | Logo, module switcher and the command bar. |

## Props

The consumer provides these. Everything else comes from the tokens.

| Prop | Type | Default |
|---|---|---|
| `variant` | 'classic' \| 'sidebar' \| 'rail' \| 'command' | 'classic' |
| `role` | string: shows RolePill | none |
| `roles` | RolePill roles | none |
| `notifications` | number | none |
| `quickAdd` | string | "New" |
| `user` | string | "Jordan Lee" |
| `tabs` | node: rail only | none |
| `module` | string: command only | "Modules" |
| `onOpenPalette` | () => void | none |
| `links / active` | string[] / string: classic module links | Home ... Settings |

## Usage

```jsx
<TopBar variant={uiStyle} role={previewRole} roles={ROLES} notifications={unread} />  // uiStyle: classic | sidebar | rail | command
```

## Accessibility

- header landmark; search input labelled "Search patients by name, MRN or DOB"; account button "Account menu".

## Do and don't

- **Do:** Keep the right cluster in the same order in all three styles.
- **Don't:** Put page actions in the top bar.
