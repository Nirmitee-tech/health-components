# athenaOne UI research report (public sources only)

## How this was researched, and its limits

- **No page was opened directly.** Page fetches and the sandbox proxy were denied for athenahealth.com, youtube.com,
  medium.com and forge.athena.io. Everything below comes from web-search result summaries of the cited pages.
- **No screenshot or video frame was seen** and no video timestamp was confirmed. The source catalog marks which
  sources should contain screenshots or video, for review in a normal browser.
- **Confidence labels:** (confirmed) = an official or primary source; (secondary) = third-party blog;
  (uncertain) = inferred or conflicting.

---

## 0. athenahealth's design system: **Forge** (publicly documented, not open source)

| Item | Finding |
|---|---|
| Name and scope | **Forge** is athenahealth's React design system for provider-facing and internal web apps, including athenaOne. Its FAQ says React apps for providers or internal users must use it, and that it is internal, built by "athenistas". Source: guide.forge.athena.io/gettingstarted/faq |
| Documentation | Current: https://guide.forge.athena.io · LTS: https://lts-guide.forge.athena.io. Two tracks: **Forge LTS** (stable) and **Forge New** (new features, breaking changes) — https://guide.forge.athena.io/guidelines/forgeversionsguide |
| Contents | React package, Figma library (detaching components discouraged), typography / colour / spacing guidelines, "200+ custom icons", "50+ UI components" (count may be dated). |
| Code package | `@athena/forge` with per-module paths (`@athena/forge/DataTable`). **Not on public npm** (registry returns Not found): a private registry. |
| Public GitHub | github.com/athenahealth has ~25 public repos (API samples, FHIR, CQL tooling); **no design-system repo**. |
| Sister systems | **Spark** — patient-facing, responsive, mobile-first; Forge "was primarily built for desktop-only, and with clinicians and admins in mind" (https://www.camrihinkie.com/spark-design-language). **Foundation** — native iOS / Android. |
| History | UXPin Design Systems Summit 2018, Carl Tsui and Jen Cardello: built for quality, velocity and consistency across "200+ product teams". Slides https://www.slideshare.net/uxpin/initiating-and-sustaining-design-systems-for-the-enterprise · video https://www.youtube.com/watch?v=RIDPXZlRbv0 |

### Forge foundations (confirmed from guide snippets)

- **Typography** (https://guide.forge.athena.io/guidelines/typography): Source Sans Pro is the only UI typeface (PT Serif
  Bold is brand display only). Headings ~34 / 24 / 18 px semibold; body 16 px, small 14 px, tiny 12 px. Italics only for
  emphasis, definitions or new terms; underline only for links.
- **Colour** (https://guide.forge.athena.io/guidelines/color): neutrals first, strong contrast, AA combinations, Sass maps
  (`forge-abstracts.$color-neutral`); specs use semantic names, never hex. Interaction default `#0466B4`, select
  `#043961`, select-light `#F0F9FF`. Default text and non-interactive icons `#373738`.

  | Alert token | Hex | Rule |
  |---|---|---|
  | new | `#23A1BE` | text only above 14pt |
  | success | `#118647` | — |
  | info | `#9C28B1` | purple (unusual) |
  | attention | `#F3A61C` | never as text |
  | critical | `#CA0D0D` | restricted |

- **Icons** (https://guide.forge.athena.io/guidelines/icons): 24 px default (incl. icon-only tertiary buttons), 16 px
  inline / inside components; 2–4 px vertical padding; 8 px gap (large) / 4 px (small). Interactive icons blue `#0466B4`;
  close and expand stay grey. Icons add context, not decoration.
- **Grid**: GridRow / GridCol (https://guide.forge.athena.io/guidelines/grid-spacing-and-layout).
- **Style guide** for product copy (times, phone numbers): https://guide.forge.athena.io/guidelines/style-guide
- **Shadow DOM** supported since Forge 8.2.0 via `Root`; Lightbox, Modal, Toast portal to `document.body`
  (https://guide.forge.athena.io/guidelines/shadow-dom).

### Forge components with evidence

Root (theme wrapper) · Button (primary / secondary / tertiary) · Form, FormField, MultiField (no built-in validation) ·
Input + Typeahead · DateInput (popup calendar, ±5 years, not for ranges) · List (static, single / multi select) · Loader
(indeterminate blocking overlay) · ProgressIndicator (determinate) · Stepper (Default, Navigable, Compact — compact below
640 px; no built-in buttons or workflow logic) · Tabs / TabPane (24 px padding) · DataTable (`createDataTable` factory) ·
Modal, Lightbox, Toast · Icon (deprecated). No pages found for Badge, Tag, Card, Popover.

---

## 1. Layout and navigation

- **Product framing:** athenaOne Base (formerly athenaNet) = athenaClinicals (EHR) + athenaCollector (PM / RCM) +
  athenaCommunicator (engagement).
- **Global navigation:** "Claims > Claims Worklists" on the Main Menu; admin under a **Settings gear** (Gear > Admin >
  Practice Manager / Clinicals; Gear > Clinicals Admin > Order Configuration > EPCS). Support menu for cases. **Bookmarks**:
  up to 40 pages, rename / reorder / group / delete (iorad tutorial). Exact top-menu labels **unconfirmed**.
- **Clinician home:** **Clinical Inbox on the left** (Physician Maven demo checklist). Holds results to review, patients to
  notify, encounters and orders to sign, documents to label; a "Need Follow Up" bucket for closed-loop orders. 2024: act
  from a **grid view**; bulk reassign up to 100 documents; 2025: items older than 24 months hidden; 2026: AI routes spam
  faxes to a SPAMDOCUMENTS bucket.
- **Workflow Dashboard** (non-clinical, exception-based) for front desk and billers: unverified / ineligible insurance,
  outstanding payments, no-shows, Missing Slips, front-end scrub, rejections, denials. Reportedly renamed **"Non-Clinician
  Inbox"** (secondary).
- **Appointment Schedule (since 2023):** replaced the legacy scheduler (>90% adoption); booking can start without a
  patient; slots colour-coded by appointment type; today = **blue circle**, selected date = **grey circle**; bookable slots
  **green**; selected provider tab white with bold blue text, unselected grey; "Show Booking" toggle; "Calendar focus" mode
  hides filters, notes and availability (help page). Design story: http://www.kaymaloney.com/scheduling-management
- **Encounter stages:** **Check-in → Intake → Exam → Sign-off → Checkout**; buttons "Start Check In" / "Done with Check In";
  appointment types can skip Intake ("EXAM ONLY"); Sign-off launched from Exam.
- **Patient chart:** **Quickview** = demographics and registration hub (Contact, Insurances, "Add card image" → "Update /
  Delete card image"). Left chart menu with an **Apps** tab and a find box. **Quality tab** (bottom-left button; "OTHER
  MEASURES" not yet due). **Patient Actions Bar** (Create Patient Case, Create Order Group, consent). Embedded apps in Apps
  tab, App Dock and Encounter Card.
- **MFA:** risk-based, Okta Verify (code / push), SMS, voice, TOTP; EPCS uses Symantec VIP separately.

## 2. Per-workflow breakdown

**Scheduling and check-in.** Eligibility runs 3 days before the visit and when insurance changes; **alert at check-in**
for "unverified" or "ineligible" (visual form unknown). Smart Insurance Selection shows eligibility status; ML-predicted
copay at check-in; card scanning with an athenaCapture barcode for phone capture; signature-pad consents. Patient digital
self check-in (demographics, card image, copay, card on file). Waitlist texts open slots.

**Encounter documentation.** Reorderable sections; template pickers in HPI, ROS, PE, Procedure; **Saved Findings** (per
encounter or per patient) pre-fill positive / negative findings; "Set To Previous Encounter"; text macros via `.` +
shortcut; spell check; voice navigation. **Encounter Plans**: the visit reason or diagnosis auto-loads diagnoses, orders,
templates and questionnaires (e.g. PRAPARE). **Diagnosis-driven A&P**: orders nest under each diagnosis; **order sets**
linked to a diagnosis auto-add (remove what does not apply before signing); sets hold meds, labs, imaging, vaccines, DME,
procedures, education, referrals; scoped to user / group / practice. Medication list: a **blue dot** marks meds that moved
since last sign-off (uncertain); short-term meds auto-reconcile; problems grouped by specialty category. 2025–26 AI:
ambient notes, **Sage** copilot bottom-right of the chart, problem-based summaries, Timeline (alpha), toggleable
"AI-native" encounter view.

**Clinical Inbox.** Task types: results, notifications, encounters and orders to sign, documents to classify, patient
cases, appointment requests, Follow Up, clinical documents. Statuses: **REVIEW**, **SUBMIT**, **DATAENTRY** (signed order,
no result), **CLOSED**. Routing by **Task Assignment Overrides (TAOs)** and roles. Closing a result with an action note
notifies the patient; auto-publish configurable.

**E-prescribing.** In A&P as "Prescribe" (vs Administer / Dispense); Surescripts with FDB formulary and benefit; EPCS for
controlled substances; non-editable "Most Frequently Written" list; configurable alerts.

**Claims and denials.** Charge entry from the billing slip; scrubber (30,000+ rules) moves claims through **DROP** (clean,
batched overnight), **HOLD** (fix and re-save), **MGRHOLD**, **CBO HOLD**, **BILLED**. Every touch requires a **kick code**
(e.g. DRPBILLING). **Claim Inbox** with custom queues (payer, error, denial, CPT), assign / escalate / pend, Performance
tab. Claim Edit, Claim Action, Visit & Claim Update pages.

**Payments.** Post Payment (ERA vs paper EOB), Unpostables worklist, statements at most every 35 days, returned mail →
statement hold, Patient Account Hold worklist, dunning levels, card on file, payment plans.

**Patient app.** Bottom navigation: Visits, Inbox (chat-bubble compose), Billing, Account. Results, refills, family
access, check-in, telehealth (built on Spark, inferred).

**Clinician mobile (athenaOne).** Schedule, inbox, visit prep, exam documentation with orders, patient cases, order
groups, ambient notes; Android is a reduced read-only design; athenaCapture for photos; athenaText for secure messaging.

## 3. Visual language and redesigns

Source Sans Pro, interactive blue `#0466B4`, text `#373738`, neutral-first palette, **purple for info** and teal for
"new"; desktop-first and dense. All-caps status vocabulary (HOLD, DROP, REVIEW) is part of the UI language. Changes:
2023 Appointment Schedule; 2024 inbox grid actions; Summer 2025 "jotter" navigation and an Insights Executive Summary;
Fall 2025 Diagnosis Gaps Dashboard (Open / Addressed / Dismissed); Nov 2025 AI-native encounter; 2026 GA to ~170k
clinicians. No wholesale visual rebrand found.

## 4. UX praise and criticism

2025 Best in KLAS Overall Independent Physician Practice Suite (software score 81). Capterra 3.8 (~900 reviews); G2 praises
ease of use and "less cluttered than other EHRs". Criticisms: too many clicks, slow loading, glitches after updates, weak
reporting UX, switching modules feels like a chore.

## 5. Source catalog

| # | Source | URL | Type | What it shows |
|---|---|---|---|---|
| 1 | Forge guide | https://guide.forge.athena.io | Official DS docs | Components, colour, type, icons, grid |
| 2 | Forge Color | https://guide.forge.athena.io/guidelines/color | Official | Token values |
| 3 | Forge Typography | https://guide.forge.athena.io/guidelines/typography | Official | Type scale |
| 4 | Forge Icons | https://guide.forge.athena.io/guidelines/icons | Official | Icon sizing and colour |
| 5 | Forge Stepper | https://guide.forge.athena.io/components/stepper | Official | Stepper variants |
| 6 | Forge LTS | https://lts-guide.forge.athena.io/components/form | Official | Form, Icon |
| 7 | Forge 2018 talk | https://www.slideshare.net/uxpin/initiating-and-sustaining-design-systems-for-the-enterprise · https://www.youtube.com/watch?v=RIDPXZlRbv0 | Slides / video | Forge origins |
| 8 | Spark case study | https://www.camrihinkie.com/spark-design-language | Portfolio | Patient DS vs Forge |
| 9 | Scheduling redesign | http://www.kaymaloney.com/scheduling-management | Portfolio (images likely) | Scheduler |
| 10 | Inpatient discharge redesign | https://www.danreinebergdesign.co/case-study-athenahealth | Portfolio | Discharge |
| 11 | athenahealth design blog | https://medium.com/athenahealth-design | Blog | DesignOps, payments design |
| 12 | NACHC TCM workflow | https://www.nachc.org/wp-content/uploads/2025/08/athenaOne_TCM-Workflow.pdf | PDF (screenshots expected) | Patient case, TAO, macros, Exam / Sign-off |
| 13 | NACHC SDOH workflow | https://nachc.org/wp-content/uploads/2025/03/athenaOne-SDoH-Workflow.pdf | PDF | Questionnaires, encounter plans |
| 14 | NACHC CCM / PCM workflow | https://www.nachc.org/wp-content/uploads/2025/08/athenaOne-CMM_PCM-Workflow.pdf | PDF | Patient Actions Bar, order group |
| 15 | Physician Maven demo checklist | https://www.athenahealth.com/~/media/athenaweb/files/client/client-advocacy-programs/physician_maven_demo_guide_checklist.pdf | Official PDF | Home, inbox, stages, templates |
| 16 | Service Description 2026 | https://www.athenahealth.com/sites/default/files/media_docs/athenaOne-Service-Description.pdf | Official PDF | Feature scope |
| 17 | Appointment Schedule help | https://help.athenahealth.com/Ohelp/Content/Features/Appointment_Schedule_Calendar_A.htm | Official help | Calendar colours, tabs |
| 18 | MFA help | https://help.athenahealth.com/Ohelp/Content/Plat_MultiFactorAuthentication_PH.htm | Official help | Login / MFA |
| 19 | Insurance card help | https://help.athenahealth.com/Ohelp/Content/Add_Update_Insurance_Card_Image_PH.htm | Official help | Quickview card image |
| 20 | New Features 24.3 | https://help.athenahealth.com/24-3/Content/_ReusedFiles/New-Features_24-3.htm | Release notes | Inbox grid actions |
| 21 | UTRGV EPCS setup | https://www.utrgv.edu/som/forms/_files/documents/athena/how-to-setup-epcs-in-athena.pdf | PDF (screenshots likely) | Admin gear menus |
| 22 | UToledo handouts | https://www.utoledo.edu/it/education/pdf/e-learning-handouts/AthenaCapture%20app%20%20How%20to%20securely%20upload%20images.pdf | PDF with screenshots | Quickview, athenaCapture, athenaText |
| 23 | MDVIP telehealth setup | https://www.mdvip.com/sites/default/files/inline-images/Revised_MDVIP%20athenaNet%20Telemedicine%20Setup%20Guide%20040220.pdf | PDF | Appointment type and stages |
| 24 | DACC eRx guide | https://www.dacconline.com/ebn/EBNMG/forms/MIPS/Measure%20Satisfaction%20Guide_eRx.pdf | PDF with screenshots | Prescribing |
| 25 | Takeda athenaClinicals guide | https://content.takeda.com/?contenttype=GEN&product=GEN&language=ENG&country=USA&documentnumber=27 | PDF | Order sets, alerts, Rx lists |
| 26 | GSK athenaClinicals guides | https://gskpro.com/en-us/resources/ehr-resources/athenaclinicals/ | PDF guides | eRx, order sets |
| 27 | Retinal screening order sets | https://docs.retinalscreenings.com/assets/Athena.pdf | PDF | Order set build |
| 28 | Billing Overview (Scribd) | https://www.scribd.com/document/889820952/User-Guide-Billing-Overview | User guide | Claim statuses, worklists |
| 29 | Claim Inbox (Scribd) | https://www.scribd.com/document/893799254/Claim-Inbox | User guide | Claim Inbox |
| 30 | Unpostables / Receivables (Scribd) | https://www.scribd.com/document/893800254/Find-Unpostables · https://www.scribd.com/document/889821265/Fully-Worked-Receivables | User guide | Posting, A/R |
| 31 | iorad: Entering claims | https://www.iorad.com/player/1841902/Entering--claims-in-Athena- | Step-by-step screenshots | Charge entry |
| 32 | iorad: Normal lab results | https://www.iorad.com/player/1979182/Normal-Lab-Results--Athena- | Screenshots | Result review |
| 33 | iorad: Bookmarks | https://www.iorad.com/player/2582109/Athena---Bookmark-athenaOne-Pages-for-Quick-Access | Screenshots | Bookmarks |
| 34 | Kick codes | https://www.physicianinterlink.com/kick-codes-in-athena-collector/ | Article | Claim workflow |
| 35 | Ignite articles | https://ignitehs.com/blog/athenahealth-medical-billing-a-navigational-guide/ · https://ignitehs.com/blog/athenaclinicals-lab-imaging-result-notification-tips/ · https://ignitehs.com/blog/athenaone-2026-spring-release-new-features-overview/ | Articles | Dashboards, statuses, releases |
| 36 | Quality tab help | https://emr-help.document360.io/docs/health-maintenance-tracking-intervals-in-athenaone | Clinic KB | Quality tab |
| 37 | YouTube: athenaOne demo | https://www.youtube.com/watch?v=H_oqpkrd3Tw | Video | Full encounter cycle |
| 38 | YouTube: Education Session demo (Apr 2025) | https://www.youtube.com/watch?v=gyf51Xhkn-4 | Official video | Live demo |
| 39 | YouTube: Top Hits / Education Sessions | https://www.youtube.com/watch?v=DZDNGjqBRKM · https://www.youtube.com/watch?v=rZJ4J6icOtw · https://www.youtube.com/watch?v=9yo-ENSSH_o | Official videos | Feature tours |
| 40 | YouTube: AI-native athenaOne | https://www.youtube.com/watch?v=C7hfgIsjQl4 | Official video | AI encounter |
| 41 | YouTube: Athena EHR training playlist | https://www.youtube.com/playlist?list=PLnS11siqlqaV4Gahtq2rk03BW9n6D_JM1 | Third-party videos | Navigation |
| 42 | YouTube: encounters, shortcuts, provider training | https://www.youtube.com/watch?v=eyYj-H3EzuI · https://www.youtube.com/watch?v=YGceAdaCuzA · https://www.youtube.com/watch?v=MHc2_cz5fhI | Third-party videos | Encounter documentation |
| 43 | YouTube: athenaTelehealth demo | https://www.youtube.com/watch?v=dIkDBEsJ1jI | Video | Telehealth |
| 44 | YouTube: athenaPatient webinar | https://www.youtube.com/watch?v=4qs7PfJiINQ | Video | Patient app |
| 45 | athenahealth 12-minute demo | https://www.athenahealth.com/videos/12-minute-demo | Official video | Product tour |
| 46 | App Store listings | https://apps.apple.com/us/app/athenaone/id1486336635 · https://apps.apple.com/us/app/athenapatient/id1644169294 | Screenshot galleries | Mobile UIs |
| 47 | athenaPatient FAQ | https://www.athenahealth.com/patientapp-help | Official | App navigation |
| 48 | Capterra / G2 / Software Advice | https://www.capterra.com/p/98735/athenaOne/ · https://www.g2.com/products/athenaone/reviews · https://www.softwareadvice.com/medical/athenacollector-athenaclinicals-profile/reviews/ | Reviews + screenshots | Sentiment |
| 49 | KLAS | https://klasresearch.com/vendor-ratings/athenahealth/61379 | Ratings | Satisfaction |
| 50 | athenahealth blogs | https://www.athenahealth.com/resources/blog/5-ways-athenaone-makes-charting-easier · https://www.athenahealth.com/resources/blog/athenaone-efficient-patient-charting · https://www.athenahealth.com/resources/blog/clinical-inbox-management · https://www.athenahealth.com/resources/blog/athenaone-summer-2025-update · https://www.athenahealth.com/resources/blog/a-fully-ai-native-clinical-experience | Official articles | Features |

## 6. Components and patterns for a design system

| Component / pattern | Purpose | Key states |
|---|---|---|
| Encounter stage stepper | Check-in → Intake → Exam → Sign-off → Checkout | not started / active / done / skipped; navigable and compact |
| Stage action buttons | Start / Done with each stage | enabled / disabled / confirm |
| Reorderable documentation sections | HPI, ROS, PE, Procedure, A&P | collapsed / expanded / empty / documented / drag-reorder |
| Template picker + Saved Findings | Insert templates or prior findings | per encounter vs per patient; set to previous encounter |
| Inline text-macro expansion | `.shortcut` expands | suggestion list, expanded |
| Encounter Plan auto-load | Reason or diagnosis loads Dx, orders, templates | proposed / accepted / removed |
| Diagnosis-anchored A&P with nested orders | Orders grouped under each diagnosis | order statuses; remove before sign |
| Order set / order group | Bundles meds, labs, imaging, referrals, education | user / group / practice scope |
| Rx composer | Prescribe / Administer / Dispense | formulary + benefit, interaction alert, EPCS 2FA, most frequently written |
| Clinical Inbox (list + grid) | Task triage | categories; REVIEW / SUBMIT / DATAENTRY / CLOSED; bulk reassign; inline actions; notify patient |
| Task routing rules (TAO) | Admin rule builder | role and document-type targets |
| Patient case | Non-visit communication record | open / in progress / closed; contact attempts |
| Quickview demographics card | Registration hub | card image add / update / delete; capture barcode |
| Patient actions bar | Chart-wide actions | create case, order group, consent |
| Chart left nav + Apps tab / App Dock | Navigation and embedded apps | selected, badges (uncertain) |
| Quality / care-gap panel | Measures due vs other | due / satisfied / dismissed; Open / Addressed / Dismissed |
| Medication change indicator | Dot on meds changed since last sign-off | changed vs unchanged (uncertain) |
| Calendar / schedule grid | Provider tabs, colour-coded slot types | today blue circle, selected grey, open slot green, booking toggle, focus mode |
| Eligibility indicator | Insurance status | verified / unverified / ineligible |
| Copay prompt / card on file | Time-of-service collection | predicted, collected, waived |
| Claim status chip | DROP / HOLD / MGRHOLD / CBO HOLD / BILLED | scrubber-driven |
| Claim edit with scrubber findings | Fix errors until clean | multiple errors, save, resubmit, void |
| Kick-code selector | Required reason on each claim touch | next-status hint |
| Claim Inbox / worklist builder | Custom queues | assign / escalate / pend; performance |
| Workflow dashboard counters | Exception tiles linking to worklists | zero / non-zero / overdue |
| Payment posting + unpostables | ERA / EOB posting | balanced / unbalanced / unpostable |
| Patient balance + statement hold | A/R per patient | dunning level, hold, payment plan |
| Bookmarks manager | Up to 40 saved pages | add / rename / group / reorder |
| AI copilot dock | Chat in the chart corner | collapsed / open / answering; ambient consent |
| AI summary card | Problem-based or document summaries | draft / flagged |
| Patient app bottom tab bar | Visits / Inbox / Billing / Account | badge, compose button |
| MFA challenge | Push / TOTP / SMS | risk-based prompt, remember device |
