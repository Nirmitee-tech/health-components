import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { iconNames } from '../Icon/paths';
import { IconButton } from './IconButton';

const meta = {
  title: 'Basic/Actions/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'IconButton is a square button that shows only an icon, with its name in aria-label. Use it to close a modal or drawer, open notifications or expand a row. `label` is required and becomes the aria-label and hover title.',
      },
    },
  },
  argTypes: {
    icon: { control: 'select', options: iconNames },
    variant: { control: 'inline-radio', options: ['ghost', 'secondary', 'primary', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    badge: { control: 'number' },
  },
  args: { icon: 'x', label: 'Close', onClick: fn() },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { variant: 'ghost' } };

export const Showcase: Story = {
  render: () => (
    <div className="co-row">
      <IconButton icon="x" label="Close" />
      <IconButton icon="bell" label="Notifications" badge={4} />
      <IconButton icon="search" label="Search" variant="secondary" />
      <IconButton icon="plus" label="New message" variant="primary" />
      <IconButton icon="trash" label="Remove line 2" variant="danger" />
      <IconButton icon="chevron-right" label="Expand row" size="sm" />
      <IconButton icon="camera" label="Take photo" size="lg" variant="secondary" />
      <IconButton icon="settings" label="Settings" disabled />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="co-row">
      <IconButton icon="x" label="Close panel" />
      <IconButton icon="download" label="Print chart" variant="secondary" />
      <IconButton icon="plus" label="Compose message" variant="primary" />
      <IconButton icon="trash" label="Remove CPT 99214" variant="danger" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="co-row">
      <IconButton icon="more" label="Row actions" size="sm" variant="secondary" />
      <IconButton icon="more" label="Header actions" variant="secondary" />
      <IconButton icon="more" label="Phone actions" size="lg" variant="secondary" />
    </div>
  ),
};

export const WithBadge: Story = { args: { icon: 'bell', label: 'Notifications', badge: 12 } };

export const Disabled: Story = { args: { icon: 'settings', label: 'Settings', disabled: true } };
