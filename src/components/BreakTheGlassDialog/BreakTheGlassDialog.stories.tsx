import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Button } from '../Button/Button';
import { BreakTheGlassDialog } from './BreakTheGlassDialog';

const meta = {
  title: 'Complex/Access/BreakTheGlassDialog',
  component: BreakTheGlassDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'BreakTheGlassDialog asks for a reason before opening a restricted chart and says the access is logged. It is an alertdialog that renders through a portal, traps focus, locks page scroll and closes on Escape. No reason is pre-selected; "Other" needs a written explanation. Documentation stories pass `inline`.',
      },
    },
  },
  argTypes: { reason: { control: 'text' }, note: { control: 'text' } },
  args: {
    inline: true,
    patient: 'Nora Scott',
    dob: '06/11/1999',
    careTeam: 'Mandy Harley LCSW',
    onConfirm: fn(),
    onClose: fn(),
    onAccessReasonChange: fn(),
  },
} satisfies Meta<typeof BreakTheGlassDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const OtherReason: Story = {
  args: { accessReason: 'Other', note: 'Reviewing records for a court-ordered evaluation.' },
};

export const StaffChart: Story = {
  args: {
    patient: 'Lisa Chen',
    dob: '02/14/1988',
    careTeam: 'James Bell MD',
    reason: 'This patient is a staff member. Only the care team can open the chart without a reason.',
  },
};

function OpenDialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" iconLeft="lock" onClick={() => setOpen(true)}>
        Open Chart: Nora Scott
      </Button>
      <BreakTheGlassDialog
        open={open}
        patient="Nora Scott"
        dob="06/11/1999"
        careTeam="Mandy Harley LCSW"
        onConfirm={() => setOpen(false)}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

/** The real overlay: portal, focus trap, scroll lock, Escape, focus returns to the button. */
export const OpenFromButton: Story = { render: () => <OpenDialogDemo /> };
