import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '../Button/Button';
import { Checkbox } from '../Checkbox/Checkbox';
import { KebabMenu, Menu, Popover, type MenuItem } from './Menu';

const claimItems: MenuItem[] = [
  { heading: 'CLM-20871 . Henna West' },
  { label: 'Open Claim', icon: 'file' },
  { label: 'Check Status (276)', icon: 'clock', hint: 'Last checked 2 h ago' },
  { label: 'Assign to Me', icon: 'user', active: true },
  { label: 'Print CMS-1500', icon: 'download', disabled: true },
  { divider: true },
  { label: 'Void Claim', icon: 'trash', danger: true },
];

const meta = {
  title: 'Basic/Overlays/Menu',
  component: Menu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Menu lists actions in a dropdown; KebabMenu opens one from a three-dot button and Popover holds a small form or filter set. Menus follow the ARIA menu pattern: arrow keys, Home/End and type-ahead move between items, Enter chooses, Escape and outside click close.',
      },
    },
  },
  argTypes: {
    align: { control: 'inline-radio', options: ['right', 'left'] },
    inline: { control: 'boolean' },
  },
  args: { items: claimItems, inline: true, label: 'Claim actions', onClose: fn() },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: () => (
    <div className="co-row" style={{ alignItems: 'flex-start', gap: 24, minHeight: 280 }}>
      <Menu inline label="Claim actions" items={claimItems} />
      <KebabMenu
        defaultOpen
        align="left"
        label="Actions for Henna West, 10:30 AM"
        items={[{ label: 'Reschedule' }, { label: 'Mark Arrived' }, { divider: true }, { label: 'Mark No Show', danger: true }]}
      />
      <Popover trigger="Filters (2)" title="Filter claims" defaultOpen align="left">
        <Checkbox label="Rejected" defaultChecked />
        <Checkbox label="Denied" defaultChecked />
        <Checkbox label="Pending" />
        <div className="co-row co-gap-8">
          <Button size="sm" variant="primary">
            Apply
          </Button>
          <Button size="sm" variant="link">
            Reset
          </Button>
        </div>
      </Popover>
    </div>
  ),
};

export const WithShortcuts: Story = {
  args: {
    label: 'Chart actions',
    items: [
      { label: 'Print Chart', icon: 'download', shortcut: 'Ctrl P' },
      { label: 'Send Message', icon: 'message', shortcut: 'Ctrl M' },
      { label: 'Open Orders', icon: 'flask', shortcut: 'Ctrl O' },
    ],
  },
};

export const Kebab: Story = {
  render: () => (
    <div style={{ minHeight: 200 }}>
      <KebabMenu
        label="Actions for CLM-20871"
        align="left"
        items={[
          { label: 'Open Claim', onSelect: fn() },
          { label: 'Check Status (276)' },
          { divider: true },
          { label: 'Void Claim', danger: true },
        ]}
      />
      <KebabMenu horizontal label="Actions for Ralph Edwards" align="left" items={[{ label: 'Open Chart' }, { label: 'Message Patient' }]} />
    </div>
  ),
};

export const PopoverFilters: Story = {
  render: () => (
    <div style={{ minHeight: 220 }}>
      <Popover trigger="Status" title="Filter by status" align="left">
        <Checkbox label="Scheduled" defaultChecked />
        <Checkbox label="Checked In" />
        <Checkbox label="No Show" />
      </Popover>
    </div>
  ),
};
