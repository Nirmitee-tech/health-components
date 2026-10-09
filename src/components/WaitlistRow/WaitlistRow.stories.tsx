import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { WaitlistRow } from './WaitlistRow';

const meta = {
  title: 'Complex/Scheduling/WaitlistRow',
  component: WaitlistRow,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'WaitlistRow is one waitlisted patient with wanted window, priority, a matched opening and Offer Slot. Offer Slot is enabled only when an opening matches.',
      },
    },
  },
  args: {
    item: {
      patient: 'Kristin Watson',
      type: 'Annual Wellness',
      provider: 'Any provider',
      window: 'mornings this week',
      since: '09/30',
      match: 'Thu 10/09 9:40 AM',
    },
    onOffer: fn(),
    onText: fn(),
    onEdit: fn(),
    onRemove: fn(),
  },
} satisfies Meta<typeof WaitlistRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Waitlist: Story = {
  render: () => (
    <div className="co-dt">
      <WaitlistRow
        item={{ patient: 'Kristin Watson', type: 'Annual Wellness', provider: 'Any provider', window: 'mornings this week', since: '09/30', match: 'Thu 10/09 9:40 AM' }}
      />
      <WaitlistRow
        item={{ patient: 'Jacob Jones', type: 'Sick visit', provider: 'Olivia Grant MD', window: 'today', since: '8:05 AM', priority: 'Same day' }}
      />
    </div>
  ),
};

export const NoMatch: Story = {
  args: { item: { patient: 'Jacob Jones', type: 'Sick visit', provider: 'Olivia Grant MD', window: 'today', since: '8:05 AM', priority: 'Same day' } },
};
