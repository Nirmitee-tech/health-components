import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Button } from '../Button/Button';
import { SuccessDialog } from './SuccessDialog';

const meta = {
  title: 'Basic/Feedback/SuccessDialog',
  component: SuccessDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'SuccessDialog confirms a major completed task with a green check, an "... Successfully" title and an Okay button, which gets focus. Documentation stories pass `inline`.',
      },
    },
  },
  argTypes: { title: { control: 'text' }, children: { control: 'text' } },
  args: {
    inline: true,
    title: 'Electronic Claim Submitted Successfully',
    children: 'CLM-20871 went to Availity. The payer acknowledgement (277CA) usually arrives within 24 hours.',
    onOkay: fn(),
    onSecondary: fn(),
  },
} satisfies Meta<typeof SuccessDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithNextStep: Story = { args: { secondary: 'View Claim' } };

export const PatientAdded: Story = {
  args: {
    title: 'Patient Added Successfully',
    children: 'Henna West (MRN-100231) is ready for scheduling. Insurance was verified with Aetna.',
    secondary: 'Add Another Patient',
  },
};

function OpenDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Post ERA
      </Button>
      <SuccessDialog open={open} title="ERA Posted and Closed Successfully" onOkay={() => setOpen(false)}>
        14 claim lines posted from Aetna check 88231. 2 denials moved to the work queue.
      </SuccessDialog>
    </>
  );
}

/** The real overlay through a portal. */
export const OpenFromButton: Story = { render: () => <OpenDemo /> };
