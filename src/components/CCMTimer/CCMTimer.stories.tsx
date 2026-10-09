import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { CCMTimer } from './CCMTimer';

const meta = {
  title: 'Complex/Quality and care programs/CCMTimer',
  component: CCMTimer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'CCMTimer tracks chronic care management minutes for the month toward 99490 and 99439. The session clock ticks while running (interval cleared on pause and unmount) and is not announced every second.',
      },
    },
  },
  argTypes: {
    running: { control: 'boolean' },
    minutes: { control: { type: 'number', min: 0 } },
  },
  args: {
    patient: 'Ralph Edwards',
    month: 'October 2026',
    minutes: 23,
    clock: '07:12',
    onRunningChange: fn(),
    onLogActivity: fn(),
  },
} satisfies Meta<typeof CCMTimer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const RunningAndPaused: Story = {
  render: () => (
    <div className="pv-grid">
      <CCMTimer patient="Ralph Edwards" month="October 2026" minutes={23} defaultRunning clock="07:12" />
      <CCMTimer patient="Mary Collins" month="October 2026" minutes={8} clock="00:00" />
    </div>
  ),
};

export const BothCodesEarned: Story = { args: { patient: 'Henna West', minutes: 44, clock: '00:00' } };
