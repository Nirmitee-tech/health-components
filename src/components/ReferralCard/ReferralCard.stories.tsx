import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { ReferralCard, type ReferralData } from './ReferralCard';

const cardiology: ReferralData = {
  specialty: 'Cardiology',
  patient: 'Ralph Edwards',
  to: 'Priya Shah MD, Lakeview Heart',
  status: 'Scheduled',
  reason: 'Exertional chest pain, abnormal ECG',
  urgency: 'Within 2 weeks',
  auth: 'Approved, PA-2026-11911',
  from: 'James Bell MD',
  timeline: [
    { title: 'Sent by Direct message', time: '10/02', status: 'done' },
    { title: 'Received by Lakeview Heart', time: '10/02', status: 'done' },
    { title: 'Scheduled for 10/14 9:00 AM', time: '10/03', status: 'current' },
    { title: 'Consult note back', status: 'pending' },
  ],
};

const meta = {
  title: 'Complex/Work queues/ReferralCard',
  component: ReferralCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'ReferralCard summarizes an outgoing or incoming referral with status, reason, urgency, authorization and its status timeline. Close the loop: track it until Report Back.',
      },
    },
  },
  argTypes: {
    referral: { control: 'object' },
    actions: { control: false },
  },
  args: { referral: cardiology },
} satisfies Meta<typeof ReferralCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithTimeline: Story = {
  args: { referral: cardiology, actions: <Button size="sm">Send Records</Button> },
};

export const Statuses: Story = {
  render: () => (
    <div className="pv-grid">
      <ReferralCard
        referral={{
          specialty: 'Orthopedics',
          patient: 'Henna West',
          to: 'Mark Ruiz MD, North Shore Ortho',
          status: 'Needs Info',
          reason: 'Right knee pain, 6 months, failed PT',
          urgency: 'Routine',
          from: 'James Bell MD',
        }}
        actions={<Button size="sm">Attach MRI Report</Button>}
      />
      <ReferralCard
        referral={{
          specialty: 'Dermatology',
          patient: 'Nora Scott',
          to: 'Elena Park MD, Skin Health',
          status: 'Declined',
          reason: 'Changing mole, left shoulder',
          urgency: 'Within 4 weeks',
          auth: 'Pending',
          from: 'Olivia Grant NP',
        }}
      />
    </div>
  ),
};
