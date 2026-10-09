import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { GrowthChart } from './GrowthChart';

const meta = {
  title: 'Complex/Specialty/GrowthChart',
  component: GrowthChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'GrowthChart plots a child’s measurements against WHO (birth to 24 months) or CDC (2 to 20 years) percentile lines and names the percentile band of every point. Built-in curves are rounded illustrations: production passes `curves` from the published LMS tables.',
      },
    },
  },
  argTypes: {
    standard: { control: 'inline-radio', options: [undefined, 'who', 'cdc'] },
    defaultStandard: { control: 'inline-radio', options: ['who', 'cdc'] },
    measure: { control: 'inline-radio', options: ['weight', 'bmi'] },
    sex: { control: 'inline-radio', options: ['male', 'female'] },
    rangeContext: { control: 'select', options: [undefined, 'outpatient', 'inpatient', 'ed', 'pediatric', 'pregnancy'] },
    title: { control: 'text' },
    subtitle: { control: 'text' },
    note: { control: 'text' },
  },
  args: {
    defaultStandard: 'who',
    measure: 'weight',
    subtitle: 'Noah Kim . boy . born 10/02/2024',
    points: [
      [0, 3.42, '10/02/2024'],
      [2, 5.48, '12/02/2024'],
      [4, 6.91, '02/03/2025'],
      [6, 7.84, '04/02/2025'],
      [9, 8.8, '07/02/2025'],
      [12, 9.71, '10/02/2025'],
      [18, 11.1, '04/03/2026'],
      [24, 12.36, '10/02/2026'],
    ],
    onStandardChange: fn(),
  },
} satisfies Meta<typeof GrowthChart>;

export default meta;
type Story = StoryObj<typeof meta>;

/** WHO 0-2, weight-for-age, tracking the 50th. */
export const Playground: Story = {};

/** CDC 2-20, BMI-for-age, crossing above the 95th. */
export const CdcBmiAbove95th: Story = {
  args: {
    defaultStandard: 'cdc',
    measure: 'bmi',
    subtitle: 'Mateo Silva . boy . 12 y',
    points: [
      [4, 15.9, '2018'],
      [6, 16.4, '2020'],
      [8, 18.6, '2022'],
      [10, 21.9, '2024'],
      [12, 24.8, '2026'],
    ],
  },
};

/** The earlier API (`percentiles`, `ages`, `unit`, `min`, `max`) still works; the standard switch hides for custom curves. */
export const LegacyPercentiles: Story = {
  args: {
    title: 'Length-for-age, boys (cm), WHO 0 to 24 months',
    subtitle: undefined,
    unit: 'cm',
    ages: [0, 6, 12, 18, 24],
    min: 44,
    max: 96,
    percentiles: {
      '3': [46.3, 63.6, 71.3, 77.2, 82.1],
      '50': [49.9, 67.6, 75.7, 82.3, 87.8],
      '97': [53.4, 71.6, 80.2, 87.3, 93.6],
    },
    points: [
      [0, 50.5],
      [6, 68.0],
      [12, 76.4],
      [18, 83.0],
    ],
    onStandardChange: undefined,
  },
};
