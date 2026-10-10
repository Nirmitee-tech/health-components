# Epic EHR UI research report (public sources only)

## How this was researched, and its limits
- **No page was opened.** WebFetch failed on every domain (DNS / proxy CONNECT 403; epic.com, youtube.com and archive.org were all denied). Every finding below comes from WebSearch result summaries of the cited pages.
- **No screenshot was seen and no video timestamp was checked.** Where a PDF is known to be a screenshot tip sheet, that is noted, but someone should open it and confirm.
- **Confidence tags:**
  - **[Confirmed]**: two or more independent institutional sources say the same thing.
  - **[Single source]**: one source only.
  - **[Weak]**: from student flashcards (Quizlet, CourseHero, Brainly) or vendor marketing.
  - **[Unverified, general knowledge]**: my own background knowledge. No source in this session backs it.
- **Colours and labels vary by site.** Epic is configured per health system, and several sources say so explicitly. Treat colour conventions as patterns, not a spec.

---

## 1. Overall layout and navigation

### Window chrome (Hyperspace, carried into Hyperdrive)
- **Epic button.** The main menu, top-left. Flashcard sources say it holds the available menus, such as Reports and Tools ([Quizlet: Basic Hyperspace Components](https://quizlet.com/92728098/basic-hyperspace-components-flash-cards/)) [Weak].
- **Toolbar** across the top. The Epic menu sits on the left and Secure / Log Out on the right [Weak, same source].
- **Pinning items to the toolbar.** Advocate Aurora's tip sheet: "The wrench in the top red bar will let you place shortcuts from the Epic button on to your top bar." It suggests pinning Staff Message, Telephone Call, Chart and Web Links, and moving rarely used items into a "rarely used" folder ([Advocate Aurora NCLP Epic Tip Sheet PDF](https://cme.advocateaurorahealth.org/sites/default/files/NCLP%20Epic%20Tip%20Sheet.pdf)) [Single source].
  - The "top red bar" shows the toolbar colour is set per organisation.
  - Hopkins (2023) reports that the upgraded toolbar says "Pin it" where it used to say "Wrench it in", and that toolbar items can be reordered by drag and drop ([Hopkins, May 26 2023](https://medicine-matters.blogs.hopkinsmedicine.org/2023/05/epic-upgraded-hyperspace-tips-may-26-2023/)).
- **Workspace tabs.** Each open workspace (a patient chart, the Schedule, In Basket, and so on) gets its own tab across the top. Ctrl+W closes a workspace, and Ctrl+Tab / Ctrl+Shift+Tab moves between workspaces ([Surety Systems](https://www.suretysystems.com/insights/how-to-successfully-transition-from-epic-hyperspace-to-hyperdrive/); [TextExpander shortcut list](https://textexpander.com/blog/epic-shortcuts)) [Confirmed by more than one secondary source]. This is how several patients stay open at once.
- **Activity tabs.** Inside a patient workspace, a row of activity tabs: Chart Review, Results Review, Synopsis, Problem List, Orders, Notes, Flowsheets, MAR and so on. Ctrl+Up/Down moves between them [Weak]. Storyboard personalisation tip sheets cover customising "the horizontal activity tabs" ([RCHSD Storyboard tip sheet PDF](https://www.rchsd.org/documents/2020/12/pediatric-grand-rounds-storyboard-tip-sheet.pdf/)).
- **Navigators.** Guided, sectioned workflows such as Rooming, Visit Navigator, Wrap-Up, Admission and Discharge.
  - They use a dual pane: a list of section links on the left and a scrolling form on the right ([Quizlet AMB100](https://quizlet.com/605954270/amb100-epiccare-ambulatory-fundamentals-flash-cards/)) [Weak].
  - UW's guide describes a navigator as "a predefined set of steps for a care team member to follow", where no step is mandatory and sections can be reordered via "Customize Your Navigator" ([UW Epic Journey Adventure Guide PDF](https://depts.washington.edu/dbpeds/EPIC/Epic%20Journey%20Adventure%20Guide.pdf)).
  - Advocate Aurora: you choose which section buttons show and whether they are "fat or thin", per encounter type. Activities can be reordered only within their own pane.
- **Right-hand Sidebar.** Shows condensed versions of reports from elsewhere in the chart, and in some builds lets you place orders. You can save favourites with the wrench ([CourseHero periop companion](https://www.coursehero.com/file/p2u26ed/The-Sidebar-right-side-of-the-screen-is-available-to-all-perioperative/)) [Weak].
  - Connect Care (Alberta) lists Sidebar activities: lab review, lab/imaging notification selection, clinical score tools ([Connect Care Manual: Sidebar Activities](https://manual.connect-care.ca/workflows/documentation/sidebar-activities)).

### Storyboard (left patient sidebar)
**What it replaced.** Storyboard replaced the horizontal patient header/banner, rolling out in 2019–2020. Hopkins: the "current 'header' moves to left vertical side of screen & 'navigator sections' move to horizontal position". Pilot users got it on 12/12/19 and all users on 3/19/20 ([Hopkins Tip, Nov 22 2019](https://medicine-matters.blogs.hopkinsmedicine.org/2019/11/epic-tip-of-the-week-november-222019/)).

**Other rollouts:**
- [UNC, Jan 2020](https://news.unchealthcare.org/2020/01/preview-new-view-for-epic-unc-patient-header-storyboard-in-the-epic-unc-playground/)
- [WVU](https://hsc.wvu.edu/hub/announcements/story/?headline=epic-to-move-to-storyboard-view) and [WVU go-live](https://medicine.wvu.edu/News/Story?headline=epic-storyboard-default-view-starts-june-15)
- [TriHealth](https://bridge.trihealth.com/our-stories/2020/may/storyboard-coming-to-epic)
- [UNMC](https://www.unmc.edu/newsroom/2019/11/27/coming-soon-changes-to-one-chart-patient-workspace/)
- [Northeast Medical Group](https://www.northeastmedicalgroup.org/newsletter/november2020/reminder-storyboard-has-launched)

**Stated reasons:** fewer clicks and screen jumps, better use of widescreen monitors, and "learn about patients at a glance" (TriHealth, UNMC).

**Contents** (configurable by role):
- **Four sections.** One training source names Notifications, Patient Identification, Key Information and Details [Weak, via search summary].
- **Patient identification:** name, age/sex, MRN, room/bed, photo. MRN, CSN and HAR can be copied from the hover bubble (RCHSD).
- **Always-visible safety items:** code status, infection-control / isolation precautions and high-priority allergies "remain visible at all times regardless of activity" [Confirmed in multiple secondary guides; e.g. [arhfoundation](https://www.arhfoundation.org/what-is-storyboard-in-epic), [wellyhub](https://wellyhub.com/understanding-your-ehr-where-is-the-storyboard-on-epic)]. The Isolation indicator can be opened from Storyboard ([Methodist Infections/Isolations PDF](https://www.methodistmd.org/files/epic/Day-in-the-Life/Acute-Nursing-Support-Staff/Inpatient_Nurse_Infections_Isolations.pdf)).
- **FYI flags:** an icon. Hovering shows the flags and clicking opens the FYI activity.
  - Example flags: Custody Issues, Medication Contract, Blood Products Refusal, Hospice, Palliative Care.
  - Flags are added manually and are not visible to patients ([CCHC Vision 20/22 change-impact PDF](https://www.cchcpulse.com/app/files/public/023be850-281a-4224-9aa1-da9a52e4a778/change-impact-assessment-snapshot.pdf); [Aspirus FYI flag guideline](https://www.aspirus.org/Resource.ashx?sn=WPV-Guidelines-Disruptive-FYI-Flag)).
- **Treatment team / care team and messaging.** Houston Methodist moved the treatment team higher, above allergies and the principal problem ([HM Radiologist Companion 2020 PDF](https://it.houstonmethodist.org/wp-content/uploads/2020/08/Sept-13-2020-Radiologist-Companion.pdf)). RCHSD has a "Treatment team and messaging" exercise.
- **Recent vitals,** with hover for history; height/weight under Details [Weak].
- **Encounter type, principal problem, legal status.** Iowa has a legal-status handout "viewed in the Storyboard" ([UIowa Storyboard page](https://epicsupport.sites.uiowa.edu/epic-resources/storyboard)).

**Interaction:**
- "Hover to discover": hover bubbles expand detail ([Hopkins June 26 2020](https://medicine-matters.blogs.hopkinsmedicine.org/2020/06/epic-tip-of-the-week-june-26-2020/)).
- Hyperlinks jump to the related activity. Chart Search is available from it (RCHSD).
- In data-dense activities Storyboard can collapse to a horizontal header (RCHSD).
- Specialty variants exist, e.g. the Beacon Oncology Storyboard handout (UIowa).

### Patient header vs Storyboard
Storyboard is now the patient context column, so most of the old header's work moved there. Navigator sections went horizontal. A narrow header strip still exists in some views [partly unverified].

### Hyperdrive and search-first navigation
- **What Hyperdrive is.** Epic's web-based client: Hyperspace re-platformed into a Chromium-based, Epic-specific browser ([open.epic: Hyperdrive](https://open.epic.com/Hyperdrive)).
  - Announced around UGM 2021, initial testing November 2021, broad availability May 2022, and required by roughly the 2023 releases. Sources disagree on May vs November 2023 ([Becker's: AltaMed](https://www.beckershospitalreview.com/ehrs/altamed-completes-epic-hyperdrive-migration.html); [Becker's: RWJBarnabas](https://www.beckershospitalreview.com/healthcare-information-technology/ehrs/rwjbarnabas-health-goes-live-with-epic-hyperdrive/); [Providence blog](https://blog.providence.org/south-puget-sound-medical-staff-updates/epic-to-transition-from-hyperspace-to-hyperdrive)).
  - The visual model is largely the same as Hyperspace. UIowa Lab: "Epic updated the look of the system… search screens changed most noticeably" ([UIowa lab bulletin, June 2023](https://www.healthcare.uiowa.edu/path%5Fhandbook/lab_bulletins/archived/2023/LabBroadcast_6_16_23.html)).
- **Search bar (top right):**
  - Ctrl+Space focuses it.
  - Typing an activity name without pressing Enter shows a dropdown of matching Epic activities.
  - Pressing Enter runs Chart Search within the open patient ([Methodist Physician Pocket Reference PDF](https://www.methodistmd.org/files/epic/epic-general/Epic_PhysicianPocket_ReferenceGuide.pdf); [Hopkins 2019 tips](https://www.hopkinsmedicine.org/news/articles/2019/08/epic-shortcuts-experts-share-their-favorite-tips); [WVU Chart Search video article](https://medicine.wvu.edu/News/Story?headline=it-provides-video-for-using-epic-s-chart-search-feature)).
  - Typing "What's New" surfaces in-system upgrade training ([YNHHS](https://www.ynhhs.org/perspectives/epic-upgrade); [UIowa 2026 Spring Upgrade](https://epicsupport.sites.uiowa.edu/epic-upgrade)).
  - Vendor blogs describe Hyperdrive as "search-first" ([Mindbowser](https://www.mindbowser.com/epic-hyperspace-vs-epic-hyperdrive/); [Folio3](https://digitalhealth.folio3.com/blog/epic-hyperdrive-complete-user-guide/)) [Weak].
- **Performance claims:** one benchmark measured chart open at 2.25 s in Hyperdrive vs 6.78 s in Hyperspace ([Login VSI](https://www.loginvsi.com/resources/blog/epic-hyperspace-vs-hyperdrive-performance-testing-and-key-considerations-from-login-enterprise/)) [vendor].

---

## 2. Screen-by-screen breakdown

### Ambulatory

**Schedule (Multi-Provider Schedule)**
- **Layout:** a grid or list of the day's appointments, columns configurable per user.
- **Status colour-coding:** "automatic color-coding for patient status (scheduled, arrived, waiting…)", sharing features with Patient Lists ([Hopkins 2019 upgrade note](https://medicine-matters.blogs.hopkinsmedicine.org/2019/01/epic-upgrade-key-new-features-reminders-worth-knowing/)).
- **Status changes** happen through check-in and rooming, and can be set manually from the Schedule, from navigators, or from the Department Appointments Report ([UIowa Check In/Check Out](https://epicsupport.sites.uiowa.edu/epic-resources/check-incheck-out)).
- **Not found:** the exact colour key.

**Chart Review**
- **Layout:** sub-tabs (Encounters, Notes, Labs, Imaging, Procedures, Media, Letters and so on), each a sortable table with a report pane below or beside it.
- **Filters:**
  - The filter button toggles a filter panel.
  - Encounters filter by diagnosis, encounter type and department specialty; Labs by order; Media by document type.
  - A saved filter set becomes a personal "Quick Filter" checkbox at the top of the tab.
  - Users can reorder tabs and set a default tab.
  - Sources: [Methodist Physician User Settings Guide PDF](https://www.methodistmd.org/files/epic/user-settings-lab/mlh-provider-user-settings-guides/pdfs/Inpatient%20and%20Outpatient%20Physician%20User%20Settings%20Guide.pdf); [Advocate Aurora PDF](https://cme.advocateaurorahealth.org/sites/default/files/NCLP%20Epic%20Tip%20Sheet.pdf); [Trinity Health ECL Quick Start PDF](https://www.trinityhealthpace.org/sites/default/files/epiccare/epiccare-link-community-user-quick-start-guide.pdf).
- **Where it sits:** generally the leftmost activity tab ([Connect Care: Finding Encounters](https://manual.connect-care.ca/workflows/context/finding-encounters)).
- **Density:** very high; a dense table of rows.

**Snapshot / Summary / Synopsis / Results Review / Review Flowsheets**
- **Snapshot / Summary:** outpatient charts open to SnapShot and inpatient charts to a Summary tab (Connect Care). Snapshot is a configurable one-page report of sections.
- **Synopsis:** trends and correlations, with graphing ([UIowa efficiency tips](https://epicsupport.sites.uiowa.edu/epic-resources/its-possible-heres-how-efficiency-tips)).
- **Results Review:** a filter/sort tree of result components ([UIowa 2021 Results Review upgrade](https://www.healthcare.uiowa.edu/path%5Fhandbook/lab_bulletins/archived/2021/EpicUpgrade.html)).
- **Review Flowsheets:** read-only, cross-encounter grid of vitals, doses and lab components ([UIowa Review Flowsheets](https://epicsupport.sites.uiowa.edu/epic-resources/review-flowsheets)).
- **Abnormal results:** H / L / A / C flags are standard lab flags ([ARUP PDF](https://www.aruplab.com/files/resources/testing/ChartRefInterFlagAbnorm.pdf)). Red text or an exclamation mark for abnormal or critical values in Epic and MyChart is reported but depends on site [Weak]. Manually entered results need abnormal flags cleared by hand when corrected ([Northwell POCT tip sheet PDF](https://labs.northwell.edu/epic/tips/uploads/documents/Tipsheet_POCT_Manual_documentation-Non_Integrated_devices_Physician.pdf)).

**Rooming / Intake navigator (MA / RN)**
- **Sections:**
  - Visit Info, where the Chief Complaint / Reason for Visit lives ([Hopkins Mar 3 2023](https://medicine-matters.blogs.hopkinsmedicine.org/2023/03/epic-tips-march-3-2023/)).
  - Vitals: BP, pain, temperature, weight, height, auto-calculated BMI, HR, glucose.
  - Allergies / Contraindications.
  - Medication review (Taking / Not Taking).
  - History: medical, surgical, family, social ([UW guide](https://depts.washington.edu/dbpeds/EPIC/Epic%20Journey%20Adventure%20Guide.pdf); [Quizlet Rooming tab](https://quizlet.com/635008037/l3-epic-rooming-tab-flash-cards/) [Weak]).
- **Chief-complaint speed buttons** can be customised, and a second set of vitals can be added later in the visit ([WesternU KB](https://support.westernu.edu/TDClient/1848/Portal/KB/ArticleDet?ID=157312)).
- **Other navigators:** specialty workflows get their own tab, e.g. anticoagulation.

**Medication reconciliation**
- **Per-row states:** Taking, Not Taking, "Not Taking & Flag for Removal", with last-dose fields.
- **Section footer:** a "Mark as Reviewed" button, typically pressed by the provider.
- **Sources:** [Akron Children's home med review PDF](https://www.akronchildrens.org/files/2013451/file/10-1-ambulatory-home-medication-review.pdf); [Lurie Children's Med Rec tip sheet PDF](https://www.luriepedsres.org/uploads/1/3/0/6/130660035/epic_med_rec_tip_sheet__1_.pdf); [AAACN forum](https://community.aaacn.org/discussion/medication-reconciliation-can-ma-mark-as-reviewed-in-epic).
- **Inpatient:** prior-to-admission meds sit under Admit/Transfer, in the Meds/Order Rec navigator section (Lurie).

**Problem List**
- **Structure:** a single problem list shared across specialties and visits.
- **Inpatient columns:** a Hospital Problem checkbox, then a Principal checkbox (only one principal problem allowed).
- **Footer:** "Mark as Reviewed".
- **Editing in notes:** problems can be edited from the A&P section of the note.
- **Sources:** [CHS Buffalo Problem List PDF](https://medstaff.chsbuffalo.org/wp-content/uploads/2019/08/Problem-List-and-Principle-list-for-attendings.pdf); [Washington Regional PDF](https://www.wregional.com/Uploads/Public/Documents/MedStaff/Epic%20Resources/Maintaining%20a%20Problem%20List.pdf); [Akron problem list guide PDF](https://www.akronchildrens.org/files/2013449/file/10-1-problemlistguide.pdf); [Connect Care Problem List Management](https://manual.connect-care.ca/workflows/documentation/problem-list-management).

**Orders: preference lists, order sets and the composer**
- **Finding orders:** search returns your personal preference list first, then the facility list. A star icon adds an order to your preference list ([BWH: Customize Preference List PDF](https://www.brighamandwomens.org/assets/BWH/research/pdfs/46-customize-your-preference-list-for-efficient-ordering-pi.pdf); Methodist pocket guide).
- **Composing:** tick checkboxes, then "Accept Orders" opens the details form (Order Composer).
- **Signing:** done from the bottom right of Order Entry ([United Regional ECL Order Entry PDF](https://www.unitedregional.org/getContentAsset/2432a28f-6b42-4709-925a-b51264e6e0f2/c204d644-0ccb-43d4-a505-69664b0a9bc3/EpicCare-Link-Order-Entry-Tip-Sheet.pdf?language=en)).
- **Required-field states:**
  - A **red stop sign** marks an order missing required fields such as the diagnosis association.
  - Once complete it becomes **two linked circles**.
  - **Blue links** lead to the missing fields ([YNHHS Home Health ECL Referral tip](https://www.ynhhs.org/-/media/Files/YNHHS/covid_employees/Operational-Guidelines/Tips_Epic_CPOE_HomeHealthECLReferral.ashx)) [Single source, strong signal].
  - Signing with missing requirements now opens Order Composer directly instead of showing a warning ([Hopkins Nov 12 2021](https://medicine-matters.blogs.hopkinsmedicine.org/2021/11/epic-tips-november-12-2021/)).
- **Shortcuts:** Alt+S opens Sign Orders; F6 opens the comment box (TextExpander list).
- **Sign vs Pend:**
  - Pend holds an order to sign later. Pended orders appear in the provider's In Basket "My Unsigned Orders" ([Texas Children's ECL orders PDF](https://www.texaschildrens.org/sites/default/files/uploads/documents/Entering%20and%20Signing%20Order%20in%20EC%20Link_Providers_Updated%2010.9.2020.pdf)).
  - Staff without signing authority Pend and route to the provider ([UC Health research ordering PDF](https://www.uchealth.com/wp-content/uploads/sites/3/2014/01/Research-Ordering-Procedures.pdf); [UIowa ambulatory orders](https://epicsupport.sites.uiowa.edu/epic-resources/ambulatoryoutpatient-orders)).
- **Order sets:** the Methodist guide notes users can wrench personal versions of order sets.

**BPA / OurPractice Advisory (OPA)**
- **Naming:** newer Epic calls these "OurPractice Advisories" ([UIowa OPA](https://epicsupport.sites.uiowa.edu/epic-resources/ourpractice-advisory-opa)).
- **Two types:** interruptive (must be acknowledged before continuing) and in-line non-interruptive (shown in a navigator section or sidebar) ([JAMIA Open: Singapore BPA optimisation](https://pmc.ncbi.nlm.nih.gov/articles/PMC10393867/)).
- **Contents:** display text, optional chart data, suggested orders as checkboxes, and acknowledge reasons, often with an "Other" that requires free text.
  - Example reasons from the Epic Deterioration Index BPA: notified provider and reassessing; not primary nurse; known condition; Other with free text ([Houston Methodist EDI BPA](https://it.houstonmethodist.org/bpa-new-acknowledgement-reasons-for-edi/)).
- **Button labels are built per alert.** E.g. "Add Visit Diagnosis / Do Not Add / Resolve Problems" ([Methodist HCC OPA tip sheet PDF](https://www.methodistmd.org/files/epic/Day-in-the-Life/population-management/HCC-OPA-Tip-Sheet.pdf)).
- **Colour:** one pharmacogenomics paper says the alert was "bright yellow… to designate its importance" ([ResearchGate clopidogrel BPA figure](https://www.researchgate.net/figure/Sample-Epic-Best-Practice-Advisory-alert-for-clopidogrel-CYP2C19-implementation-BPA_fig1_260684552)) [Single source].
- **Build structure:** criteria records plus base records holding display text and follow-ups ([VUMC Intro to Epic Build](https://www.vumc.org/vclic/intro-epic-and-build-capabilities)).
- **Drug–drug interaction alerts:** interruptive, with an optional override reason ([JGIM DDI study](https://link.springer.com/article/10.1007/s11606-018-4415-9)).
- **Screenshot sources:** the [Cambridge sinusitis alert paper](https://pmc.ncbi.nlm.nih.gov/articles/PMC12835937) (Fig. 1) and the [ResearchGate "BPA in navigator" figure](https://www.researchgate.net/figure/Best-Practice-Alert-in-navigator-of-Epic_fig3_236693035).

**Wrap-Up / Level of Service / Sign Visit**
- **Wrap-Up** is a dual-pane navigator for finalising the visit: diagnoses, LOS (Level of Service, the billing level), follow-up, patient instructions / AVS (After Visit Summary), and Sign Visit to close the encounter for billing [Quizlet, Weak].
- **LOS speed buttons:** up to 25 can be configured (Methodist settings guide).
- **Diagnoses section:** [UIowa Diagnoses](https://epicsupport.sites.uiowa.edu/epic-resources/diagnoses).
- **Who signs:** only the attending sets LOS; close the visit only when the whole team is done ([EHHOP Attendings](https://ehhapp.org/Attendings)).
- **Charge rule:** each charge needs a diagnosis and a bill area ([BMC note-based charging PDF](https://www.bumc.bu.edu/gimcovid/files/2020/04/BMC-Note-Based-Charging-in-Epic.pdf)).

**Note writing with SmartTools**
- **SmartPhrase:** a dot-phrase (".name") that expands to text.
- **SmartLink:** pulls live chart data into the note.
- **SmartList:** a pick-list field inside the note.
  - A **yellow** background means single-select.
  - A **blue** background means multi-select ([Alameda ECL Quick Start PDF](https://www.alamedahealthsystem.org/wp-content/uploads/2019/10/EpicCare-Link-Quick-Start-Guide.pdf); [CloudsPress](https://www.cloudspress.com/how-to-add-smartphrase-in-epic/)) [Confirmed].
- **Wildcard `***`:** a placeholder that must be filled before signing.
- **F2** jumps to the next SmartList or `***` ([Trinity Health "Using SmartTools" PDF](https://www.trinityhealthmichigan.org/sites/default/files/hg_features/mercury_standard_layout/eb820386679ce065fea368f43146a3cd.pdf)). Signing with `***` left in may be blocked or warned [Unverified, general knowledge].
- **Reference PDF:** [SmartTools PDF (Contentstack)](https://assets.contentstack.io/v3/assets/blt3055f692fe7bf193/bltb5fe1c6400397124/67c86ceb87966da41399773d/smarttools.pdf).

**In Basket**
- **Layout:** three panes.
  - Folder list on the left, one folder per message type, with counts.
  - Message list in the middle.
  - Message detail / report below or to the right ([UMass "Using and Personalizing In Basket" PDF](https://www.umassmed.edu/globalassets/office-of-undergraduate-medical-education-media/ehr-c/using-the-in-basket.pdf)).
- **Three toolbar levels:** a general In Basket toolbar, a folder/message-type toolbar (fixed by message type), and a message-report toolbar with a wrench.
- **Message types** (from [Kansas Health System folders PDF](https://www.kansashealthsystem.com/-/media/Project/Website/PDFs-for-Download/COVID19/in-basket-folders-for-providers.pdf); [Connect Care In Basket](https://manual.connect-care.ca/Communications/InBasket)):
  - Results
  - Rx Request
  - Patient Message / Pt Advice Request
  - Staff Message
  - Patient Call
  - Chart Cosign (and Cosign – Meds, Cosign Notes)
  - CC'd Charts
  - Chart Completion
  - Referral Message
  - Outside Messages
  - My Unsigned Orders
  - Each folder in the Kansas PDF explains "Why is this message here? / What do I do with it?"
- **Actions:** Reply, Reply All, Forward, Take, Done, Encounter (opens the linked encounter), Rslt Note, and QuickActions that bundle reply + route + Done in one click ([UVM ECL tip sheet](https://www.uvmhealth.org/document/5878); [Methodist In Basket Workflows PDF](https://www.methodistmd.org/files/epic/Day-in-the-Life/ambulatory/Ambulatory-InBasket_Workflows_Scenarios.pdf)).
- **Version 22.2 redesign (Aug 2022):**
  - Properties became "Follow-up".
  - Comment was folded into Follow-up.
  - Reviewed and Complete were merged into a single **Done**.
  - QuickActions were redesigned, and toolbar items can be hidden or reordered or given a double-click action.
  - The Send button shows a **floppy-disk icon when the message will be saved to the chart**.
  - A guided tour runs on first open.
  - Source: [Salem Health 22.2 tip sheet PDF](https://www.salemhealth.org/docs/default-source/common-ground-docs-and-images/epic-tip-sheet.pdf?sfvrsn=8c83d4c4_4).
- **Message flags:** [RCHSD Adding an In Basket Flag PDF](https://www.rchsd.org/documents/2020/12/pediatric-grand-rounds-adding-a-flag-to-an-in-basket-message.pdf/).
- **AI drafts:** a "Start with draft" AI reply (Augmented Response Technology, later "Art") for patient messages and result comments ([EpicShare: Mayo](https://www.epicshare.org/share-and-learn/mayo-ai-message-responses); [Memorial Hermann release](https://memorialhermann.org/about-us/newsroom/press-releases/epics-ai-tool-helps-patients-understand-test-results)).

### Inpatient

**Patient Lists**
- **Layout:** three regions.
  - Directory on the left: "My Lists" and "Available Lists" (system and unit lists, team lists).
  - Centre: the list grid.
  - Bottom: a report pane for the selected patient.
  - Source: [Northwestern Transfer Center Patient Lists PDF](https://physicianforum.nm.org/uploads/1/1/9/4/119404942/transfer-center-patient-lists.pdf).
- **Adding lists:** drag lists onto My Lists, or right-click to add as a favourite.
- **Columns:** build from a column template via Copy, then edit through Available Columns ([Methodist settings guide](https://www.methodistmd.org/files/epic/user-settings-lab/mlh-provider-user-settings-guides/pdfs/Inpatient%20and%20Outpatient%20Physician%20User%20Settings%20Guide.pdf); [Houston Methodist My List PDF](https://it.houstonmethodist.org/wp-content/uploads/2020/09/Patient-List-and-Creating-a-My-List.pdf)).
- **Auto lists:** "My Patients" populates automatically from treatment-team assignment ([NM Treatment Team sign-in PDF](https://physicianforum.nm.org/uploads/1/1/9/4/119404942/epic_treatment_team_sign-in_and_patient_list.pdf)).
- **Density:** high; the list is a grid of patients with icon columns.

**Brain (inpatient nurse)**
- **Timeline:** a shift timeline for each assigned patient, with time blocks across and patients/tasks down. It shows meds, labs, assessments and To Do tasks.
- **Filters:** Meds / Labs / Assessments / To Do, plus Show All.
- **Drag and drop** moves task due times, including most meds.
- **Personal tasks:** start time, recurrence, priority, comments.
- **A / S / D buttons** list the remaining Admission, Shift or Discharge documentation.
- **Task icon:** To-Do tasks use a clipboard icon.
- **Sources:** [Methodist Inpatient Nurse Top Efficiency Tips PDF](https://www.methodistmd.org/files/epic/Day-in-the-Life/Acute-Nursing-Support-Staff/Inpatient_Nurse_Top_Efficiency.pdf); [UIowa Inpatient Nursing](https://epicsupport.sites.uiowa.edu/epic-resources/inpatient-nursing).
- **Colours:** a nurse forum mentions green checkmarks for completed items ([allnurses](https://allnurses.com/epic-brain-t740292/)); overdue highlighted yellow per a student source [Weak].

**Flowsheets**
- **Layout:** a grid. Rows are measures grouped into collapsible groups; columns are time stamps.
- **Adding columns:**
  - Add Col / "Now" adds a column for the current time.
  - Insert Col adds a past time; typing "n-20" means 20 minutes ago.
  - "Last Filed" shows or copies the previous value.
- **Cell tools:** the paper icon adds a cell comment; a Details pane shows the normal range for the row.
- **Unfiled state:** unfiled values show blue lines until filed. Filing is explicit, or happens automatically on leaving the activity.
- **Accept vs Complete:** "Accept" keeps the row open; "Complete" closes it (blood administration).
- **WDL ("within defined limits") rows:** shortcut the documentation of normals.
- **Sources:** [MultiCare Inpatient Self-Guided Practice PDF](https://static.multicare.org/photos/Education/EpicCrisisReliefContent/CrisisReliefInpatientNurseSelf-GuidedPractice.pdf); [Riverside Epic Inpatient Nursing exercise book PDF](https://otis3.riversidehealthcare.net/content/epic/inpatient/orientation%20materials/epic%20online%20exercise%20book.pdf); [OSU blood admin tip sheet PDF](https://hrs.osu.edu/-/media/files/wexnermedical/healthcare-professionals/clinical-labs/transfusion-services/documenting-blood-administration-tip-sheet.pdf?la=en&hash=5B7C3C19E90CE6BF9A322C24CEAA079AFA308BCB); [UIowa Flowsheets](https://epicsupport.sites.uiowa.edu/epic-resources/flowsheets).
- **Not found:** an abnormal-value cell colour.

**MAR (Medication Administration Record)**
- **Layout:** one row per medication; columns or a timeline of scheduled times; an administration form opens on click or scan.
- **Barcode scanning** of patient and medication is the primary interaction ([UIowa MAR](https://epicsupport.sites.uiowa.edu/epic-resources/medication-administration-record-mar)).
- **Overdue rule:** a dose is overdue if not charted within 60 minutes, and it is never auto-marked "Not Given" [Weak].
- **Colours:** student sources conflict and none is authoritative, so the colours are unknown.
- **Training videos:** a YouTube series covers web MAR administration: [MAR overview](https://www.youtube.com/watch?v=AOAt0SCWT7E), [Administering meds on the MAR](https://www.youtube.com/watch?v=euCjDO3OYNg), [Advanced med admin](https://www.youtube.com/watch?v=md42w6omuF8), [IV fluids and drips](https://www.youtube.com/watch?v=T6Couhk0zDA).

**Secure Chat**
- **Platforms:** Hyperspace, Haiku, Canto and Rover.
- **Patient context:** a chat can be attached to a patient, and the chart opens from the chat. Orders cannot be placed from chat.
- **Policy:** guidance says chat is for non-urgent use; urgent items go to phone/Vocera/Whistle.
- **Sounds:** normal-priority sounds can be personalised.
- **Sources:** [Upstate Chat in Hyperspace tip sheet PDF](http://lists.upstate.edu/pipermail/epicallusers/attachments/20200205/d7c151a7/ChatSecurelyinHyperspaceUpstateTipSheet_Rev02032020.pdf); [Houston Methodist Secure Chat FAQ PDF](https://it.houstonmethodist.org/wp-content/uploads/2020/04/Secure-Chat-FAQs_final.pdf); [HM Secure Chat flyer PDF](https://it.houstonmethodist.org/wp-content/uploads/2020/09/Flyer-Secure-Chat-Overview-UPDATE-1.pdf); [Inpatient RN Secure Chat tip sheet PDF](https://cdn-aorpci7.actonsoftware.com/acton/cdna/16479/f-20865c7a-2eb9-41c0-9d5d-488f58364469/1/0/Epic%20Secure%20Chat%20tip%20sheet.pdf); [Eskenazi Haiku & Secure Chat quick tips PDF](https://www.eskenazihealth.edu/docs/default-source/haiku-canto-library/haiku-and-secure-chat-quick-tips.pdf?Status=Temp&sfvrsn=f886af9d_2); [Methodist Secure Chat/Haiku setup PDF](https://www.methodistmd.org/files/epic/epic-general/Epic_Secure_Chat_TipSheet.pdf).

### Mobile and patient portal
- **Haiku (phone)**
  - Features: chart review, patient lists, schedule, In Basket, Secure Chat, voice calls, clinical image capture.
  - Sources: [Geisinger](https://www.geisinger.org/patient-care/for-professionals/epic-haiku-and-canto-mobile-apps); [UCHealth](https://www.uchealth.com/en/employees/epic-mobile-apps); [Inova](https://www.inova.org/for-physicians/epiccare-mobile-apps); [Google Play Haiku](https://play.google.com/store/apps/details?id=com.epic.haiku.android&hl=en_US).
- **Canto (iPad):** chart review and notes; can update the patient photo.
- **Rover (nurse phone):**
  - Features: barcode medication administration, flowsheets, vitals, I/O, specimen collection, wound photos, patient lists.
  - Sources: [Google Play Rover](https://play.google.com/store/apps/details?id=com.epic.rover&hl=en_US&gl=US); [EpicShare: Wellstar Rover](https://www.epicshare.org/share-and-learn/wellstar-rover-smartphones) (real-time documentation up 80%); [EpicShare mobile leaders](https://www.epicshare.org/share-and-learn/epic-mobile-leaders).
- **MyChart home page, Feb 2021 redesign:**
  - Shortcuts at the top.
  - A unified, searchable Menu.
  - A personalised To-Do list.
  - A "health feed" that replaced the old Alerts section.
  - Proxy feeds colour-coded by person.
  - Sources: [OSU MyChart New Home Page PDF](https://osumedicine.com/wp-content/uploads/2021/02/MyChart-New-Home-Page-Redesign-OSU.pdf); [ECommunity PDF](https://www.ecommunity.com/sites/default/files/uploads/2020-12/MyChart-New-Home-Page-Dec2020.pdf); [Kansas "New look for MyChart"](https://www.kansashealthsystem.com/news-room/news/2021/02/new-look-for-mychart).
- **MyChart later changes:**
  - Customisable shortcuts, larger icons, dismissible scheduling suggestions ([OSU MyChart updates](https://wexnermedical.osu.edu/features/mychart/mychart-updates); [Feb 2024](https://wexnermedical.osu.edu/features/mychart/mychart-february-2024); [Aug 2024](https://wexnermedical.osu.edu/features/mychart/mychart-august-2024)).
  - "Today's Visits" and "For You" homepage sections were reported in an OSU update, date uncertain.
  - Patient-facing results show the standard range and the provider's comment.
  - Patient messages land in the clinician's "Pt Advice Request" folder ([Connect Care Patient Portal Messages](https://manual.connect-care.ca/Communications/Patient-Portal-Messages)).

---

## 3. Visual language observations
**Sourced:**
- **Toolbar colour** is set by the organisation (Advocate Aurora's is red).
- **SmartList fields:** yellow means single-select, blue means multi-select.
- **Unfiled flowsheet data:** blue lines.
- **Order validation:** red stop sign for incomplete, linked circles for complete, blue hyperlinks to missing fields.
- **BPAs:** some are bright yellow.
- **Schedule and lists:** colour-coded by status.
- **Brain:** green checkmarks.
- **In Basket:** a floppy-disk icon on Send means "saves to chart".
- **Storyboard:** icon plus hover-bubble pattern (FYI flag icon, isolation icon).
- **Navigator section buttons:** "fat or thin" density toggle.
- **Customisation:** the wrench, now "pin", is everywhere.

**Not found in public sources:** typography or font specs, an official palette, a dark mode, or density tokens. Expect a desktop-dense Windows-forms heritage: small type, gridded tables, many toolbars [Unverified, general knowledge]. I found nothing public on Hyperdrive theming.

---

## 4. UX criticisms and what Epic changed
**Criticisms:**
- **Fortune/KHN "Death by a Thousand Clicks" (2019).** About 4,000 clicks per ED shift, interfaces that "invite error", and alert fatigue of up to 7,000 alerts a day in ICUs ([Fortune](https://fortune.com/longform/medical-records/)).
- **EHR usability graded F.** Mean SUS 45.9, and each SUS point lowers the odds of burnout by 3%. Not vendor-specific ([Melnick, Mayo Clin Proc](https://www.sciencedirect.com/science/article/pii/S0025619619308365); [Becker's](https://www.beckershospitalreview.com/healthcare-information-technology/ehrs/ama-study-physicians-give-ehr-usability-an-f-rating/)).
- **In Basket load and burnout:**
  - System-generated messages are about half of volume, and above-average volume brings 40% higher odds of burnout ([Health Affairs 2019](https://www.healthaffairs.org/doi/10.1377/hlthaff.2018.05509)).
  - [JAMA Netw Open In Basket characteristics](https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2799074).
  - Signal metrics predict burnout ([Mayo Clin Proc 2024](https://www.mayoclinicproceedings.org/article/S0025-6196(24)00037-5/fulltext)).
  - [JAMIA burnout & EHR stress](https://academic.oup.com/jamia/article/30/10/1665/7227290).
- **Alert fatigue and BPA pruning:** [JAMIA Open, Singapore](https://pmc.ncbi.nlm.nih.gov/articles/PMC10393867/).
- **Clinician complaints about redesigns** (new In Basket look, order verification) ([SDN thread](https://forums.studentdoctor.net/threads/new-epic-upgrade-absolutely-sucks.1472038/)) [anecdotal].

**What Epic changed:**
- Storyboard: header to left column, hover-to-discover, fewer clicks.
- The 22.2 In Basket simplification: single Done, Follow-up, configurable QuickActions.
- Hyperdrive: web client, faster chart open, better search.
- "What's New" in-system training.
- Nurse efficiency training ([Fierce Healthcare](https://www.fiercehealthcare.com/providers/epic-launches-ehr-training-program-nurses-help-cut-clicks)).
- AI draft replies and result comments (Art).
- Removal of the pre-sign warning in favour of opening Order Composer directly.

---

## 5. Source catalog
| # | Source | Type | What it covers |
|---|---|---|---|
| 1 | [RCHSD Storyboard: Personalize & Make it Yours](https://www.rchsd.org/documents/2020/12/pediatric-grand-rounds-storyboard-tip-sheet.pdf/) | PDF tip sheet | Storyboard, hover bubbles, horizontal activity tabs, wrench, try-it exercises |
| 2 | [Hopkins Tip Nov 22 2019](https://medicine-matters.blogs.hopkinsmedicine.org/2019/11/epic-tip-of-the-week-november-222019/) / [June 26 2020](https://medicine-matters.blogs.hopkinsmedicine.org/2020/06/epic-tip-of-the-week-june-26-2020/) | Blog tips | Storyboard introduction, links to videos |
| 3 | [UIowa Storyboard](https://epicsupport.sites.uiowa.edu/epic-resources/storyboard) | Handout and video index | Videos POSS129 (3 min) and GEN500 (4 min); Beacon Storyboard |
| 4 | [UIowa Epic Resources hub](https://epicsupport.sites.uiowa.edu/epic-resources) | Index | MAR, Flowsheets, Brain, OPA, Canto/Haiku, Diagnoses, orders handouts |
| 5 | [Advocate Aurora NCLP Epic Tip Sheet](https://cme.advocateaurorahealth.org/sites/default/files/NCLP%20Epic%20Tip%20Sheet.pdf) | PDF tip sheet | Epic button, toolbar wrench, navigator customisation, Chart Review filters |
| 6 | [Methodist Physician User Settings Guide](https://www.methodistmd.org/files/epic/user-settings-lab/mlh-provider-user-settings-guides/pdfs/Inpatient%20and%20Outpatient%20Physician%20User%20Settings%20Guide.pdf) | PDF (likely screenshots) | Chart Review Quick Filters, Patient List columns, LOS buttons, report toolbars |
| 7 | [Methodist Physician Pocket Reference](https://www.methodistmd.org/files/epic/epic-general/Epic_PhysicianPocket_ReferenceGuide.pdf) | PDF | Shortcuts, search bar, preference lists |
| 8 | [Methodist Inpatient Nurse Top Efficiency](https://www.methodistmd.org/files/epic/Day-in-the-Life/Acute-Nursing-Support-Staff/Inpatient_Nurse_Top_Efficiency.pdf) | PDF | Brain timeline, filters, A/S/D, drag and drop |
| 9 | [Methodist In Basket Workflows](https://www.methodistmd.org/files/epic/Day-in-the-Life/ambulatory/Ambulatory-InBasket_Workflows_Scenarios.pdf) | PDF | In Basket scenarios, QuickActions |
| 10 | [Methodist HCC OPA Tip Sheet](https://www.methodistmd.org/files/epic/Day-in-the-Life/population-management/HCC-OPA-Tip-Sheet.pdf) | PDF | Advisory button set |
| 11 | [Salem Health In Basket 22.2](https://www.salemhealth.org/docs/default-source/common-ground-docs-and-images/epic-tip-sheet.pdf?sfvrsn=8c83d4c4_4) | PDF | In Basket redesign, Done, Follow-up, floppy icon |
| 12 | [Kansas In Basket Folders for Providers](https://www.kansashealthsystem.com/-/media/Project/Website/PDFs-for-Download/COVID19/in-basket-folders-for-providers.pdf) | PDF | Every message type and its action |
| 13 | [UMass Using & Personalizing In Basket](https://www.umassmed.edu/globalassets/office-of-undergraduate-medical-education-media/ehr-c/using-the-in-basket.pdf) | PDF | Panes, toolbars |
| 14 | [SIU Inpatient Student Exercise Booklet](https://www.siumed.edu/sites/default/files/2021-08/EPIC%20Info-Inpatient%20Student%20Training%20Exercise%20Booklet.pdf) | PDF booklet | Patient lists, Storyboard, notes, Admission Navigator |
| 15 | [UW Epic Journey Adventure Guide](https://depts.washington.edu/dbpeds/EPIC/Epic%20Journey%20Adventure%20Guide.pdf) | PDF | Navigators, rooming, routing |
| 16 | [MultiCare Inpatient Self-Guided Practice](https://static.multicare.org/photos/Education/EpicCrisisReliefContent/CrisisReliefInpatientNurseSelf-GuidedPractice.pdf) | PDF exercises | Flowsheets, Last Filed, MAR, BPA |
| 17 | [Riverside Epic Inpatient Nursing exercise book](https://otis3.riversidehealthcare.net/content/epic/inpatient/orientation%20materials/epic%20online%20exercise%20book.pdf) | PDF | Flowsheet columns, filing states |
| 18 | [Northwestern Patient Lists](https://physicianforum.nm.org/uploads/1/1/9/4/119404942/transfer-center-patient-lists.pdf) | PDF | Patient Lists three-pane layout |
| 19 | [Houston Methodist My List](https://it.houstonmethodist.org/wp-content/uploads/2020/09/Patient-List-and-Creating-a-My-List.pdf) | PDF | Patient list creation |
| 20 | [HM Ambulatory Provider Companion 2020](https://it.houstonmethodist.org/wp-content/uploads/2020/08/Sept-13-2020-Ambulatory-Provider-Companion.pdf) | PDF upgrade companion | Before/after UI changes |
| 21 | [Trinity Health Using SmartTools](https://www.trinityhealthmichigan.org/sites/default/files/hg_features/mercury_standard_layout/eb820386679ce065fea368f43146a3cd.pdf) | PDF | SmartPhrase, SmartList, F2 |
| 22 | [Alameda ECL Quick Start](https://www.alamedahealthsystem.org/wp-content/uploads/2019/10/EpicCare-Link-Quick-Start-Guide.pdf) | PDF | SmartList yellow and blue, notes |
| 23 | [YNHHS Home Health ECL orders](https://www.ynhhs.org/-/media/Files/YNHHS/covid_employees/Operational-Guidelines/Tips_Epic_CPOE_HomeHealthECLReferral.ashx) | PDF | Stop sign / linked circles validation |
| 24 | [Texas Children's Entering & Signing Orders](https://www.texaschildrens.org/sites/default/files/uploads/documents/Entering%20and%20Signing%20Order%20in%20EC%20Link_Providers_Updated%2010.9.2020.pdf) | PDF | Sign vs Pend |
| 25 | [BWH Customize Preference List](https://www.brighamandwomens.org/assets/BWH/research/pdfs/46-customize-your-preference-list-for-efficient-ordering-pi.pdf) | PDF | Preference list |
| 26 | [Lurie Med Rec tip sheet](https://www.luriepedsres.org/uploads/1/3/0/6/130660035/epic_med_rec_tip_sheet__1_.pdf) / [Akron home med review](https://www.akronchildrens.org/files/2013451/file/10-1-ambulatory-home-medication-review.pdf) | PDFs | Med rec states |
| 27 | [CHS Buffalo Problem List](https://medstaff.chsbuffalo.org/wp-content/uploads/2019/08/Problem-List-and-Principle-list-for-attendings.pdf) / [Medicine Provider Quick Guides](https://medstaff.chsbuffalo.org/wp-content/uploads/2020/11/Medicine-Provider-Quick-Guides-Epic-v5-002.pdf) | PDFs | Problem list, inpatient provider workflow |
| 28 | [Upstate Chat in Hyperspace](http://lists.upstate.edu/pipermail/epicallusers/attachments/20200205/d7c151a7/ChatSecurelyinHyperspaceUpstateTipSheet_Rev02032020.pdf) / [Eskenazi Haiku & Secure Chat](https://www.eskenazihealth.edu/docs/default-source/haiku-canto-library/haiku-and-secure-chat-quick-tips.pdf?Status=Temp&sfvrsn=f886af9d_2) | PDFs | Secure Chat, Haiku |
| 29 | [OSU MyChart New Home Page](https://osumedicine.com/wp-content/uploads/2021/02/MyChart-New-Home-Page-Redesign-OSU.pdf) / [ECommunity](https://www.ecommunity.com/sites/default/files/uploads/2020-12/MyChart-New-Home-Page-Dec2020.pdf) | PDFs | MyChart home, feed, shortcuts |
| 30 | [Connect Care Manual](https://manual.connect-care.ca/Communications/InBasket) (In Basket, Sidebar, Results routing, Problem List) | Public Epic manual (Alberta) | Many workflows |
| 31 | [open.epic Hyperdrive](https://open.epic.com/Hyperdrive) | Official | Hyperdrive architecture |
| 32 | [EpicShare Wellstar Rover](https://www.epicshare.org/share-and-learn/wellstar-rover-smartphones) / [Mayo AI responses](https://www.epicshare.org/share-and-learn/mayo-ai-message-responses) | Official articles | Rover, AI drafts |
| 33 | [Houston Methodist EDI BPA reasons](https://it.houstonmethodist.org/bpa-new-acknowledgement-reasons-for-edi/) | Article | BPA acknowledge reasons |
| 34 | [ResearchGate clopidogrel BPA figure](https://www.researchgate.net/figure/Sample-Epic-Best-Practice-Advisory-alert-for-clopidogrel-CYP2C19-implementation-BPA_fig1_260684552), [BPA in navigator](https://www.researchgate.net/figure/Best-Practice-Alert-in-navigator-of-Epic_fig3_236693035), [vital-sign comment figure](https://www.researchgate.net/figure/Example-of-a-vital-sign-comment-that-is-entered-in-the-Epic-system-C-2020-Epic-Systems_fig1_349825985) | Paper figures (screenshots) | BPA, flowsheet comment |
| 35 | YouTube: [Hyperspace overview](https://www.youtube.com/watch?v=7OgXsOa4W7s), [MAR overview](https://www.youtube.com/watch?v=AOAt0SCWT7E), [Administering on MAR](https://www.youtube.com/watch?v=euCjDO3OYNg), [InBasket and Communication](https://www.youtube.com/watch?v=TW974DyYj14), [EPIC EMR Ambulatory Series playlist](https://www.youtube.com/playlist?list=PLrtxuyt5ZTYAlYfibaPhI2ffsCyvyMol_), [Connect Care SmartLists/SmartPhrases](https://www.youtube.com/watch?v=rr3mREL95r0), [SmartTexts](https://www.youtube.com/watch?v=3XxtxTxdbFs) | Videos | Third-party or training channels; likely use Epic training-environment screens. **No timestamps or chapters found; not viewed.** |
| 36 | [Fortune/KHN](https://fortune.com/longform/medical-records/), [Melnick SUS](https://www.sciencedirect.com/science/article/pii/S0025619619308365), [Health Affairs In Basket](https://www.healthaffairs.org/doi/10.1377/hlthaff.2018.05509), [JAMA Netw Open](https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2799074) | Research and journalism | Criticism, burnout |

---

## 6. Components and patterns a healthcare design system should have
States in brackets are those evidenced or strongly implied by the sources.

1. **Patient context sidebar (Storyboard-like).** Sections: identity, safety banner, key info, details. Collapses to a horizontal header in dense views. [default / collapsed / hover-expanded / alert-present]
2. **Safety badge strip:** allergies (distinct states for "No Known Allergies" vs "Not on File"), code status, isolation. Always visible. [none / present / high-severity / unknown]
3. **FYI flag icon with hover list and click-through.** [no flags / flags present]
4. **Hover bubble / popover** with copyable values (MRN, CSN).
5. **Workspace tab bar** for several open patients and modules. [active / inactive / unsaved / closable]
6. **Activity tab bar** inside a workspace, user-reorderable. [default tab / overflow]
7. **Global search / command bar.** Activity search on type, chart search on Enter, shortcut-focused.
8. **App menu** (Epic-button equivalent) plus a pinnable toolbar. Pin/unpin replaces the wrench.
9. **Personalisation affordance (wrench / pin)** on toolbars, reports and columns.
10. **Navigator.** Left section index plus a scrolling form. Sections can be reordered or hidden and have fat/thin density. [section incomplete / complete / required]
11. **"Mark as Reviewed" section footer.** [not reviewed / reviewed by X at time]
12. **Sortable, filterable data table with Quick Filter chips** (Chart Review). [filtered / saved filter]
13. **Report pane / Snapshot card stack.**
14. **Results grid with H/L/A/C flags** and trend graphing (Synopsis). [normal / abnormal / critical]
15. **Flowsheet grid.** Time columns (add now / insert past), grouped rows, cell comments, last-filed copy, WDL shortcut. [unfiled (pending) / filed / accepted / completed]
16. **MAR row and administration form** with barcode-scan entry. [due / overdue / given / not given / held]
17. **Timeline task board (Brain).** Category filters, drag to reschedule, personal tasks, completion checkmarks. [upcoming / due / overdue / done]
18. **Patient list grid** with a directory pane (My Lists / Available Lists) and column templates.
19. **Order search with preference list and star-to-favourite.**
20. **Order composer.** Detail form, frequency/dose quick buttons (likely, unconfirmed), diagnosis association. [incomplete (stop-sign) / complete (linked) / required-field link]
21. **Sign / Pend action footer** with a pending-orders queue. [pended / signed / needs cosign]
22. **Clinical decision support alert.** Interruptive modal vs inline card; body text; suggested-order checkboxes; acknowledge-reason picker with required "Other" free text. [interruptive / passive / acknowledged / overridden]
23. **Rich note editor with smart fields:**
    - Dot-phrase picker
    - Live-data token (SmartLink)
    - Single-select field (yellow)
    - Multi-select field (blue)
    - `***` wildcard
    - F2 next-field navigation
    - Block sign while fields are unresolved
24. **Message centre (In Basket).** Typed folders with counts; message list; detail report; folder-specific action toolbar; QuickActions; Done; Follow-up; flags; "saves to chart" indicator; AI draft affordance.
25. **Secure chat panel** with patient attachment, open-chart link and priority sounds.
26. **Schedule grid** with appointment-status colour chips. [scheduled / arrived / roomed / with provider / checked out]
27. **Visit close-out (Wrap-Up):** diagnosis picker, LOS speed buttons, Sign Visit.
28. **Med rec list rows.** [taking / not taking / flag for removal / last dose]
29. **Problem list rows** with hospital-problem and principal (single-select) toggles.
30. **Mobile patterns:** chart review list (Haiku), scan-first med admin and photo capture (Rover).
31. **Patient portal home:** shortcuts row, searchable menu, To-Do cards, health feed (with proxy colour per person), results with range and comment.

## Gaps to fill next (ideally from a machine where WebFetch works)
- Open the PDFs above to confirm the screenshots.
- Exact colour keys for MAR, Brain, Schedule and abnormal flowsheet values.
- Typography and density specs.
- Hyperdrive-specific visual changes.
- Video chapter timestamps.
- The UIowa POSS129 / GEN500 Storyboard videos.
- The [Connect Care eHealth Storyboard glossary](https://ehealth.connect-care.ca/epic-systems/epic-modules/storyboard).
