import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { IconRail, type IconRailItem } from './IconRail';

const items: IconRailItem[] = [
  { label: 'Home', icon: 'home' },
  { label: 'Schedule', icon: 'calendar' },
  { label: 'Patients', icon: 'users' },
  { label: 'Inbox', icon: 'inbox', badge: 7 },
  { separator: true },
  { label: 'Check-In', icon: 'check' },
  { label: 'Messages', icon: 'message' },
  { separator: true },
  { label: 'Billing', icon: 'dollar' },
  { label: 'Prior Auth', icon: 'shield' },
  { separator: true },
  { label: 'Reports', icon: 'chart' },
  { label: 'Settings', icon: 'settings' },
];

const meta = {
  title: 'Complex/Navigation/IconRail',
  component: IconRail,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "IconRail is the Focus Rail style's 64px slate icon rail with tooltips, leaving the most room for the chart. Every item has an aria-label; tooltips show on hover and focus.",
      },
    },
  },
  argTypes: { active: { control: 'text' }, showTip: { control: 'text' } },
  args: { items, active: 'Patients', inline: true, onNavigate: fn() },
  decorators: [(Story) => <div className="co-row" style={{ alignItems: 'stretch', height: 480 }}>{Story()}</div>],
} satisfies Meta<typeof IconRail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithTooltip: Story = { args: { showTip: 'Patients' } };
