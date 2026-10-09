import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SignaturePad } from './SignaturePad';

const meta = {
  title: 'Basic/Inputs/SignaturePad',
  component: SignaturePad,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'SignaturePad captures a patient or provider signature on consent forms, check-in and note signing. The pad is a button named "Tap to sign as Henna West", so it works without drawing.',
      },
    },
  },
  args: { label: 'Patient Signature', name: 'Henna West', onSign: fn(), onClear: fn() },
} satisfies Meta<typeof SignaturePad>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { required: true } };

export const Showcase: Story = {
  render: () => (
    <div className="pv-grid">
      <SignaturePad label="Patient Signature" name="Henna West" required />
      <SignaturePad label="Patient Signature" name="Henna West" defaultSigned when="10/09/2026 10:42 AM" />
      <SignaturePad label="Guardian Signature" compact error="Signature is required to continue." />
    </div>
  ),
};

export const Signed: Story = { args: { defaultSigned: true, when: '10/09/2026 10:42 AM' } };

export const CompactWithError: Story = {
  args: { label: 'Guardian Signature', name: undefined, compact: true, error: 'Signature is required to continue.' },
};
