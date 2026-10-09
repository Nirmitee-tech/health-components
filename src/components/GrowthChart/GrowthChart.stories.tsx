import type { Meta, StoryObj } from '@storybook/react-vite';
import { GrowthChart } from './GrowthChart';

const whoGirlsWeight = {
  '3': [2.4, 6.1, 7.6, 8.7, 9.6, 11.2],
  '50': [3.2, 7.3, 8.9, 10.2, 11.5, 13.9],
  '97': [4.2, 8.9, 10.9, 12.6, 14.1, 17.0],
};

const meta = {
  title: 'Complex/Clinical/GrowthChart',
  component: GrowthChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "GrowthChart plots a child's measurements over WHO or CDC percentile curves. The 50th percentile is solid, the others dashed; the patient line is the primary colour. Screen readers get the title, every measurement and the percentile curves.",
      },
    },
  },
  argTypes: { title: { control: 'text' }, note: { control: 'text' }, unit: { control: 'text' } },
  args: {
    title: 'Weight-for-age, girls (kg), WHO 0 to 36 months',
    unit: 'kg',
    points: [
      [0, 3.3],
      [6, 7.6],
      [12, 9.4],
      [18, 10.6],
      [24, 11.6],
    ],
    percentiles: whoGirlsWeight,
    note: 'Last: 11.6 kg at 24 months, about the 50th percentile.',
  },
} satisfies Meta<typeof GrowthChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const FalteringGrowth: Story = {
  args: {
    title: 'Weight-for-age, girls (kg), WHO 0 to 36 months',
    points: [
      [0, 3.2],
      [6, 6.9],
      [12, 7.9],
      [18, 8.4],
    ],
    note: 'Crossed down from the 50th to below the 3rd percentile since 6 months. Consider a feeding assessment.',
  },
};

export const LengthForAge: Story = {
  args: {
    title: 'Length-for-age, boys (cm), WHO 0 to 24 months',
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
    note: undefined,
  },
};
