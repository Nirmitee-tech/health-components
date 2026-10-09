import type { Meta, StoryObj } from '@storybook/react-vite';
import { RPMReadingChart } from './RPMReadingChart';

const meta = {
  title: 'Complex/Quality and care programs/RPMReadingChart',
  component: RPMReadingChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'RPMReadingChart shows remote-monitoring readings against an alert line, reading days toward 99454 and interactive minutes toward 99457. Bars use the chart tokens (red over the alert line, amber under the low line, green in range); the plot is `role="img"` with every reading in its name, plus a visually hidden table and summary.',
      },
    },
  },
  argTypes: {
    readings: { control: 'object' },
  },
  args: {
    title: 'Remote BP monitoring',
    device: 'Omron cuff . Ralph Edwards . October',
    metric: 'Systolic (mmHg), last 7 readings',
    readings: [
      ['10/03', 138],
      ['10/04', 142],
      ['10/05', 131],
      ['10/06', 149],
      ['10/07', 136],
      ['10/08', 144],
      ['10/09', 129],
    ],
    high: 140,
    max: 170,
    days: 9,
    minutes: 14,
    alert: '3 readings over 140 this week. Nurse call due.',
  },
} satisfies Meta<typeof RPMReadingChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const BillingMet: Story = {
  args: {
    title: 'Remote glucose monitoring',
    device: 'Dexcom G7 . Henna West . October',
    metric: 'Fasting glucose (mg/dL), last 7 days',
    readings: [
      ['10/03', 112],
      ['10/04', 98],
      ['10/05', 68],
      ['10/06', 104],
      ['10/07', 121],
      ['10/08', 95],
      ['10/09', 101],
    ],
    high: 180,
    low: 70,
    max: 200,
    days: 18,
    minutes: 22,
    alert: undefined,
  },
};
