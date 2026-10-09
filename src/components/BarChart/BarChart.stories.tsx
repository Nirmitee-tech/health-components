import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarChart, type BarChartDatum } from './BarChart';

const bp: BarChartDatum[] = (
  [
    ['Mon', 128],
    ['Tue', 134],
    ['Wed', 151],
    ['Thu', 139],
    ['Fri', 146],
    ['Sat', 122],
    ['Sun', 131],
  ] as const
).map(([label, value]) => ({ label, value, tone: value >= 140 ? 'hi' : 'ok' }));

const denials: BarChartDatum[] = [
  { label: 'Aetna', value: 18 },
  { label: 'BCBS', value: 11 },
  { label: 'UHC', value: 24 },
  { label: 'Cigna', value: 7 },
  { label: 'Medicare', value: 5 },
];

const meta = {
  title: 'Basic/Charts/BarChart',
  component: BarChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'BarChart shows values per category or day with optional threshold line and out-of-range colours, for dashboards and remote monitoring. Plain HTML and CSS, token colours only, fills its container width. The plot is `role="img"` with every value in its name, and a visually hidden table repeats the data.',
      },
    },
  },
  args: {
    title: 'Systolic blood pressure, last 7 days (mmHg)',
    data: bp,
    max: 170,
    threshold: 140,
    thresholdLabel: '140 limit',
    unit: ' mmHg',
    legend: [
      { label: 'In range', tone: 'ok' },
      { label: 'High', tone: 'hi' },
    ],
  },
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: (args) => (
    <div className="pv-grid">
      <BarChart {...args} />
      <BarChart title="Denials by payer, September" data={denials} />
    </div>
  ),
};

export const Plain: Story = {
  args: { title: 'Denials by payer, September', data: denials, max: undefined, threshold: undefined, legend: undefined, unit: '' },
};

export const Tall: Story = { args: { height: 220 } };
