import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Button } from '../Button/Button';
import { DevDrawer } from './DevDrawer';

const eligibility = {
  screen: 'Eligibility',
  purpose:
    'Sends a 270 to the payer through the clearinghouse and shows the 271. Front Desk, Biller and PA Coordinator can run checks; Provider views.',
  api: 'POST /eligibility/270  { patientId, coverageId, serviceTypes: ["30"] }\n200 { status: "active", benefits: [...], aaa: null }',
  fields:
    'Patient (required), Coverage (required), Rendering provider (required), Date of service (required), Service types (30 always sent).',
  states:
    'Waiting (1 to 5 s), Active, Inactive, AAA 42 payer down, AAA 72 bad member ID, AAA 75 subscriber not found, AAA 79 provider not enrolled, AAA 57 date of service.',
};

const meta = {
  title: 'Complex/Developer/DevDrawer',
  component: DevDrawer,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'DevDrawer is the "For developers" panel every screen has: purpose and roles, API, fields, states and entry points. Only the sections you pass are shown, in a fixed order. Built on Drawer (developer); documentation stories pass `inline`.',
      },
    },
  },
  argTypes: {
    screen: { control: 'text' },
    purpose: { control: 'text' },
    roles: { control: 'text' },
    api: { control: 'text' },
    fields: { control: 'text' },
    states: { control: 'text' },
    entry: { control: 'text' },
    width: { control: { type: 'number', min: 320, max: 900 } },
  },
  args: { ...eligibility, inline: true, onClose: fn() },
} satisfies Meta<typeof DevDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = { args: { width: 620 } };

export const AllSections: Story = {
  args: {
    screen: 'Claims',
    purpose: 'Work list of claims by status. Biller edits and submits; Provider views; Front Desk has no access.',
    roles: 'Biller: edit, submit, void. Practice Admin: everything. Provider: view.',
    api: 'GET /claims?status=rejected&page=1\nPOST /claims/{id}/submit',
    fields: 'Status filter, payer filter, date of service range.',
    states: 'Empty, loading, clearinghouse timeout, no permission (lock banner).',
    entry: 'Sidebar Billing > Claims; Dashboard "Rejected claims" card.',
  },
};

function OpenDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button iconLeft="code" onClick={() => setOpen(true)}>
        For developers
      </Button>
      <DevDrawer {...eligibility} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

/** The real overlay: portal, focus trap, scroll lock, Escape. */
export const OpenFromButton: Story = { render: () => <OpenDemo /> };
