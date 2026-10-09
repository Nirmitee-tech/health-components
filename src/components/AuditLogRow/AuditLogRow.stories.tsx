import type { Meta, StoryObj } from '@storybook/react-vite';
import { AuditLogRow } from './AuditLogRow';

const meta = {
  title: 'Complex/Access/AuditLogRow',
  component: AuditLogRow,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'AuditLogRow is one audit entry: time, action, user and role, what changed, patient, IP and reason, with old and new values. Every action shows an icon and a word; audit rows are never editable.',
      },
    },
  },
  argTypes: {
    event: { control: 'object' },
  },
  args: {
    event: {
      time: '10/09 10:42:13',
      action: 'btg',
      user: 'Ana Ortiz MD',
      role: 'Provider',
      what: 'opened a restricted chart',
      patient: 'Nora Scott',
      ip: '10.2.4.18',
      reason: 'Emergency treatment',
    },
  },
} satisfies Meta<typeof AuditLogRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Log: Story = {
  render: (args) => (
    <div className="co-list">
      <AuditLogRow event={args.event} />
      <AuditLogRow event={{ time: '10/09 10:31:02', action: 'edit', user: 'Jordan Lee', role: 'Practice Admin', what: 'changed the practice style', change: 'classic -> sidebar' }} />
      <AuditLogRow event={{ time: '10/09 09:58:40', action: 'export', user: 'Sam Patel', role: 'Biller', what: 'exported 248 claims to CSV', ip: '10.2.4.22' }} />
      <AuditLogRow event={{ time: '10/09 09:12:00', action: 'sign', user: 'James Bell MD', role: 'Provider', what: 'signed visit note', patient: 'Henna West' }} />
    </div>
  ),
};

export const Actions: Story = {
  render: () => (
    <div className="co-list">
      <AuditLogRow event={{ time: '10/09 08:01:44', action: 'login', user: 'Lisa Chen RN', role: 'Nurse', what: 'signed in', ip: '10.2.4.31' }} />
      <AuditLogRow event={{ time: '10/09 08:20:05', action: 'view', user: 'Lisa Chen RN', role: 'Nurse', what: 'viewed medication list', patient: 'Ralph Edwards' }} />
      <AuditLogRow event={{ time: '10/09 08:47:19', action: 'delete', user: 'Jordan Lee', role: 'Practice Admin', what: 'deleted a duplicate appointment', patient: 'Mary Collins' }} />
    </div>
  ),
};
