import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { RANGE_CONTEXTS } from '../../clinical';
import { ResultsTrendPanel, type ResultsTrendGroup } from './ResultsTrendPanel';

const groups: ResultsTrendGroup[] = [
  {
    name: 'Basic metabolic panel',
    panel: '51990-0',
    items: [
      { code: 'Na', points: [{ date: '07/02/2026', value: 138 }, { date: '08/14/2026', value: 136 }, { date: '09/22/2026', value: 134 }, { date: '10/01/2026', value: 133 }] },
      { code: 'K', points: [{ date: '07/02/2026', value: 4.6 }, { date: '08/14/2026', value: 5.0 }, { date: '09/22/2026', value: 5.3 }, { date: '10/01/2026', value: 5.6 }] },
      { code: 'Cr', points: [{ date: '07/02/2026', value: 1.21 }, { date: '08/14/2026', value: 1.3 }, { date: '09/22/2026', value: 1.48 }, { date: '10/01/2026', value: 1.52 }] },
      { code: 'Glu', points: [{ date: '07/02/2026', value: 162 }, { date: '09/22/2026', value: 188 }, { date: '10/01/2026', value: 141 }] },
    ],
  },
  {
    name: 'Complete blood count',
    panel: '58410-2',
    items: [
      { code: 'Hgb', points: [{ date: '07/02/2026', value: 11.8 }, { date: '09/22/2026', value: 10.9 }, { date: '10/01/2026', value: 6.8 }] },
      { code: 'Plt', points: [{ date: '07/02/2026', value: 212 }, { date: '09/22/2026', value: 198 }, { date: '10/01/2026', value: 184 }] },
    ],
  },
  {
    name: 'Cardiac and thyroid',
    items: [
      { code: 'BNP', points: [{ date: '07/02/2026', value: 920 }, { date: '10/01/2026', value: 1840 }] },
      { code: 'TSH', points: [{ date: '07/02/2026', value: 2.1 }, { date: '10/01/2026', value: 3.44 }] },
      { code: 'A1c', points: [{ date: '04/10/2026', value: 7.6 }, { date: '09/22/2026', value: 8.4 }] },
    ],
  },
];

const meta = {
  title: 'Complex/Chart panels/ResultsTrendPanel',
  component: ResultsTrendPanel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'ResultsTrendPanel shows many lab results over time, grouped by LOINC panel, as a grid of sparkline tiles or as a date-by-test table. Each value is formatted and flagged by the shared `fmt` rules; a lab range sent in `over` wins.',
      },
    },
  },
  argTypes: {
    defaultView: { control: 'inline-radio', options: ['grid', 'table'] },
    view: { control: 'inline-radio', options: [undefined, 'grid', 'table'] },
    rangeContext: { control: 'select', options: [undefined, ...RANGE_CONTEXTS] },
  },
  args: { subtitle: 'Ralph Edwards . last 6 months', groups, onViewChange: fn() },
} satisfies Meta<typeof ResultsTrendPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: (args) => (
    <div className="co-dt">
      <ResultsTrendPanel {...args} />
      <ResultsTrendPanel title="Same data, table view" defaultView="table" groups={groups} />
      <ResultsTrendPanel title="Oncology: no results" subtitle="Last 30 days" groups={[]} />
    </div>
  ),
};

export const TableView: Story = { args: { title: 'Same data, table view', defaultView: 'table' } };

export const LastThreeDraws: Story = { args: { title: 'Last three draws', defaultView: 'table', maxColumns: 3 } };

export const Empty: Story = { args: { title: 'Oncology: no results', subtitle: 'Last 30 days', groups: [] } };
