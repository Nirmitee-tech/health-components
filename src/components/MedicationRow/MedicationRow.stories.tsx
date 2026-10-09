import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { MedicationRow } from './MedicationRow';

const meta = {
  title: 'Complex/Medications/MedicationRow',
  component: MedicationRow,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'MedicationRow is one medication: name and strength, sig, quantity, refills, prescriber, pharmacy, last fill, and the DEA schedule tag for controlled drugs (C-II to C-V). It renders an `<li>`, so place it inside `<ul className="co-list">`.',
      },
    },
  },
  decorators: [
    (Story) => (
      <ul className="co-list">
        <Story />
      </ul>
    ),
  ],
  args: {
    med: {
      name: 'Oxycodone 5 mg tablet',
      sig: 'Take 1 tablet by mouth every 6 hours as needed for severe pain',
      qty: 20,
      refills: 0,
      schedule: 'C-II',
      prn: true,
      prescriber: 'Tom Reyes DPT',
      pharmacy: 'Walgreens #10233',
    },
    onAction: fn(),
  },
} satisfies Meta<typeof MedicationRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <>
      <MedicationRow
        med={{
          name: 'Oxycodone 5 mg tablet',
          sig: 'Take 1 tablet by mouth every 6 hours as needed for severe pain',
          qty: 20,
          refills: 0,
          schedule: 'C-II',
          prn: true,
          prescriber: 'Tom Reyes DPT',
          pharmacy: 'Walgreens #10233',
        }}
      />
      <MedicationRow
        med={{
          name: 'Lorazepam 0.5 mg tablet',
          sig: 'Take 1 tablet by mouth at bedtime as needed for anxiety',
          qty: 15,
          refills: 1,
          schedule: 'C-IV',
          prescriber: 'Priya Shah MD',
        }}
      />
      <MedicationRow
        med={{
          name: 'Metformin 500 mg tablet',
          sig: 'Take 1 tablet by mouth twice daily with meals',
          qty: 180,
          refills: 3,
          prescriber: 'James Bell MD',
          last: '09/12/2026',
          source: 'Surescripts',
        }}
      />
      <MedicationRow
        med={{
          name: 'Lisinopril 10 mg tablet',
          sig: 'Take 1 tablet by mouth once daily',
          qty: 90,
          refills: 0,
          status: 'discontinued',
        }}
      />
    </>
  ),
};

export const Discontinued: Story = {
  args: {
    med: { name: 'Lisinopril 10 mg tablet', sig: 'Take 1 tablet by mouth once daily', qty: 90, refills: 0, status: 'discontinued' },
  },
};

export const WithoutActions: Story = { args: { actions: false } };
