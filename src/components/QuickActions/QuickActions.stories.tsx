import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { QuickActions } from './QuickActions';

const meta = {
  title: 'Basic/Layout/QuickActions',
  component: QuickActions,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'QuickActions is the 3-column grid of big icon tiles on phone and portal home screens. Tiles with `href` are links; the others are buttons that call `onClick`.',
      },
    },
  },
  args: {
    'aria-label': 'Quick actions',
    items: [
      { label: 'Book Visit', icon: 'calendar', onClick: fn() },
      { label: 'Messages', icon: 'message', badge: 2, onClick: fn() },
      { label: 'Pay Bill', icon: 'card', onClick: fn() },
      { label: 'Results', icon: 'flask', onClick: fn() },
      { label: 'Refills', icon: 'pill', onClick: fn() },
      { label: 'Forms', icon: 'file', onClick: fn() },
    ],
  },
} satisfies Meta<typeof QuickActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Links: Story = {
  args: {
    items: [
      { label: 'Book Visit', icon: 'calendar', href: '#book' },
      { label: 'Messages', icon: 'message', href: '#messages', badge: 5 },
      { label: 'Pay Bill', icon: 'card', href: '#billing' },
    ],
  },
};
