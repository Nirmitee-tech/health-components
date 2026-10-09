import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { CheckInStepper } from './CheckInStepper';

const meta = {
  title: 'Complex/Scheduling/CheckInStepper',
  component: CheckInStepper,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'CheckInStepper is the front desk check-in checklist: steps, issues per step and Complete Check-In. Complete Check-In stays disabled while any step has an issue.',
      },
    },
  },
  args: {
    patient: 'Henna West',
    appt: 'Thu 10/09 9:20 AM . Follow-Up . James Bell MD',
    onItemAction: fn(),
    onComplete: fn(),
  },
} satisfies Meta<typeof CheckInStepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    current: 2,
    issues: [2],
    items: [
      { label: 'Demographics confirmed', detail: 'Address unchanged', ok: true },
      { label: 'Insurance', detail: 'Aetna returned AAA 72: invalid member ID', ok: false, action: 'Fix Coverage' },
      { label: 'Forms', detail: '2 of 2 signed in the portal', ok: true },
      { label: 'Copay', detail: '$25 due', ok: false, action: 'Collect' },
    ],
  },
};

export const JustArrived: Story = { args: { current: 0 } };

export const Complete: Story = {
  args: {
    current: 5,
    done: true,
    items: [
      { label: 'Demographics confirmed', detail: 'Address unchanged', ok: true },
      { label: 'Insurance', detail: 'Aetna PPO active, copay $25', ok: true },
      { label: 'Forms', detail: '2 of 2 signed in the portal', ok: true },
      { label: 'Copay', detail: '$25 collected by card on file', ok: true },
    ],
  },
};
