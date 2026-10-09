# health-components · CareOS

**Production React components, Web Components and design tokens for healthcare EHR, practice management,
revenue cycle and patient apps.**

CareOS is the set of building blocks the CareOS screens are made of: the colours, type, spacing and **185 components**,
from the schedule and the patient chart to claims, prior authorization, the patient portal, the phone app and the
check-in kiosk. A team that uses it does not design a patient banner, an allergy list, an ICD-10 picker, an ERA posting
row or a break-the-glass dialog again; it composes screens from parts that already carry the clinical, billing and
privacy rules.

- **Docs:** https://nirmitee-tech.github.io/health-components/
- **Storybook:** https://nirmitee-tech.github.io/health-components/storybook/
- **npm:** [`health-components`](https://www.npmjs.com/package/health-components)

## Features

- **185 components in two layers.** 58 Basic components (buttons, inputs, selection, data display, feedback,
  overlays, navigation, charts, layout) and 127 Complex healthcare components: clinical lists, e-prescribing, notes and
  coding, revenue cycle, scheduling, work queues, quality programs, access control, app shells for desktop, phone and
  kiosk, inpatient nursing (Flowsheet, MAR, barcode scanning) and patient flow (bed board, ADT, reconciliation), ED,
  perioperative and labor and delivery, specialty clinics (dental, eye, hearing, prenatal, PT, behavioral health,
  pediatric dosing, oncology) and chart panels.
- **One source for clinical numbers.** `fmt` and the `ClinicalValue` family format every value, unit, dose, date,
  identifier and code, with a shared reference-range registry (outpatient, inpatient, ED, pediatric, pregnancy) and a
  `RangeContextProvider`.
- **Machine-readable manifest for AI agents:** `health-components/manifest.agents.json`.
- **React and Angular.** Typed React components for React 18 and 19, and the same components as standards-based
  custom elements (`<co-button>`) for Angular, Vue, Svelte and plain HTML.
- **Five themes from one token file:** Classic, Clinical Sidebar, Focus Rail, Command Bar and Dark, as scoped
  `--co-*` CSS variables that never clash with your app.
- **Accessible:** WAI-ARIA keyboard patterns, focus management in overlays, and every story checked with axe in CI.
- **SSR-ready, tree-shakeable, zero runtime dependencies** besides React.

## Install

```bash
npm install health-components
```

### React

```tsx
import 'health-components/styles.css';
import 'health-components/fonts.css'; // optional: Roboto from Google Fonts
import { ThemeProvider, Button, Card } from 'health-components';

export function App() {
  return (
    <ThemeProvider theme="classic">
      <Card title="Visit">
        <Button variant="primary" iconLeft="plus">Start Visit Note</Button>
      </Card>
    </ThemeProvider>
  );
}
```

### Angular

```ts
// main.ts
import { defineCareOSElements } from 'health-components/elements';
defineCareOSElements();
```

```ts
// any standalone component (or NgModule)
@Component({ schemas: [CUSTOM_ELEMENTS_SCHEMA], /* ... */ })
```

```html
<co-button variant="primary" icon-left="plus" (click)="start()">Start Visit Note</co-button>
<co-split-button label="Submit Claim" [items]="actions" (co-item-select)="onPick($event.detail[0])"></co-split-button>
```

### Plain HTML

```html
<script src="https://cdn.jsdelivr.net/npm/health-components@1/dist/cdn/careos-elements.js" defer></script>
<co-button variant="primary">Check In</co-button>
```

## Package entry points

| Import | What |
|---|---|
| `health-components` | React components and types (ESM + CJS) |
| `health-components/styles.css` | Tokens for all five themes + component styles |
| `health-components/elements` | `defineCareOSElements()` and typed custom elements |
| `health-components/elements/register` | Side-effect import that registers every element |
| `health-components/tokens` | Tokens as typed data (`tokens`, `colorValue`, `tokenVar`) |
| `health-components/tokens.css` · `tokens.json` · `components.css` · `fonts.css` | Individual stylesheets and the raw tokens |
| `health-components/cdn/careos-elements.js` | One self-contained script with every element |

## Develop

```bash
npm install
npm run storybook        # component workshop at http://localhost:6006
npm test                 # unit tests + every story rendered (DOM and SSR) and checked with axe
npm run lint
npm run typecheck
npm run build            # dist/
cd website && npm install && npm start   # docs site at http://localhost:3000/health-components/
```

A working Angular app lives in [`examples/angular`](./examples/angular).

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the repository layout and the rules every component follows.

## License

MIT © Nirmitee
