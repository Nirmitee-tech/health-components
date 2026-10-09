import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { PermissionMatrix, type PermissionRow } from './PermissionMatrix';

const rows: PermissionRow[] = [
  { module: 'Schedule', action: 'View calendar', levels: { Provider: 'edit', 'Nurse / MA': 'edit', Biller: 'view' } },
  { module: 'Schedule', action: 'Book and reschedule', levels: { Provider: 'edit', 'Nurse / MA': 'edit', Biller: 'none' } },
  { module: 'Clinical', action: 'Sign visit notes', levels: { Provider: 'approve', 'Nurse / MA': 'none', Biller: 'none' } },
  { module: 'Clinical', action: 'Enter vitals', levels: { Provider: 'edit', 'Nurse / MA': 'edit', Biller: 'none' } },
  { module: 'Billing', action: 'Edit claims', levels: { Provider: 'view', 'Nurse / MA': 'none', Biller: 'edit' } },
  { module: 'Billing', action: 'Post payments', levels: { Provider: 'none', 'Nurse / MA': 'none', Biller: 'approve' } },
  { module: 'Settings', action: 'Manage roles', levels: { Provider: 'none', 'Nurse / MA': 'none', Biller: 'none' } },
];

const meta = {
  title: 'Complex/Access/PermissionMatrix',
  component: PermissionMatrix,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'PermissionMatrix is the role-by-action grid from Compare roles and Roles and Permissions, showing None, View, Edit or Approve for each role. `editable` shows a select per cell; "Only show differences" hides rows where every role matches.',
      },
    },
  },
  argTypes: {
    editable: { control: 'boolean' },
    defaultOnlyDifferences: { control: 'boolean' },
  },
  args: {
    roles: ['Provider', 'Nurse / MA', 'Biller'],
    defaultRows: rows,
    onChange: fn(),
    onRowsChange: fn(),
    onOnlyDifferencesChange: fn(),
  },
} satisfies Meta<typeof PermissionMatrix>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { editable: false } };

export const Showcase: Story = {
  render: () => (
    <div className="pv-stack">
      <PermissionMatrix roles={['Provider', 'Nurse / MA', 'Biller']} defaultRows={rows} />
      <div className="pv-label">Editable, only differences</div>
      <PermissionMatrix roles={['Provider', 'Biller']} defaultRows={rows.slice(2, 6)} editable defaultOnlyDifferences />
    </div>
  ),
};

export const Editable: Story = { args: { roles: ['Provider', 'Biller'], defaultRows: rows.slice(2, 6), editable: true } };

export const NoDifferences: Story = {
  args: {
    roles: ['Provider', 'Nurse / MA'],
    defaultRows: rows.filter((r) => r.levels.Provider === r.levels['Nurse / MA']),
    defaultOnlyDifferences: true,
  },
};
