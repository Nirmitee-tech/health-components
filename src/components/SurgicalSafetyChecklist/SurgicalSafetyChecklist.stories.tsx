import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SurgicalSafetyChecklist } from './SurgicalSafetyChecklist';

const allSignIn: Record<string, boolean> = {};
for (let i = 0; i < 7; i++) allSignIn['signin' + i] = true;
const partTO = { timeout0: true, timeout1: true, timeout2: true };

const meta = {
  title: 'Complex/ED & periop/SurgicalSafetyChecklist',
  component: SurgicalSafetyChecklist,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'SurgicalSafetyChecklist runs the WHO Surgical Safety Checklist in its three phases, Sign In, Time Out and Sign Out, each confirmed by the team before the next unlocks. Confirm stays disabled until every item of the phase is checked. The phases are exported as `SURGICAL_SAFETY_PHASES`.',
      },
    },
  },
  args: { onConfirm: fn(), onCheckedChange: fn() },
} satisfies Meta<typeof SurgicalSafetyChecklist>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    subtitle: 'OR 2 . Sara Ahmed . ORIF distal radius, LEFT',
    defaultChecked: { signin0: true, signin1: true, signin2: true },
    clock: '10:42',
  },
};

export const Showcase: Story = {
  render: (args) => (
    <div className="pv-stack">
      <SurgicalSafetyChecklist
        {...args}
        subtitle="OR 2 . Sara Ahmed . ORIF distal radius, LEFT"
        defaultChecked={{ signin0: true, signin1: true, signin2: true }}
        clock="10:42"
      />
      <SurgicalSafetyChecklist
        {...args}
        subtitle="OR 3 . William Hart . CABG x3 . Time Out in progress"
        confirmed={{ signin: '07:52' }}
        defaultChecked={partTO}
        clock="08:14"
      />
      <SurgicalSafetyChecklist
        {...args}
        subtitle="OR 1 . Aaliyah Brooks . completed"
        confirmed={{ signin: '07:31', timeout: '07:48', signout: '08:56' }}
        readOnly
      />
      <SurgicalSafetyChecklist
        {...args}
        subtitle="OR 2 . Frank Owens . Total knee"
        mismatch="Consent says RIGHT knee, site marking is on the LEFT. Do not proceed until resolved."
        defaultChecked={allSignIn}
      />
    </div>
  ),
};

export const TimeOutInProgress: Story = {
  args: { subtitle: 'OR 3 . William Hart . CABG x3 . Time Out in progress', confirmed: { signin: '07:52' }, defaultChecked: partTO, clock: '08:14' },
};

export const Completed: Story = {
  args: { subtitle: 'OR 1 . Aaliyah Brooks . completed', confirmed: { signin: '07:31', timeout: '07:48', signout: '08:56' }, readOnly: true },
};

export const SiteMismatch: Story = {
  args: {
    subtitle: 'OR 2 . Frank Owens . Total knee',
    mismatch: 'Consent says RIGHT knee, site marking is on the LEFT. Do not proceed until resolved.',
    defaultChecked: allSignIn,
  },
};
