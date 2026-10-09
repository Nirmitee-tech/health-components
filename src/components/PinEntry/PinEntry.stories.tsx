import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { PinEntry } from './PinEntry';

const meta = {
  title: 'Basic/Inputs/PinEntry',
  component: PinEntry,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'PinEntry is a 4 to 6 digit keypad with dots, for mobile sign-in and quick re-authentication. Dots have role status ("2 of 4 digits entered"); keys are 56px tall, above the 44px touch minimum. A hardware keyboard works too.',
      },
    },
  },
  argTypes: { length: { control: { type: 'number', min: 4, max: 6 } } },
  args: { label: 'Enter your PIN', onComplete: fn(), onBiometric: fn(), onChange: fn() },
} satisfies Meta<typeof PinEntry>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { biometric: true } };

export const Showcase: Story = {
  render: () => (
    <div className="co-row" style={{ alignItems: 'flex-start', gap: 32 }}>
      <PinEntry label="Enter your PIN" defaultValue="12" biometric />
      <PinEntry label="Confirm your PIN" defaultValue="4821" error="Wrong PIN. 2 tries left." />
    </div>
  ),
};

export const SixDigits: Story = { args: { length: 6, label: 'Enter your 6-digit PIN', defaultValue: '381' } };

export const WithError: Story = { args: { defaultValue: '4821', error: 'Wrong PIN. 2 tries left.' } };

export const Locked: Story = { args: { locked: true, error: 'Wrong PIN. No tries left.', defaultValue: '' } };
