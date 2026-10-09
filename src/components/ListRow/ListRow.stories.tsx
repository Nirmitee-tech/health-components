import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Avatar } from '../Avatar/Avatar';
import { StatusTag } from '../Badge/Badge';
import { ListRow } from './ListRow';

const meta = {
  title: 'Basic/Layout/ListRow',
  component: ListRow,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'ListRow is the 56px tappable row used for lists on phone and portal screens. With `onClick` it is a button, with `href` a link (both show a chevron); without either it is a plain row.',
      },
    },
  },
  args: { title: 'Henna West', meta: '9:20 AM . Follow-Up', onClick: fn() },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 430 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ListRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: (args) => (
    <div>
      <ListRow
        leading={<Avatar name="Henna West" size="sm" />}
        title="Henna West"
        meta="9:20 AM . Follow-Up"
        trailing={<StatusTag kind="appointment" status="Arrived" />}
        onClick={args.onClick}
      />
      <ListRow leading={<Avatar name="Ralph Edwards" size="sm" />} title="Ralph Edwards" meta="10:00 AM . New Patient" onClick={args.onClick} />
    </div>
  ),
};

export const AsLink: Story = { args: { onClick: undefined, href: '#visit-summary', title: 'Visit summary, Oct 2', meta: 'James Bell MD' } };

export const Static: Story = { args: { onClick: undefined, title: 'Primary care', meta: 'James Bell MD . Main Street Clinic' } };
