import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { iconNames } from '../Icon/paths';
import { Button } from './Button';

const meta = {
  title: 'Basic/Actions/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Button runs one action on the screen, from Save Claim to Start Visit Note. Use `primary` once per area for the main action; everything else is `secondary`. Use `ai` only for actions that run an AI model.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'ghost', 'danger', 'danger-solid', 'link', 'ai'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    iconLeft: { control: 'select', options: [undefined, ...iconNames] },
    iconRight: { control: 'select', options: [undefined, ...iconNames] },
    children: { control: 'text' },
  },
  args: { children: 'Start Visit Note', onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { variant: 'primary', iconLeft: 'plus' } };

export const Variants: Story = {
  render: () => (
    <div className="co-row">
      <Button variant="primary">Start Visit Note</Button>
      <Button>Print Chart</Button>
      <Button variant="tertiary">View History</Button>
      <Button variant="danger" iconLeft="trash">
        Void Claim
      </Button>
      <Button variant="danger-solid">Delete Allergy</Button>
      <Button variant="ai" iconLeft="sparkle">
        Draft with AI Scribe
      </Button>
      <Button variant="link">Clear selection</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="co-row">
      <Button variant="primary" size="sm">
        Check In
      </Button>
      <Button variant="primary">Check In</Button>
      <Button variant="primary" size="lg">
        Check In
      </Button>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="co-row">
      <Button variant="primary" loading>
        Checking Coverage
      </Button>
      <Button variant="primary" disabled>
        Submit Claim
      </Button>
      <Button pressed iconLeft="calendar">
        Week
      </Button>
      <Button pressed={false}>Day</Button>
      <Button iconRight="chevron-down">Export</Button>
    </div>
  ),
};

export const AsLink: Story = { args: { href: '#claims', children: 'Open Claims', variant: 'secondary' } };

export const FullWidth: Story = {
  args: { full: true, variant: 'primary', size: 'lg', children: 'Check In' },
  parameters: { layout: 'padded' },
};
