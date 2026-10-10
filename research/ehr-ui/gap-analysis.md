# Gap analysis: Epic and athenaOne patterns vs CareOS

Every pattern the research found, mapped to what CareOS (`health-components`, 185 components) has today.

- **Have**: an existing component covers it.
- **Partial**: a component exists but lacks the behaviour or states described.
- **Missing**: nothing covers it yet.

## Layout and navigation

| Pattern | Seen in | CareOS today | Status | Notes for the next design system |
|---|---|---|---|---|
| Persistent patient sidebar (identity, safety badges, key info, details) | Epic Storyboard | PatientBanner (horizontal), ChartSummary | **Partial** | Add a vertical `PatientSidebar` with collapse / hover-expand; reuse AllergyBadge, CodeStatusBanner, IsolationBadge |
| Safety badge strip (allergies: NKA vs not on file, code status, isolation) | Epic | AllergyBadge, CodeStatusBanner, IsolationBadge, PatientBanner | **Have** | Keep "No Known Allergies" vs "Not reviewed" as separate states (already in AllergyList) |
| FYI flags with hover list | Epic | PatientBanner `flags` | **Partial** | Add a flag icon with popover list and click-through |
| Copyable identifier hover bubble (MRN, CSN) | Epic | IdentifierDisplay (copy) | **Have** | — |
| Workspace tabs for several open patients | Epic | PatientTabs | **Have** | Add unsaved-changes state |
| Activity tab bar inside a workspace, user-reorderable | Epic | Tabs, SectionNav | **Partial** | Add reorder + overflow menu + personal defaults |
| Search-first command bar | Epic Hyperdrive | CommandPalette, TopBar command variant | **Have** | Add "search activity on type, chart search on Enter" pattern |
| App menu + pinnable toolbar (wrench / pin) | Epic | TopBar, Menu | **Missing** | `PinnableToolbar` with pin / unpin and a personalisation panel |
| Bookmarks manager (up to 40, groups) | athenaOne | — | **Missing** | Small `BookmarkMenu` |
| Chart left nav with Apps tab / App Dock | athenaOne | SectionNav, SplitPaneChartLayout | **Partial** | Add an embedded-app slot (SMART on FHIR launch) |
| Exception dashboard tiles linking to worklists | athenaOne Workflow Dashboard | KPIGrid, StatCard | **Have** | — |
| AI copilot dock (bottom-right chat) | athenaOne Sage | ChatThread, AISuggestion | **Partial** | `CopilotDock`: collapsed / open / answering, ambient-consent state |

## Encounter documentation

| Pattern | Seen in | CareOS today | Status | Notes |
|---|---|---|---|---|
| Visit navigator: section index + scrolling form, complete / required markers | Epic Visit Navigator | VisitNoteEditor, SectionNav, StepperForm | **Partial** | Add per-section complete / required / reviewed markers |
| Encounter stage stepper (Check-in → Intake → Exam → Sign-off → Checkout) | athenaOne | Stepper, CheckInStepper | **Partial** | `EncounterStageBar` with skipped stages (Exam-only) and stage actions |
| "Mark as Reviewed" footer (reviewed by / at) | Epic | AllergyList "Mark Reviewed" | **Partial** | Generalise as `ReviewedFooter` for any section |
| Smart text: dot-phrases, live-data tokens, single / multi-select fields, `***` wildcards, F2 next field, block sign while unresolved | Epic SmartTools; athenaOne text macros | SOAPSection (smart-phrase insert) | **Missing (big)** | `SmartTextEditor`: the most valuable gap |
| Template picker + Saved Findings + "set to previous encounter" | athenaOne | SOAPSection, NursingAssessment | **Partial** | Add saved findings and copy-forward |
| Reorderable documentation sections | athenaOne | — | **Missing** | Drag-reorder in the navigator |
| Encounter plan auto-load from reason / diagnosis | athenaOne | OrderSetPicker | **Partial** | Proposed / accepted / removed item states |
| Diagnosis-anchored A&P with nested orders | athenaOne | ICD10Picker, OrderSetPicker, InpatientOrderEntry | **Missing** | `AssessmentPlan`: diagnoses with nested orders and remove-before-sign |
| Wrap-up: diagnosis picker, LOS speed buttons, Sign Visit | Epic | CPTPicker, ICD10Picker, VisitNoteEditor | **Partial** | `VisitWrapUp` with level-of-service buttons |
| Results grid with H / L / C flags and trend graph | Epic Synopsis / Results Review | LabResultTable, ResultsTrendPanel, ResultsReview, ClinicalValue | **Have** | — |
| Sortable chart review table with quick-filter chips and saved filters | Epic Chart Review | DataTable, FilterChip | **Partial** | Add saved filters |
| Report pane / snapshot card stack | Epic Snapshot | ChartSummary, Card | **Have** | — |
| Medication change indicator since last sign-off | athenaOne | MedicationRow | **Missing** | "Changed" dot state |
| Med rec rows (taking / not taking / remove / last dose) | Epic | MedReconciliation | **Have** | — |
| Problem list with hospital-problem and principal toggles | Epic | ProblemListEditor | **Partial** | Add principal (single-select) toggle |

## Orders, alerts and prescribing

| Pattern | Seen in | CareOS today | Status | Notes |
|---|---|---|---|---|
| Order search with preference list and favourites | Epic | DrugSearch, OrderSetPicker, InpatientOrderEntry | **Partial** | Star-to-favourite and preference list tabs |
| Order composer with stop-sign incomplete states | Epic | InpatientOrderEntry, SigBuilder | **Partial** | Required-field "stop sign" links |
| Sign / Pend footer with pending queue and cosign | Epic | VisitNoteEditor actions | **Missing** | `SignPendBar`: pended / signed / needs cosign |
| Interruptive vs passive decision-support alert with acknowledge reasons | Epic BPA | ClinicalDecisionSupportCard, DrugInteractionAlert | **Have** | Add an interruptive modal variant |
| Rx composer: formulary + benefit, most-frequently-written, EPCS | athenaOne, Epic | DrugSearch, SigBuilder, EPCSApproval | **Have** | Add formulary / benefit badge |

## Inbox, messaging and tasks

| Pattern | Seen in | CareOS today | Status | Notes |
|---|---|---|---|---|
| Typed message folders with counts + list + detail + folder-specific actions | Epic In Basket; athenaOne Clinical Inbox | InboxList, InboxItem | **Partial** | Three-pane layout, folder-specific toolbars, Done / Follow-up |
| Inbox grid view with inline actions and bulk reassign | athenaOne | DataTable (bulk), InboxList | **Partial** | Grid mode on InboxList |
| Document statuses REVIEW / SUBMIT / DATAENTRY / CLOSED | athenaOne | StatusTag | **Partial** | Add an inbox-document status set |
| Task routing rule builder (TAO) | athenaOne | PermissionMatrix | **Missing** | Admin rule table |
| Patient case (non-visit communication record) | athenaOne | — | **Missing** | `PatientCase` card with contact attempts |
| Secure chat with patient attachment and open-chart link | Epic Secure Chat; athenaText | ChatThread, ChatMessage | **Partial** | Patient-context attachment chip |

## Inpatient

| Pattern | Seen in | CareOS today | Status |
|---|---|---|---|
| Flowsheet grid (time columns, groups, comments, WDL) | Epic | Flowsheet | **Have** |
| MAR with barcode scan | Epic | MAR, BarcodeScanPrompt | **Have** |
| Nurse timeline task board (Brain) | Epic | CarePlanByShift, TaskCard | **Partial**: needs a time-axis task board |
| Patient list grid with directory pane and column templates | Epic | CensusList | **Partial**: add list directory |

## Scheduling and revenue cycle

| Pattern | Seen in | CareOS today | Status | Notes |
|---|---|---|---|---|
| Schedule grid with status chips | Epic, athenaOne | Calendar, ProviderDayColumns, AppointmentChip | **Have** | Add "focus mode" and green bookable-slot highlight |
| Eligibility indicator at check-in | athenaOne | EligibilityResult, InsuranceCoverageCard | **Have** | Add compact inline indicator |
| Predicted copay / card on file | athenaOne | CopayCollector | **Have** | — |
| Claim status chip (DROP / HOLD / MGRHOLD / BILLED) | athenaOne | ClaimStatusTag (X12 states) | **Partial** | Add an internal-workflow status set |
| Claim edit with scrubber findings | athenaOne | ClaimForm (claim check) | **Have** | — |
| Kick-code / reason selector on every claim touch | athenaOne | — | **Missing** | `ReasonCodePicker` |
| Claim worklist builder with performance tab | athenaOne | DataTable, KPIGrid | **Partial** | Saved-queue builder |
| Payment posting batch + unpostables | athenaOne | ERAPostingRow | **Partial** | Batch header and unpostables list |

## Foundations worth adopting

| Idea | Source | CareOS today | Suggestion |
|---|---|---|---|
| Semantic alert palette with usage rules (e.g. "attention never as text") | Forge colour guide | Status tokens with usage notes | Already equivalent; add explicit "never as text" rules to token notes |
| Purple for info, teal for "new" | Forge | AI purple reserved for AI | Keep AI purple exclusive (clearer); do not copy |
| Icon sizing (24 default, 16 inline, gaps 8 / 4) | Forge | 16 default, 12–26 range | Document size tokens |
| LTS and "New" release tracks | Forge | Single semver line | Consider an LTS dist-tag once adopted by several apps |
| Separate patient-facing system (Spark) and native (Foundation) | athenahealth | One system, phone + kiosk components | Consider a patient-facing theme with larger type |

## Priority shortlist

1. **SmartTextEditor**: dot-phrases, live-data tokens, pick-list fields, `***` wildcards, next-field navigation, sign
   blocked until resolved. The biggest productivity feature in both products.
2. **AssessmentPlan**: diagnosis-anchored plan with nested orders and encounter-plan auto-load.
3. **Three-pane Inbox**: typed folders with counts, list, detail, folder-specific actions, grid mode, bulk reassign.
4. **PatientSidebar**: Storyboard-style persistent context.
5. **SignPendBar** and **ReviewedFooter**: the small, everywhere patterns.
6. **EncounterStageBar**: athena-style visit stages with skipped states.
7. **PinnableToolbar / BookmarkMenu** personalisation.
