import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { BarChart } from '../BarChart/BarChart';
import { Button } from '../Button/Button';
import { ChartCard } from './ChartCard';

const denials = [
  { label: 'Aetna', value: 18 },
  { label: 'BCBS', value: 11 },
  { label: 'UHC', value: 24 },
  { label: 'Cigna', value: 7 },
];

const meta = {
  title: 'Complex/Dashboards/ChartCard',
  component: ChartCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'ChartCard wraps any chart in a Card with a title, period switch, loading and empty states, and a source line. Every number should trace to a saved report: name it in `source`.',
      },
    },
  },
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    empty: { control: 'text' },
    source: { control: 'text' },
  },
  args: {
    title: 'Denials by payer',
    periods: ['7d', '30d', '90d'],
    defaultPeriod: '30d',
    source: 'Source: posted ERA (835) files, sample data, 10/09/2026',
    onPeriod: fn(),
    children: <BarChart data={denials} title="Denials by payer, last 30 days" />,
  },
} satisfies Meta<typeof ChartCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: () => (
    <div className="pv-grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))' }}>
      <ChartCard
        title="Denials by payer"
        periods={['7d', '30d', '90d']}
        defaultPeriod="30d"
        source="Source: posted ERA (835) files, sample data, 10/09/2026"
      >
        <BarChart data={denials} />
      </ChartCard>
      <ChartCard title="Payer mix" loading />
      <ChartCard title="No-show rate" empty="No visits in this period." />
    </div>
  ),
};

export const Loading: Story = { args: { title: 'Payer mix', loading: true, periods: undefined } };

export const EmptyPeriod: Story = { args: { title: 'No-show rate', empty: 'No visits in this period.' } };

export const WithActions: Story = {
  args: {
    actions: (
      <Button size="sm" iconLeft="download">
        Export
      </Button>
    ),
  },
};
