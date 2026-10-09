import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { TopBar } from '../TopBar/TopBar';
import { RoleSwitcher } from './RoleSwitcher';

const meta = {
  title: 'Complex/Access/RoleSwitcher',
  component: RoleSwitcher,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'RoleSwitcher is the "Viewing as" control in the top bar; it is the same component as RolePill, exported under the composite name. Inside TopBar variant classic it turns white on the navy bar.',
      },
    },
  },
  argTypes: { role: { control: 'text' } },
  args: { defaultRole: 'Provider', roles: ['Provider', 'Biller'], onChange: fn() },
  decorators: [(Story) => <div style={{ minHeight: 160 }}>{Story()}</div>],
} satisfies Meta<typeof RoleSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const InTopBar: Story = {
  render: () => (
    <div className="pv-stack">
      <TopBar variant="classic" active="Billing" role="Biller" roles={['Provider', 'Biller', 'Front Desk']} notifications={3} />
      <RoleSwitcher defaultRole="Provider" roles={['Provider', 'Biller']} />
    </div>
  ),
};
