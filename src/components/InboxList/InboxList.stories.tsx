import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { InboxList, type InboxListCategory, type InboxListItem } from './InboxList';

const items: InboxListItem[] = [
  { id: 1, type: 'Lab Results', patient: 'Ralph Edwards', item: 'Potassium 6.1 mmol/L (H)', received: '08:42', priority: 'Critical', status: 'New' },
  { id: 2, type: 'Lab Results', patient: 'Henna West', item: 'A1c 6.8%', received: '08:10', priority: 'Normal', status: 'New' },
  { id: 3, type: 'Refill Requests', patient: 'Henna West', item: 'Metformin 500 mg', received: 'Yesterday', priority: 'Routine', status: 'Reviewed' },
  { id: 4, type: 'Imaging', patient: 'Nora Scott', item: 'X-ray knee, 2 views', received: 'Yesterday', priority: 'Abnormal', status: 'Routed' },
  { id: 5, type: 'Co-sign', patient: 'Jacob Jones', item: 'Well child note by NP', received: '10/07', priority: 'Urgent', status: 'Overdue' },
];

const categories: InboxListCategory[] = [
  { id: 'Lab Results', count: 2 },
  { id: 'Imaging', count: 1 },
  { id: 'Refill Requests', count: 1 },
  { id: 'Co-sign', count: 1, alert: true },
];

const critical = {
  title: '1 critical value waiting.',
  body: 'Ralph Edwards, potassium 6.1 mmol/L, received 08:42. Acknowledge within 1 hour or it pages the covering provider (Kristen Yale MD).',
};

const meta = {
  title: 'Complex/Clinical/InboxList',
  component: InboxList,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'InboxList is the clinical inbox: a critical-value alert, type tabs with counts, and a selectable worklist with sign, review and assign. Set `canSign={false}` with `lockText` for roles that can review and route but not sign.',
      },
    },
  },
  argTypes: {
    defaultCategory: { control: 'select', options: ['All', ...categories.map((c) => c.id)] },
    pageSize: { control: { type: 'number', min: 1, max: 50 } },
    lockText: { control: 'text' },
  },
  args: {
    items,
    categories,
    onCategoryChange: fn(),
    onAcknowledge: fn(),
    onOpenChart: fn(),
    onSign: fn(),
    onMarkReviewed: fn(),
    onAssign: fn(),
    onRowAction: fn(),
  },
} satisfies Meta<typeof InboxList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { critical, canSign: true, pageSize: 5 } };

/** Nurse / MA view: the critical value on top, signing locked to providers. */
export const Showcase: Story = {
  args: {
    critical,
    canSign: false,
    lockText: 'Your role (Nurse / MA) can review, route and pend. Signing results and co-signing notes needs a provider.',
  },
};

export const Filtered: Story = { args: { defaultCategory: 'Lab Results' } };

export const Empty: Story = { args: { items: [], categories: [] } };
