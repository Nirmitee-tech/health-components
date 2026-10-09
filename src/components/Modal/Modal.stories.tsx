import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Button } from '../Button/Button';
import { Checkbox } from '../Checkbox/Checkbox';
import { DescriptionList } from '../DescriptionList/DescriptionList';
import { Select } from '../Select/Select';
import { TextField } from '../TextField/TextField';
import { Modal } from './Modal';

const meta = {
  title: 'Basic/Overlays/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Modal asks for input or a decision in a centered dialog: form, confirm and destructive kinds. It renders through a portal, traps focus, locks page scroll, closes on Escape and returns focus to the trigger. Documentation stories pass `inline`.',
      },
    },
  },
  argTypes: {
    kind: { control: 'inline-radio', options: ['form', 'confirm', 'destructive'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'wide'] },
    title: { control: 'text' },
    children: { control: 'text' },
  },
  args: {
    inline: true,
    title: 'Discard changes?',
    children: 'You have unsaved changes on this claim. They will be lost.',
    onPrimary: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { kind: 'confirm', size: 'sm', primaryLabel: 'Discard Changes' } };

export const Kinds: Story = {
  render: () => (
    <div className="pv-stack">
      <Modal inline title="Add Appointment Type" primaryLabel="Add Appointment Type">
        <div className="pv-grid">
          <TextField label="Name" required defaultValue="Annual Wellness Visit" />
          <Select label="Length" options={['20 min', '30 min', '40 min']} />
          <Select label="Color" options={['Blue', 'Green', 'Teal', 'Purple', 'Yellow']} />
          <TextField label="Default CPT" defaultValue="G0439" />
        </div>
      </Modal>
      <div className="pv-grid">
        <Modal inline kind="confirm" size="sm" title="Discard changes?" primaryLabel="Discard Changes">
          <div className="co-muted">You have unsaved changes on this claim. They will be lost.</div>
        </Modal>
        <Modal inline kind="destructive" size="sm" title="Void this claim?" primaryLabel="Void Claim">
          <DescriptionList
            compact
            items={[
              ['Claim', 'CLM-20871'],
              ['Patient', 'Henna West'],
              ['Billed', '$182.00'],
            ]}
          />
          <div className="co-muted">A void (frequency code 8) is sent to Aetna. This cannot be undone.</div>
          <Checkbox label="I confirm this claim was billed in error" />
        </Modal>
      </div>
    </div>
  ),
};

export const Destructive: Story = {
  args: {
    kind: 'destructive',
    size: 'sm',
    title: 'Void CLM-20871 for Henna West?',
    primaryLabel: 'Void Claim',
    children: 'A void (frequency code 8) is sent to Aetna. This cannot be undone.',
  },
};

export const Saving: Story = {
  args: {
    title: 'Add Appointment Type',
    primaryLabel: 'Add Appointment Type',
    loading: true,
    children: 'Saving Annual Wellness Visit (G0439, 40 min).',
  },
};

export const CustomFooter: Story = {
  args: {
    title: 'Coverage changed',
    kind: 'confirm',
    size: 'sm',
    children: 'Aetna PPO ended 09/30/2026. Medicare Part B is active from 10/01/2026.',
    footer: <Button variant="primary">Use Medicare Part B</Button>,
  },
};

function OpenModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="danger" iconLeft="trash" onClick={() => setOpen(true)}>
        Void Claim
      </Button>
      <Modal
        open={open}
        kind="destructive"
        size="sm"
        title="Void this claim?"
        primaryLabel="Void Claim"
        onPrimary={() => setOpen(false)}
        onClose={() => setOpen(false)}
      >
        <div className="co-muted">CLM-20871 for Henna West ($182.00). A void is sent to Aetna. This cannot be undone.</div>
      </Modal>
    </>
  );
}

/** The real overlay: portal, focus trap, scroll lock, Escape, focus returns to the button. */
export const OpenFromButton: Story = { render: () => <OpenModalDemo /> };
