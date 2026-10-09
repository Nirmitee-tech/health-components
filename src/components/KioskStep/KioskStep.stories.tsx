import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { TextField } from '../TextField/TextField';
import { KioskStep } from './KioskStep';

const meta = {
  title: 'Complex/Mobile and kiosk/KioskStep',
  component: KioskStep,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'KioskStep is one step of front-desk tablet check-in: kiosk header with Help, step segments, big title, content and large Back and Continue buttons. The first step has no Back.',
      },
    },
  },
  argTypes: {
    step: { control: { type: 'number', min: 1, max: 6 } },
    total: { control: { type: 'number', min: 2, max: 10 } },
    stepName: { control: 'text' },
    title: { control: 'text' },
    subtitle: { control: 'text' },
    practice: { control: 'text' },
    nextLabel: { control: 'text' },
  },
  args: {
    step: 1,
    total: 6,
    stepName: 'Find appointment',
    title: 'Find your appointment',
    subtitle: 'Enter your last name and date of birth. We only show appointments booked for today, Oct 9, 2026.',
    onBack: fn(),
    onNext: fn(),
    onHelp: fn(),
    children: (
      <div className="pv-grid">
        <TextField label="Last name" size="lg" required defaultValue="West" />
        <TextField label="Date of birth" size="lg" mask="date" required defaultValue="03141988" />
      </div>
    ),
  },
} satisfies Meta<typeof KioskStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {};

export const MiddleStep: Story = {
  args: {
    step: 3,
    stepName: 'Confirm insurance',
    title: 'Is this still your insurance?',
    subtitle: 'Aetna PPO . Member ID W123456789',
    nextLabel: 'Yes, Continue',
    children: null,
  },
};

export const NextDisabled: Story = {
  args: {
    nextDisabled: true,
    children: (
      <div className="pv-grid">
        <TextField label="Last name" size="lg" required />
        <TextField label="Date of birth" size="lg" mask="date" required />
      </div>
    ),
  },
};
