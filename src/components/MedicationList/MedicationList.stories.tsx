import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import type { Medication } from '../MedicationRow/MedicationRow';
import { MedicationList } from './MedicationList';

const meds: Medication[] = [
  { name: 'Metformin 500 mg tablet', sig: 'Take 1 tablet by mouth twice daily with meals', qty: 180, refills: 3, prescriber: 'James Bell MD' },
  { name: 'Sertraline 50 mg tablet', sig: 'Take 1 tablet by mouth once daily', qty: 30, refills: 5, prescriber: 'Priya Shah MD' },
  { name: 'Albuterol HFA 90 mcg', sig: 'Inhale 2 puffs every 4 hours as needed for wheeze', qty: 1, refills: 2, prn: true },
];

const meta = {
  title: 'Complex/Medications/MedicationList',
  component: MedicationList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'MedicationList is the Medications card with reconciliation status, Reconcile and Prescribe, made of MedicationRows.',
      },
    },
  },
  argTypes: { reconciled: { control: 'text' } },
  args: {
    items: meds,
    reconciled: '10/09/2026 by James Bell MD',
    onReconcile: fn(),
    onPrescribe: fn(),
    onItemAction: fn(),
  },
} satisfies Meta<typeof MedicationList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const NotReconciled: Story = { args: { reconciled: undefined } };

export const WithControlledSubstance: Story = {
  args: {
    items: [
      ...meds,
      {
        name: 'Oxycodone 5 mg tablet',
        sig: 'Take 1 tablet by mouth every 6 hours as needed for severe pain',
        qty: 20,
        refills: 0,
        schedule: 'C-II',
        prn: true,
        prescriber: 'Tom Reyes DPT',
        pharmacy: 'Walgreens #10233',
      },
    ],
  },
};

export const ReadOnly: Story = { args: { readOnly: true } };
