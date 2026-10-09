import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { IdentifierDisplay } from './IdentifierDisplay';

const meta = {
  title: 'Basic/Clinical values/IdentifierDisplay',
  component: IdentifierDisplay,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'IdentifierDisplay shows SSN, MRN, NPI, DEA and member IDs in a monospace face, masking the sensitive ones, with reveal and copy buttons and a check-digit warning. Log every reveal through `onReveal`. A passing check digit only rules out typing errors.',
      },
    },
  },
  argTypes: { type: { control: 'select', options: ['ssn', 'mrn', 'npi', 'dea', 'member', 'other'] } },
  args: { type: 'ssn', value: '123456789', revealable: true, onReveal: fn() },
} satisfies Meta<typeof IdentifierDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Identifiers: Story = {
  render: () => (
    <div className="pv-stack">
      <IdentifierDisplay type="mrn" value="MRN-0048213" />
      <IdentifierDisplay type="ssn" value="123456789" revealable />
      <IdentifierDisplay type="member" value="XQK123456789" revealable label="Aetna member ID" />
      <IdentifierDisplay type="npi" value="1234567893" label="NPI (Dr. Priya Raman, Cardiology)" />
      <IdentifierDisplay type="npi" value="1234567890" label="NPI, mistyped" />
      <IdentifierDisplay type="dea" value="AB1234563" revealable />
    </div>
  ),
};

export const NoButtons: Story = { args: { type: 'mrn', value: 'MRN-100231', copyable: false, revealable: false } };
