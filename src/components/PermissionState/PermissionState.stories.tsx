import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { PermissionDenied, PermissionState } from './PermissionState';

const meta = {
  title: 'Complex/Access/PermissionState',
  component: PermissionState,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'PermissionState renders the four role-based states with the screens\' exact wording: lock (view only), denied (no access), patient preview, and hidden. Always name the role and the permission. `PermissionDenied` is the same component with `kind="denied"`.',
      },
    },
  },
  argTypes: {
    kind: { control: 'inline-radio', options: ['lock', 'denied', 'preview', 'hidden'] },
    role: { control: 'text' },
    permission: { control: 'text' },
    home: { control: 'text' },
  },
  args: { role: 'Biller', permission: 'Edit clinical chart', onHome: fn(), onCompareRoles: fn() },
} satisfies Meta<typeof PermissionState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { kind: 'lock' } };

export const Showcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <PermissionState kind="lock" role="Biller" permission="Edit clinical chart" />
      <PermissionState kind="preview" role="Front Desk" />
      <PermissionState kind="hidden" role="Nurse / MA" />
      <PermissionState kind="denied" role="Front Desk" permission="Manage claims" />
    </div>
  ),
};

export const Lock: Story = { args: { kind: 'lock' } };

export const Denied: Story = { args: { kind: 'denied', role: 'Front Desk', permission: 'Manage claims', home: '#home' } };

export const Preview: Story = { args: { kind: 'preview', role: 'Front Desk', home: '#staff' } };

export const Hidden: Story = { args: { kind: 'hidden', role: 'Nurse / MA' } };

export const DeniedAlias: Story = {
  name: 'PermissionDenied',
  render: () => <PermissionDenied role="Front Desk" permission="Manage claims" />,
};
