import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { OrderSetPicker, type OrderSet } from './OrderSetPicker';

const sets: OrderSet[] = [
  {
    name: 'Diabetes follow-up',
    items: [
      { name: 'Hemoglobin A1c', type: 'Lab', detail: 'LOINC 4548-4' },
      { name: 'Comprehensive metabolic panel', type: 'Lab' },
      { name: 'Urine albumin/creatinine ratio', type: 'Lab' },
      { name: 'Diabetic eye exam referral', type: 'Referral', default: false },
      { name: 'Metformin 500 mg renew', type: 'Medication' },
    ],
  },
  {
    name: 'Prenatal first visit',
    items: [
      { name: 'Prenatal panel', type: 'Lab' },
      { name: 'OB ultrasound', type: 'Imaging' },
    ],
  },
];

const meta = {
  title: 'Complex/Orders and notes/OrderSetPicker',
  component: OrderSetPicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'OrderSetPicker shows order sets as tabs and lets the provider tick the labs, imaging, meds and referrals to sign together. Ticks are kept per set while switching tabs; Sign Orders passes the ticked items to `onSign`.',
      },
    },
  },
  argTypes: { subtitle: { control: 'text' } },
  args: { sets, subtitle: 'Ralph Edwards . Family Medicine', onSign: fn(), onCurrentChange: fn() },
} satisfies Meta<typeof OrderSetPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const SecondSet: Story = { args: { defaultCurrent: 1 } };
