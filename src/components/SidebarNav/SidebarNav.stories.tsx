import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SidebarNav, type SidebarNavGroup } from './SidebarNav';

const groups: SidebarNavGroup[] = [
  {
    label: 'Clinical',
    items: [
      { label: 'Home', icon: 'home' },
      { label: 'Schedule', icon: 'calendar' },
      { label: 'Patients', icon: 'users' },
      { label: 'Inbox', icon: 'inbox', badge: 7 },
      { label: 'Orders', icon: 'flask' },
    ],
  },
  {
    label: 'Front office',
    items: [
      { label: 'Check-In', icon: 'check' },
      { label: 'Messages', icon: 'message' },
    ],
  },
  {
    label: 'Revenue',
    items: [
      { label: 'Billing', icon: 'dollar' },
      { label: 'Prior Auth', icon: 'shield' },
    ],
  },
  { label: 'Insights', items: [{ label: 'Reports', icon: 'chart', locked: true }] },
  { label: 'Admin', items: [{ label: 'Settings', icon: 'settings' }] },
];

const meta = {
  title: 'Complex/Navigation/SidebarNav',
  component: SidebarNav,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "SidebarNav is the Clinical Sidebar style's grouped left navigation, 240px wide, collapsing to a 64px icon strip. The collapse button says Collapse sidebar or Expand sidebar and carries aria-expanded.",
      },
    },
  },
  argTypes: { active: { control: 'text' }, product: { control: 'text' } },
  args: { groups, active: 'Schedule', inline: true, onCollapse: fn(), onNavigate: fn() },
  decorators: [(Story) => <div style={{ display: 'flex', height: 600 }}>{Story()}</div>],
} satisfies Meta<typeof SidebarNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ExpandedAndCollapsed: Story = {
  render: () => (
    <div className="co-row" style={{ alignItems: 'stretch', height: 600 }}>
      <SidebarNav inline groups={groups} active="Schedule" aria-label="Main (expanded)" />
      <SidebarNav inline groups={groups} active="Schedule" defaultCollapsed aria-label="Main (collapsed)" />
    </div>
  ),
};

export const Collapsed: Story = { args: { defaultCollapsed: true } };
