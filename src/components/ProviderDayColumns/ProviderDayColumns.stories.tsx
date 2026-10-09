import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ProviderDayColumns, type ProviderColumn } from './ProviderDayColumns';

const times = ['8:00 AM', '8:20 AM', '8:40 AM', '9:00 AM', '9:20 AM'];

const providers: ProviderColumn[] = [
  {
    name: 'James Bell MD',
    appts: {
      '8:00 AM': { time: '8:00', patient: 'Henna West', type: 'Follow-Up', status: 'Completed', paid: true },
      '8:40 AM': { time: '8:40', patient: 'Ralph Edwards', type: 'New Patient', status: 'Arrived' },
    },
  },
  {
    name: 'Mandy Harley LCSW',
    appts: { '8:00 AM': { time: '8:00', patient: 'Nora Scott', type: 'Therapy 50', status: 'In Room', telehealth: true } },
    blocks: { '9:00 AM': 'Supervision' },
  },
  {
    name: 'Tom Reyes DPT',
    appts: { '8:20 AM': { time: '8:20', patient: 'Leslie Alexander', type: 'PT Visit', status: 'Confirmed' } },
    blocks: { '9:20 AM': 'Lunch' },
  },
];

const meta = {
  title: 'Complex/Scheduling/ProviderDayColumns',
  component: ProviderDayColumns,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'ProviderDayColumns is the multi-provider day view: one column per provider, time rows, chips, blocks and free slots. Free slots show "+ Book" on hover and focus.',
      },
    },
  },
  args: { times, providers, onBook: fn() },
} satisfies Meta<typeof ProviderDayColumns>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const OpenDay: Story = {
  args: {
    times: ['1:00 PM', '1:20 PM', '1:40 PM'],
    providers: [{ name: 'Olivia Grant MD' }, { name: 'James Bell MD', blocks: { '1:00 PM': 'Hospital rounds' } }],
  },
};
