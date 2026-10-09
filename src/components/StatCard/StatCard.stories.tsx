import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { StatCard } from './StatCard';

const meta = {
  title: 'Basic/Data display/StatCard',
  component: StatCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'StatCard shows one number with its label and context, and can act as a filter button (aria-pressed). Trend direction is an arrow as well as a colour.',
      },
    },
  },
  argTypes: {
    trendDir: { control: 'inline-radio', options: ['up', 'down'] },
    trendGood: { control: 'select', options: [undefined, true, false] },
    value: { control: 'text' },
    sub: { control: 'text' },
  },
  args: { label: 'Denial Rate', value: '6.2%', trend: '1.4 pts', trendGood: false, sub: 'vs September' },
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: () => (
    <div className="pv-grid">
      <StatCard label="Claims to Work" value="42" sub="9 over 30 days" selected onClick={() => {}} />
      <StatCard label="Denial Rate" value="6.2%" trend="1.4 pts" trendGood={false} sub="vs September" onClick={() => {}} />
      <StatCard label="Clean Claim Rate" value="94%" trend="2 pts" trendGood sub="last 30 days" />
      <StatCard label="Prior Auths Pending" value="" loading />
      <StatCard label="PA Units Used" value="12 of 20" meter={{ value: 12, max: 20 }} />
    </div>
  ),
};

export const AsFilterButton: Story = {
  args: { label: 'Claims to Work', value: '42', sub: '9 over 30 days', trend: undefined, selected: true, onClick: fn() },
};

export const TrendDown: Story = { args: { label: 'Days in A/R', value: '31', trend: '4 days', trendDir: 'down', trendGood: true, sub: 'vs Q2' } };

export const Loading: Story = { args: { label: 'Prior Auths Pending', value: '', loading: true, trend: undefined, sub: undefined } };

export const WithMeter: Story = {
  args: { label: 'PA Units Used', value: '12 of 20', meter: { value: 12, max: 20 }, trend: undefined, sub: 'PA-2026-11873' },
};
