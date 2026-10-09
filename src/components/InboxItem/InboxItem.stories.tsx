import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { InboxItem, type InboxItemData } from './InboxItem';

const critical: InboxItemData = {
  kind: 'result',
  patient: 'Ralph Edwards',
  title: 'Potassium 6.1 mmol/L (critical)',
  from: 'Quest . BMP',
  received: '08:42',
  priority: 'Critical',
  unread: true,
  actions: ['Acknowledge', 'Open Chart'],
};

const meta = {
  title: 'Complex/Work queues/InboxItem',
  component: InboxItem,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'InboxItem is one inbox card for a result, refill, message, co-sign, imaging or fax, with priority and inline actions. Unread items are bold with a primary edge; critical items are red. The first action is primary.',
      },
    },
  },
  argTypes: {
    item: { control: 'object' },
  },
  args: { item: critical, onAction: fn() },
} satisfies Meta<typeof InboxItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Inbox: Story = {
  render: (args) => (
    <div className="co-dt">
      <InboxItem item={critical} onAction={args.onAction} />
      <InboxItem
        item={{
          kind: 'refill',
          patient: 'Henna West',
          title: 'Metformin 500 mg, 90 day',
          from: 'Walgreens #10233',
          received: '9:02 AM',
          unread: true,
          actions: ['Approve', 'Deny'],
        }}
        onAction={args.onAction}
      />
      <InboxItem
        item={{
          kind: 'cosign',
          patient: 'Jacob Jones',
          title: 'Well child note by Olivia Grant NP',
          from: 'Needs supervising MD',
          received: 'Yesterday',
          priority: 'Urgent',
          actions: ['Co-sign'],
        }}
        onAction={args.onAction}
      />
      <InboxItem
        item={{ kind: 'message', patient: 'Nora Scott', title: 'Question about my next session', from: 'Portal', received: 'Mon' }}
        onAction={args.onAction}
      />
    </div>
  ),
};

export const Kinds: Story = {
  render: () => (
    <div className="co-dt">
      <InboxItem item={{ kind: 'imaging', patient: 'Mary Collins', title: 'CT chest without contrast: final read', from: 'Lakeview Imaging', received: '10:15' }} />
      <InboxItem item={{ kind: 'fax', patient: 'Ralph Edwards', title: 'Consult note, 3 pages', from: 'Lakeview Heart (312) 555-0188', received: '11:02', actions: ['Index Fax'] }} />
    </div>
  ),
};
