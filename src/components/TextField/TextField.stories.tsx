import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { iconNames } from '../Icon/paths';
import { TextField } from './TextField';

const meta = {
  title: 'Basic/Inputs/TextField',
  component: TextField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'TextField is a labelled one-line input with masks for phone, SSN, NPI, ZIP and EIN, plus error, helper, required and read-only lock states. A mask only arranges digits into the pattern; it proves the shape, not that the number is real.',
      },
    },
  },
  argTypes: {
    mask: { control: 'select', options: [undefined, 'phone', 'ssn', 'npi', 'zip', 'ein', 'date'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    iconLeft: { control: 'select', options: [undefined, ...iconNames] },
  },
  args: { label: 'Mobile Phone', mask: 'phone', required: true, onChange: fn() },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { defaultValue: '3125550142' } };

export const Showcase: Story = {
  render: () => (
    <div className="pv-grid">
      <TextField label="Mobile Phone" mask="phone" required defaultValue="3125550142" />
      <TextField label="Social Security Number" mask="ssn" defaultValue="123456789" helper="Optional. Shown as ***-**-6789 after save." />
      <TextField label="Rendering Provider NPI" mask="npi" required defaultValue="12345" error="NPI must be 10 digits. You entered 5." />
      <TextField label="ZIP Code" mask="zip" defaultValue="606141234" />
      <TextField label="Tax ID (EIN)" mask="ein" defaultValue="361234567" />
      <TextField label="Member ID" defaultValue="W123456789" readOnly />
      <TextField label="Search patients" iconLeft="search" placeholder="Name, MRN or DOB" />
      <TextField label="Units" defaultValue="2" suffix="units" size="sm" />
      <TextField label="Last Name" size="lg" defaultValue="West" required />
    </div>
  ),
};

export const Masks: Story = {
  render: () => (
    <div className="pv-grid">
      <TextField label="Home Phone" mask="phone" />
      <TextField label="SSN" mask="ssn" />
      <TextField label="Referring NPI" mask="npi" />
      <TextField label="ZIP Code" mask="zip" />
      <TextField label="Group EIN" mask="ein" />
      <TextField label="Date of Injury" mask="date" />
    </div>
  ),
};

export const WithError: Story = {
  args: { label: 'Rendering Provider NPI', mask: 'npi', defaultValue: '12345', error: 'NPI must be 10 digits. You entered 5.' },
};

export const ReadOnly: Story = { args: { label: 'Member ID', mask: undefined, required: false, defaultValue: 'W123456789', readOnly: true } };

export const Sizes: Story = {
  render: () => (
    <div className="pv-grid">
      <TextField label="Units" size="sm" defaultValue="2" suffix="units" />
      <TextField label="Policy Number" defaultValue="BCB-998812" />
      <TextField label="Last Name" size="lg" defaultValue="West" />
    </div>
  ),
};
