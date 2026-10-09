import type { Meta, StoryObj } from '@storybook/react-vite';
import { DonutChart } from './DonutChart';

const meta = {
  title: 'Basic/Charts/DonutChart',
  component: DonutChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'DonutChart shows how a total splits into up to five parts, with the total in the middle and a value legend. Plain SVG, token colours only, the ring shrinks to fit narrow containers. The ring is `role="img"` with every value in its name; the legend is a list with values and percentages.',
      },
    },
  },
  argTypes: { centerValue: { control: 'text' } },
  args: {
    title: 'Claims this month by status',
    centerLabel: 'claims',
    data: [
      { label: 'Paid', value: 412, color: 'var(--co-success)' },
      { label: 'Pending', value: 96, color: 'var(--co-warning)' },
      { label: 'Denied', value: 31, color: 'var(--co-danger)' },
      { label: 'In review', value: 58, color: 'var(--co-primary)' },
    ],
  },
} satisfies Meta<typeof DonutChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const DefaultPalette: Story = {
  args: {
    title: 'Visits by type, this week',
    centerLabel: 'visits',
    data: [
      { label: 'Follow-Up', value: 142 },
      { label: 'New Patient', value: 38 },
      { label: 'Telehealth', value: 77 },
      { label: 'Annual Wellness', value: 25 },
      { label: 'Procedure', value: 12 },
    ],
  },
};

export const CustomCenter: Story = { args: { centerValue: '69%', centerLabel: 'paid', size: 180 } };
