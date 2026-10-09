import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { EligibilityResult } from './EligibilityResult';

const meta = {
  title: 'Complex/Revenue/EligibilityResult',
  component: EligibilityResult,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "EligibilityResult shows the payer's 271 answer: active with benefits, inactive, an AAA error with what it means and what to do, or waiting. Say what the AAA code means in plain words; never show raw X12 to front desk staff.",
      },
    },
  },
  argTypes: {
    state: { control: 'inline-radio', options: ['active', 'inactive', 'error', 'waiting'] },
    headline: { control: 'text' },
    aaa: { control: 'text' },
    meaning: { control: 'text' },
    todo: { control: 'text' },
  },
  args: {
    state: 'active',
    payer: 'Aetna',
    headline: 'Active: Aetna PPO',
    checkedAt: '10/09/2026 9:12 AM, 612 ms',
    benefits: [
      ['Copay, office visit', '$25'],
      ['Coinsurance', '20% after deductible'],
      ['Out of pocket max', '$4,000 ($1,610 met)'],
    ],
    deductible: [1180, 1500],
    onRerun: fn(),
    onFixCoverage: fn(),
    onSelfPay: fn(),
  },
} satisfies Meta<typeof EligibilityResult>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
    <div className="pv-grid">
      <EligibilityResult {...args} />
      <div className="pv-stack">
        <EligibilityResult
          state="error"
          payer="Aetna"
          aaa="72"
          headline="Invalid member ID"
          meaning="Aetna has no member with ID W12345678."
          todo="Check the card: Aetna IDs start with W and have 9 digits. Fix it and Re-run."
        />
        <EligibilityResult state="waiting" payer="Aetna" />
      </div>
    </div>
  ),
};

export const Inactive: Story = {
  args: {
    state: 'inactive',
    headline: 'Coverage ended 06/30/2026',
    meaning: 'Aetna shows this plan ended on 06/30/2026.',
    todo: 'Ask the patient for a new card, or offer a Good Faith Estimate.',
    benefits: undefined,
    deductible: undefined,
  },
};

export const Waiting: Story = { args: { state: 'waiting', payer: 'BCBS IL' } };
