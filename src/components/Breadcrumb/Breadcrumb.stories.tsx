import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumb } from './Breadcrumb';

const meta = {
  title: 'Basic/Navigation/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Breadcrumb shows where a deep screen sits and links back up the path. nav "Breadcrumb", ordered list, aria-current="page" on the last item.',
      },
    },
  },
  args: {
    items: [
      { label: 'Settings', href: '#settings' },
      { label: 'Roles and Permissions', href: '#settings/roles' },
      { label: 'Biller' },
    ],
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Examples: Story = {
  render: () => (
    <div className="pv-stack">
      <Breadcrumb items={[{ label: 'Settings' }, { label: 'Roles and Permissions' }, { label: 'Biller' }]} />
      <Breadcrumb
        label="Report path"
        items={[{ label: 'Reports' }, { label: 'Revenue' }, { label: 'Denials by Payer, Q3 2026' }]}
      />
    </div>
  ),
};
