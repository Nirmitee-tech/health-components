import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { RolePill, type RoleOption } from './RolePill';

const roles: RoleOption[] = [
  { label: 'Super Admin' },
  { label: 'Practice Admin' },
  { label: 'Provider', hint: 'MD, DO, NP, PA' },
  { label: 'Nurse / MA' },
  { label: 'BH Therapist' },
  { label: 'Front Desk' },
  { label: 'Biller' },
  { label: 'Insurance / PA Coordinator' },
  { label: 'Patient', hint: 'Portal view' },
];

const meta = {
  title: 'Complex/Access/RolePill',
  component: RolePill,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'RolePill shows which role the screen is previewed as ("Viewing as: Biller") and switches it. Also exported as `ViewingAs` and `RoleSwitcher`. A menu button: Enter, Space or ArrowDown opens the menu; Escape closes it and returns focus.',
      },
    },
  },
  argTypes: { role: { control: 'text' } },
  args: { defaultRole: 'Biller', roles, onChange: fn() },
  decorators: [(Story) => <div style={{ minHeight: 340 }}>{Story()}</div>],
} satisfies Meta<typeof RolePill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Open: Story = { args: { defaultOpen: true } };

export const PlainRoles: Story = { args: { defaultRole: 'Provider', roles: ['Provider', 'Biller', 'Front Desk'] } };
