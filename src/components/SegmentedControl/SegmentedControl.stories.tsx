import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SegmentedControl } from './SegmentedControl';

const meta = {
  title: 'Basic/Selection/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'SegmentedControl switches between two to five views or values in one compact bar. It is a radiogroup: arrow keys move the selection.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    label: { control: 'text' },
  },
  args: { label: 'Calendar view', options: ['Day', 'Week', 'Month'], onChange: fn() },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { defaultValue: 'Week' } };

export const Showcase: Story = {
  render: () => (
    <div className="co-row">
      <SegmentedControl
        label="Visits"
        options={[
          { value: 'up', label: 'Upcoming', count: 2 },
          { value: 'past', label: 'Past' },
        ]}
      />
      <SegmentedControl label="Calendar view" defaultValue="Week" options={['Day', 'Week', 'Month']} />
      <SegmentedControl label="Density" size="sm" options={['Comfortable', 'Compact']} />
    </div>
  ),
};

export const Small: Story = { args: { label: 'Density', size: 'sm', options: ['Comfortable', 'Compact'] } };

export const WithDisabledOption: Story = {
  args: {
    label: 'Claim queue',
    options: [
      { value: 'open', label: 'Open', count: 14 },
      { value: 'denied', label: 'Denied', count: 3 },
      { value: 'archived', label: 'Archived', disabled: true },
    ],
  },
};
