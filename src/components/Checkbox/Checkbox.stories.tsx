import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Basic/Selection/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Checkbox turns one option on or off, alone or in a list; it also has an indeterminate state for select-all. The native input sits inside its label, so the whole row is clickable.',
      },
    },
  },
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
  },
  args: { label: 'Send reminder by SMS', onChange: fn() },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { defaultChecked: true } };

export const Showcase: Story = {
  render: () => (
    <div className="pv-grid">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Checkbox label="Send reminder by SMS" defaultChecked />
        <Checkbox label="Send reminder by email" />
        <Checkbox label="Select all claims on this page" indeterminate />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Checkbox
          label="Patient declined to give race"
          description="Recorded as Declined to Specify for USCDI."
        />
        <Checkbox label="Override eligibility (Super Admin only)" disabled />
      </div>
    </div>
  ),
};

export const Indeterminate: Story = { args: { label: 'Select all claims on this page', indeterminate: true } };

export const WithDescription: Story = {
  args: { label: 'Patient declined to give race', description: 'Recorded as Declined to Specify for USCDI.' },
};

export const Disabled: Story = { args: { label: 'Override eligibility (Super Admin only)', disabled: true } };

export const Invalid: Story = { args: { label: 'I confirm the patient consented to telehealth', error: true, required: true } };
