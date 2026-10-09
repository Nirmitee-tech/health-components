import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { SectionNav, type SectionNavItem } from './SectionNav';

const chartSections: SectionNavItem[] = [
  'Summary',
  'Demographics',
  { label: 'Allergies', count: 1 },
  { label: 'Problems', count: 4 },
  { label: 'Medications', count: 6 },
  'Vitals',
  'Immunizations',
  'Lab Results',
  'Imaging',
  'Documents',
  'Insurance',
  'Care Team',
  'Encounters',
];

const meta = {
  title: 'Basic/Navigation/SectionNav',
  component: SectionNav,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'SectionNav is the left list of sections inside a record, such as the 20 sections of a patient chart. A nav landmark ("Section menu") with aria-current="page" on the active link.',
      },
    },
  },
  argTypes: { label: { control: 'text' }, active: { control: 'text' } },
  args: { items: chartSections, active: 'Medications', onChange: fn() },
  decorators: [(Story) => <div style={{ maxWidth: 260 }}>{Story()}</div>],
} satisfies Meta<typeof SectionNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

function InteractiveDemo() {
  const [active, setActive] = useState('Summary');
  return <SectionNav items={chartSections} active={active} onChange={setActive} />;
}

export const Interactive: Story = { render: () => <InteractiveDemo /> };

export const ClaimEdit: Story = {
  args: {
    label: 'Claim sections',
    active: 'Service Lines',
    items: ['Patient', 'Insurance', 'Provider', { label: 'Service Lines', count: 3 }, 'Attachments', 'Review'],
  },
};
