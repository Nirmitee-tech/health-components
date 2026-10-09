import type { Meta, StoryObj } from '@storybook/react-vite';
import { Timeline } from './Timeline';

const meta = {
  title: 'Basic/Data display/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Timeline lists the steps of a prior authorization, referral or claim in order, with done, current, pending and failed states. Also exported as `PATimeline`.',
      },
    },
  },
  args: {
    items: [
      { title: 'Request Submitted', time: '10/01/2026 9:40 AM', by: 'Sam Patel', status: 'done', tag: 'Submitted' },
      {
        title: 'Payer Asked for Clinical Notes',
        time: '10/03/2026 2:15 PM',
        by: 'Aetna (Availity 278)',
        status: 'done',
        tag: 'Pended',
        body: 'Upload last 2 visit notes and the MRI report.',
      },
      { title: 'Records Sent', time: '10/04/2026 11:02 AM', by: 'Sam Patel', status: 'done' },
      { title: 'In Review', time: 'Expected by 10/11/2026', status: 'current', tag: 'In Review' },
      { title: 'Decision', status: 'pending' },
    ],
  },
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Denied: Story = {
  args: {
    items: [
      { title: 'Claim Submitted', time: '09/22/2026', by: 'Billing', status: 'done', tag: 'Submitted', kind: 'claim' },
      { title: 'Accepted by Clearinghouse', time: '09/23/2026', by: 'Availity 277CA', status: 'done', tag: 'Accepted', kind: 'claim' },
      {
        title: 'Denied by Payer',
        time: '10/02/2026',
        by: 'UnitedHealthcare 835',
        status: 'failed',
        tag: 'Denied',
        kind: 'claim',
        body: 'CARC 197: Precertification/authorization absent.',
      },
      { title: 'Appeal', status: 'pending' },
    ],
  },
};
