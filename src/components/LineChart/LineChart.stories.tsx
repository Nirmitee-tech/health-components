import type { Meta, StoryObj } from '@storybook/react-vite';
import { LineChart } from './LineChart';

const meta = {
  title: 'Basic/Charts/LineChart',
  component: LineChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'LineChart shows a trend over time for up to two series, with an optional target band. Plain SVG that scales with its container, token colours only; the second series is dashed so colour is not the only cue. `role="img"` with the values in its name plus a visually hidden data table.',
      },
    },
  },
  args: {
    title: 'Hemoglobin A1c (%)',
    labels: ['Oct 25', 'Jan', 'Apr', 'Jul', 'Oct 26'],
    series: [{ name: 'A1c', values: [8.4, 7.9, 7.4, 7.1, 6.8] }],
    min: 4,
    max: 10,
    band: [4, 7],
  },
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const visits = {
  title: 'Visits per week',
  labels: ['W36', 'W37', 'W38', 'W39', 'W40', 'W41'],
  series: [
    { name: 'In person', values: [212, 226, 219, 240, 231, 248] },
    { name: 'Telehealth', values: [64, 58, 71, 69, 80, 77] },
  ],
};

export const Showcase: Story = {
  render: (args) => (
    <div className="pv-grid">
      <LineChart {...args} />
      <LineChart {...visits} />
    </div>
  ),
};

export const TwoSeries: Story = { args: { ...visits, min: undefined, max: undefined, band: undefined } };

export const TokenColour: Story = {
  args: {
    title: 'Weight (kg)',
    labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    series: [{ name: 'Weight', values: [92.4, 91.8, 90.1, 89.6, 88.9], color: 'var(--co-success)' }],
    min: 80,
    max: 95,
    band: undefined,
  },
};
