import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { PatientTabs } from '../PatientTabs/PatientTabs';
import { TopBar } from './TopBar';

const roles = ['Practice Admin', 'Provider', 'Nurse / MA', 'Front Desk', 'Biller'];

const meta = {
  title: 'Complex/Navigation/TopBar',
  component: TopBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'TopBar is the 52px app header in all four styles: Classic navy bar with module links, patient search (Sidebar), patient tabs (Rail) or the Jump to anything bar (Command), then Viewing as, notifications and the account.',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['classic', 'sidebar', 'rail', 'command'] },
    role: { control: 'text' },
    notifications: { control: 'number' },
    quickAdd: { control: 'text' },
    user: { control: 'text' },
    module: { control: 'text' },
    active: { control: 'text' },
  },
  args: {
    variant: 'classic',
    active: 'Schedule',
    role: 'Front Desk',
    roles,
    notifications: 4,
    onOpenPalette: fn(),
    onNavigate: fn(),
    onQuickAdd: fn(),
    onRoleChange: fn(),
  },
  decorators: [(Story) => <div style={{ minHeight: 120 }}>{Story()}</div>],
} satisfies Meta<typeof TopBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Styles: Story = {
  render: () => (
    <div className="pv-stack" style={{ gap: 14 }}>
      <TopBar variant="classic" active="Schedule" role="Front Desk" roles={roles} notifications={4} />
      <TopBar variant="sidebar" role="Practice Admin" roles={roles} notifications={4} />
      <TopBar
        variant="rail"
        notifications={2}
        tabs={
          <PatientTabs
            tabs={[
              { id: 'a', name: 'Henna West', meta: 'F 38' },
              { id: 'b', name: 'Ralph Edwards', meta: 'M 74' },
            ]}
          />
        }
      />
      <TopBar variant="command" module="Revenue" notifications={0} />
    </div>
  ),
};

export const Sidebar: Story = { args: { variant: 'sidebar', role: 'Practice Admin' } };

export const Command: Story = { args: { variant: 'command', module: 'Revenue', role: undefined, notifications: 0 } };
