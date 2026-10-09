import type { Meta, StoryObj } from '@storybook/react-vite';
import { LockedField } from './LockedField';

const meta = {
  title: 'Complex/Access/LockedField',
  component: LockedField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'LockedField is a read-only field for the View access level: value visible and copyable, lock icon and "Your role can view but not edit". Name the missing permission in `message` when you can.',
      },
    },
  },
  args: { label: 'Member ID', value: 'W123456789' },
} satisfies Meta<typeof LockedField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Messages: Story = {
  render: () => (
    <div className="pv-grid">
      <LockedField label="Member ID" value="W123456789" />
      <LockedField label="Fee for 99214" value="$182.00" message="Needs Manage fee schedule" />
    </div>
  ),
};
