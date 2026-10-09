Publish the repaired catalogue and shared visual improvements. This changes the appearance of the library, documentation and Storybook together. Existing component APIs stay in place. Consumers that update the stylesheet will see the new borders, spacing and typography.

The live component catalogue crashed when it tried to render its group headings. Its production compiler treated a map iterator as a single array item. The build succeeded and the pages returned HTTP 200, which did not establish that they worked in a browser. The replacement groups entries through ordinary object keys and has search, layer filters, an empty state and links to each component.

The previous styling used heavy borders, small patient identity headings and crowded previews. Shared styles now give patient identity and section headings more emphasis, use lighter borders and provide more space in tables and examples. The landing page, documentation shell and Storybook use the same visual foundation. Wide preview content stays inside its own scroll area.

The demo navigation now switches between the patient chart, schedule, billing and inbox. Chart section links select and scroll to sections that actually exist. The demo labels its data as synthetic and explains that local interactions reset. Several story actions remain examples rather than saved clinical operations.

Verification on October 9, 2026 included every generated component page, all story variants in the automated suite, selected contrast pairs in all five themes, and the demo in a mobile browser viewport. These checks establish rendering and the tested interactions. They do not establish complete accessibility, clinical correctness, usability with clinicians or production readiness. The previous broad accessibility claim was withdrawn because the story checks omit browser colour contrast.

For whoever builds this

Skip this section unless you are writing the code.

- The source inventory is generated from component stories and README files by `scripts/gen-docs.mjs`. `scripts/verify-docs-build.mjs` reruns the artifact inventory and reports source, scope, counting unit and time. The local build contained 186 component pages, 186 Storybook documentation entries and 742 story variants, with no missing component page.
- `src/internal/docs/catalogue-utils.ts` contains the grouping and filtering logic. `ComponentCatalogue.tsx` renders the searchable catalogue. `website/tsconfig.json` targets ES2020 and enables iterator support.
- `DemoNavigation.tsx` owns workspace navigation and chart section scrolling. The corresponding integration tests verify visible selection, the workspace heading, link targets and section scrolling.
- `src/tokens/tokens.json` remains the token source. Run `npm run tokens` when changing it. `src/styles/refinement.css` is included through the existing stylesheet pipeline for React, custom elements and previews.
- The unit and integration suite passed 853 tests. The story suite passed 1,484 server-render and jsdom accessibility checks across 742 variants. The 30 selected text and control-boundary contrast tests are included in the 853, not additional tests. Colour contrast in the story axe suite remains disabled. Selected token contrast tests cannot establish the contrast of every rendered state.
- Commands: `npm test -- --exclude test/stories.test.tsx`, `npm test -- test/stories.test.tsx`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm run verify:package`, `npm run build-storybook`, and `npm run build` in `website`.
- Browser checks opened every component route and waited for its preview to mount before checking for page and preview error messages. This is a crash sweep, not an inspection of every interaction or every visual state. Representative clinical examples and the demo received visual inspection.
- Replacing the framework and reimplementing every component were considered unnecessary because the crash and shared styling could be repaired within the existing architecture. The earlier HTTP-only publication check was insufficient and has been replaced by actual browser verification for this change.

A reported Sparkline Storybook failure was traced to a requested hashed JavaScript bundle returning HTTP 404. DonutChart had the same failure in that browser session. The deploy workflow now retrieves the last two successful deployments when their artifacts are available and retains their original assets. Manifests keep original assets separate and carry retained assets forward for one hour, so quick consecutive deployments do not immediately remove them. The expiry bounds retention over repeated builds. Unit and HTTP integration tests verify that stale URLs remain available alongside the current bundles. Expired artifacts can still require a browser reload.

Remote CI exposed a dependency on the website TypeScript configuration in the new library regression tests. Explicit esbuild compiler options did not avoid Vite resolving that configuration. The framework-independent widgets were moved to `src/internal/docs` so the library test job can run without Docusaurus dependencies. The same components remain used by the website.

The remaining decision is whether the visual hierarchy and demo workflows suit intended clinicians. A clinician and the product owner can answer that after trying the published examples. Automated tests cannot make that decision.
