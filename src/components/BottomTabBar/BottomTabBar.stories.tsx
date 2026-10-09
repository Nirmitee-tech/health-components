import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { BottomTabBar, type BottomTabBarItem } from './BottomTabBar';

const staff: BottomTabBarItem[] = [
  { label: 'Home', icon: 'home' },
  { label: 'Schedule', icon: 'calendar' },
  { label: 'Patients', icon: 'users' },
  { label: 'Messages', icon: 'message', badge: 3 },
  { label: 'More', icon: 'menu' },
];
const portal: BottomTabBarItem[] = [
  { label: 'Home', icon: 'home' },
  { label: 'Appointments', icon: 'calendar' },
  { label: 'Messages', icon: 'message', badge: 1 },
  { label: 'Health', icon: 'heart' },
  { label: 'More', icon: 'menu' },
];

const meta = {
  title: 'Complex/Mobile and kiosk/BottomTabBar',
  component: BottomTabBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'BottomTabBar is the phone and portal bottom navigation with four or five tabs and badges: a nav landmark with aria-current="page" and 56px targets.',
      },
    },
  },
  argTypes: { active: { control: 'text' }, label: { control: 'text' } },
  args: { items: staff, active: 'Schedule', onNavigate: fn() },
  decorators: [(Story) => <div style={{ maxWidth: 430 }}>{Story()}</div>],
} satisfies Meta<typeof BottomTabBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const StaffAndPortal: Story = {
  render: () => (
    <div className="pv-stack" style={{ gap: 16 }}>
      <BottomTabBar active="Schedule" items={staff} />
      <BottomTabBar label="Portal" active="Health" items={portal} />
    </div>
  ),
};
