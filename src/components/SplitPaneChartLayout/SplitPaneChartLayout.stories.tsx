import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Card } from '../Card/Card';
import { ClinicalDecisionSupportCard } from '../ClinicalDecisionSupportCard/ClinicalDecisionSupportCard';
import { SplitPaneChartLayout } from './SplitPaneChartLayout';

const nav = () => (
  <ul className="co-list">
    {['Summary', 'Problems', 'Medications', 'Results', 'Notes', 'Orders', 'Imaging', 'Immunizations'].map((s, i) => (
      <li key={s} className="co-li" style={i === 4 ? { background: 'var(--co-primary-soft)' } : undefined} aria-current={i === 4 ? 'page' : undefined}>
        {s}
      </li>
    ))}
  </ul>
);

const note = () => (
  <Card title="Progress note . Cardiology follow-up" subtitle="Priya Shah MD . 10/09/2026">
    <p>74 y man with HFrEF, EF 30 %, here for follow-up. Weight up 2 kg in a week.</p>
    <p>Plan: continue sacubitril/valsartan; potassium trend in the context panel.</p>
  </Card>
);

const ctx = () => (
  <div className="co-dt">
    <ClinicalDecisionSupportCard
      card={{
        indicator: 'warning',
        summary: 'Potassium rising on spironolactone',
        source: { label: 'CareOS HF pathway' },
        values: [{ code: 'K', value: 5.6 }],
        suggestions: [{ label: 'Order BMP in 1 week', isRecommended: true }],
        overrideReasons: [{ code: 'monitored', display: 'Already monitored' }],
      }}
    />
  </div>
);

const meta = {
  title: 'Complex/Chart panels/SplitPaneChartLayout',
  component: SplitPaneChartLayout,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'SplitPaneChartLayout is the three-pane chart workspace: a resizable left section nav, the note in the middle and a resizable right context panel that can close. The dividers follow the WAI-ARIA window splitter pattern: drag them, or focus one and use Left and Right (Shift for bigger steps), Home and End, and Enter to collapse and restore.',
      },
    },
  },
  args: {
    nav: nav(),
    context: ctx(),
    rightTitle: 'Decision support',
    height: 400,
    children: note(),
    onLeftWidthChange: fn(),
    onRightWidthChange: fn(),
    onLeftCollapsedChange: fn(),
    onRightOpenChange: fn(),
  },
} satisfies Meta<typeof SplitPaneChartLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: (args) => (
    <div className="co-dt">
      <SplitPaneChartLayout {...args} />
      <SplitPaneChartLayout nav={nav()} defaultLeftCollapsed defaultRightOpen={false} height={260}>
        {note()}
      </SplitPaneChartLayout>
    </div>
  ),
};

export const Collapsed: Story = {
  args: { defaultLeftCollapsed: true, defaultRightOpen: false, height: 260, context: undefined, rightTitle: undefined },
};

export const WideContext: Story = { args: { leftWidth: 180, rightWidth: 420 } };
