import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import { useState, type ReactNode } from 'react';
import { renderStory, ShadowPreview, ThemeSelect, usePreviewTheme, type StoriesModule } from '@site/src/components/docs';
import { DemoNavigation, ChartNavigation } from '@lib/internal/docs/DemoNavigation';
import * as PatientBanner from '@lib/components/PatientBanner/PatientBanner.stories';
import * as CodeStatusBanner from '@lib/components/CodeStatusBanner/CodeStatusBanner.stories';
import * as VitalsPanel from '@lib/components/VitalsPanel/VitalsPanel.stories';
import * as AllergyList from '@lib/components/AllergyList/AllergyList.stories';
import * as MedicationList from '@lib/components/MedicationList/MedicationList.stories';
import * as ProblemList from '@lib/components/ProblemList/ProblemList.stories';
import * as LabResultTable from '@lib/components/LabResultTable/LabResultTable.stories';
import * as Calendar from '@lib/components/Calendar/Calendar.stories';
import * as KPIGrid from '@lib/components/KPIGrid/KPIGrid.stories';
import * as DataTable from '@lib/components/DataTable/DataTable.stories';
import * as ClaimForm from '@lib/components/ClaimForm/ClaimForm.stories';
import * as InboxList from '@lib/components/InboxList/InboxList.stories';

const s = (mod: unknown, name: string): ReactNode => renderStory(mod as StoriesModule, name);

type Screen = 'chart' | 'schedule' | 'billing' | 'inbox';
const SCREENS: { id: Screen; label: string; note: string }[] = [
  { id: 'chart', label: 'Patient chart', note: 'PatientBanner, CodeStatusBanner, SectionNav, VitalsPanel, AllergyList, MedicationList, ProblemList, LabResultTable' },
  { id: 'schedule', label: 'Schedule', note: 'Calendar with Day, Week and Month views, AppointmentChip, CalendarCell' },
  { id: 'billing', label: 'Billing', note: 'KPIGrid filters, DataTable with bulk actions and row menus, ClaimForm' },
  { id: 'inbox', label: 'Clinical inbox', note: 'InboxList with critical-value alert, tabs and worklist actions' },
];

function ChartScreen() {
  return (
    <>
      {s(PatientBanner, 'DoNotResuscitate')}
      {s(CodeStatusBanner, 'Playground')}
      <ChartNavigation>
        <section data-chart-section="Summary" aria-label="Chart summary"><p className="co-muted">Synthetic patient chart. Example values and actions are for interface evaluation.</p></section>
        <section data-chart-section="Vitals">{s(VitalsPanel, 'AdultWithCriticals')}</section>
        <div className="demo-grid2">
          <section data-chart-section="Allergies">{s(AllergyList, 'Playground')}</section>
          <section data-chart-section="Problems">{s(ProblemList, 'Playground')}</section>
        </div>
        <section data-chart-section="Medications">{s(MedicationList, 'Playground')}</section>
        <section data-chart-section="Lab results">{s(LabResultTable, 'Playground')}</section>
      </ChartNavigation>
    </>
  );
}

function Screen({ id }: { id: Screen }) {
  switch (id) {
    case 'chart':
      return <ChartScreen />;
    case 'schedule':
      return <>{s(Calendar, 'Schedule')}</>;
    case 'billing':
      return (
        <>
          {s(KPIGrid, 'Filter')}
          {s(DataTable, 'Showcase')}
          {s(ClaimForm, 'Showcase')}
        </>
      );
    case 'inbox':
      return <>{s(InboxList, 'Showcase')}</>;
  }
}

function Demo() {
  const { theme } = usePreviewTheme();
  const [screen, setScreen] = useState<Screen>('chart');
  const current = SCREENS.find((x) => x.id === screen)!;
  return (
    <div className="demo-wrap">
      <div className="demo-bar">
        <div className="demo-tabs" role="tablist" aria-label="Demo screen">
          {SCREENS.map((x) => (
            <button
              key={x.id}
              type="button"
              role="tab"
              aria-selected={x.id === screen}
              className={x.id === screen ? 'is-on' : undefined}
              onClick={() => setScreen(x.id)}
            >
              {x.label}
            </button>
          ))}
        </div>
        <ThemeSelect />
      </div>
      <p className="demo-note">
        {current.label} · Synthetic examples. Local interactions reset when you change workspaces.
      </p>
      <ShadowPreview theme={theme} className="demo-canvas">
        <DemoNavigation screen={current.label as 'Patient chart' | 'Schedule' | 'Billing' | 'Clinical inbox'} onScreenChange={(label) => setScreen(SCREENS.find((item) => item.label === label)!.id)}>
          <Screen id={screen} />
        </DemoNavigation>
      </ShadowPreview>
    </div>
  );
}

export default function DemoPage() {
  return (
    <Layout title="Live demo" description="A full EHR screen built only from CareOS components, in every theme.">
      <main className="container container--fluid demo-page">
        <h1>Live demo</h1>
        <p>
          Explore a synthetic patient chart, schedule, billing workspace and inbox. Change themes and try the components.
          Examples simulate workflows and do not save patient data. See every component under <Link to="/docs/components/">Components</Link>.
        </p>
        <Demo />
      </main>
    </Layout>
  );
}
