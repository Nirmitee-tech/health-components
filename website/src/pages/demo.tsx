import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import { useState, type ReactNode } from 'react';
import { renderStory, ShadowPreview, ThemeSelect, usePreviewTheme, type StoriesModule } from '@site/src/components/docs';
import * as TopBar from '@lib/components/TopBar/TopBar.stories';
import * as PatientBanner from '@lib/components/PatientBanner/PatientBanner.stories';
import * as CodeStatusBanner from '@lib/components/CodeStatusBanner/CodeStatusBanner.stories';
import * as SectionNav from '@lib/components/SectionNav/SectionNav.stories';
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
      <div className="demo-chart">
        <aside>{s(SectionNav, 'Playground')}</aside>
        <div className="demo-col">
          {s(VitalsPanel, 'AdultWithCriticals')}
          <div className="demo-grid2">
            {s(AllergyList, 'Playground')}
            {s(ProblemList, 'Playground')}
          </div>
          {s(MedicationList, 'Playground')}
          {s(LabResultTable, 'Playground')}
        </div>
      </div>
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
        Built from: {current.note}. Everything below is the real <code>health-components</code> package, interactive.
      </p>
      <ShadowPreview theme={theme} className="demo-canvas">
        {s(TopBar, 'Playground')}
        <Screen id={screen} />
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
          Screens composed only from CareOS components. Switch the theme, click through tabs, sort tables, open menus. Every
          piece is documented under <Link to="/docs/components/">Components</Link>.
        </p>
        <Demo />
      </main>
    </Layout>
  );
}
