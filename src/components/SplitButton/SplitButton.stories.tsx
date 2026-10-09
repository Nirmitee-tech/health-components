import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SplitButton } from './SplitButton';

const meta = {
  title: 'Basic/Actions/SplitButton',
  component: SplitButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'SplitButton pairs a main action with a menu of related ones, such as Submit Claim with Submit and Print. The arrow is its own button with aria-haspopup="menu"; the menu follows the ARIA menu pattern and closes on Escape or outside click.',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    align: { control: 'inline-radio', options: ['right', 'left'] },
  },
  args: {
    label: 'Submit Claim',
    onClick: fn(),
    items: [
      { label: 'Submit and Print CMS-1500', icon: 'file' },
      { label: 'Save as Draft', icon: 'download' },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 200 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SplitButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: () => (
    <div className="co-row" style={{ alignItems: 'flex-start', minHeight: 200 }}>
      <SplitButton
        label="Submit Claim"
        defaultOpen
        items={[
          { label: 'Submit and Print CMS-1500', icon: 'file' },
          { label: 'Save as Draft', icon: 'download' },
          { divider: true },
          { label: "Schedule for Tonight's Batch", hint: 'Sent to Availity at 11:00 PM', icon: 'clock' },
        ]}
      />
      <SplitButton
        label="Export"
        variant="secondary"
        items={[{ label: 'CSV' }, { label: 'Excel' }, { label: 'PDF' }]}
      />
      <SplitButton label="Submit Claim" disabled items={[]} />
    </div>
  ),
};

export const Secondary: Story = {
  args: {
    label: 'Export',
    variant: 'secondary',
    menuLabel: 'Export formats',
    items: [{ label: 'CSV' }, { label: 'Excel' }, { label: 'PDF' }],
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    label: 'Sign Note',
    items: [{ label: 'Sign and Close Encounter' }, { label: 'Sign and Route to Biller' }],
  },
};

export const Disabled: Story = { args: { disabled: true } };
