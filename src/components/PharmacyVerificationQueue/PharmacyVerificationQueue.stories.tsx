import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { RANGE_CONTEXTS } from '../../clinical';
import { PharmacyVerificationQueue, type PharmacyOrder } from './PharmacyVerificationQueue';

const orders: PharmacyOrder[] = [
  {
    id: 'o1',
    drug: 'Vancomycin 1,500 mg IV',
    sig: 'IV every 12 hours',
    patient: 'Ralph Edwards',
    unit: '4 West 12',
    age: '74 y',
    prescriber: 'Ana Ruiz MD',
    ordered: '10/09 08:10',
    indication: 'MRSA bacteremia',
    status: 'pending',
    weight: 86.1,
    scr: 1.62,
    crcl: 41,
    dosePerKg: { amount: 1500, unit: 'mg', per: 'dose', min: 15, max: 20, hardMax: 30 },
    alerts: [{ severity: 'moderate', title: 'Renal function', detail: 'CrCl 41 mL/min. Consider every 24 hours and a trough before the 4th dose.' }],
  },
  {
    id: 'o2',
    drug: 'Acetaminophen 480 mg PO',
    sig: 'Every 6 hours as needed for fever',
    patient: 'Maya Ortiz',
    unit: 'Peds 3',
    age: '4 y',
    prescriber: 'Kim Lee MD',
    ordered: '10/09 08:40',
    status: 'pending',
    stat: true,
    weight: 16.2,
    dosePerKg: { amount: 480, unit: 'mg', per: 'dose', min: 10, max: 15, hardMax: 20 },
  },
  {
    id: 'o3',
    drug: 'Morphine 4 mg IV',
    sig: 'Every 4 hours as needed for pain',
    patient: 'Henna West',
    unit: 'L&D 2',
    age: '38 y',
    prescriber: 'Sara Ito MD',
    ordered: '10/09 07:55',
    status: 'pending',
    schedule: 'C-II',
    k: 4.1,
    alerts: [{ severity: 'major', title: 'Interaction with lorazepam', detail: 'Opioid plus benzodiazepine: respiratory depression.' }],
  },
  {
    id: 'o4',
    drug: 'Potassium chloride 20 mEq PO',
    sig: 'Twice daily',
    patient: 'Tom Price',
    unit: 'Onc 7',
    age: '61 y',
    prescriber: 'Ana Ruiz MD',
    ordered: '10/09 06:30',
    status: 'clarify',
    k: 5.4,
    scr: 1.1,
  },
  {
    id: 'o5',
    drug: 'Ceftriaxone 1 g IV',
    sig: 'Every 24 hours',
    patient: 'Maria Gomez',
    unit: '4 West 3',
    age: '52 y',
    prescriber: 'James Bell MD',
    ordered: '10/09 06:00',
    status: 'verified',
    by: 'R. Patel PharmD',
  },
];

const meta = {
  title: 'Complex/Chart panels/PharmacyVerificationQueue',
  component: PharmacyVerificationQueue,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'PharmacyVerificationQueue is the pharmacist queue: orders on the left (a listbox: Up, Down, Home, End), the selected order on the right with weight, renal function, potassium, a weight-based dose check and interaction alerts, then Verify, Clarify or Reject. Verify is blocked above the hard dose limit.',
      },
    },
  },
  argTypes: {
    defaultFilter: { control: 'inline-radio', options: ['pending', 'clarify', 'all'] },
    rangeContext: { control: 'select', options: [undefined, ...RANGE_CONTEXTS] },
  },
  args: { orders, oldest: '42 min', onStatusChange: fn(), onSelectedChange: fn(), onFilterChange: fn() },
} satisfies Meta<typeof PharmacyVerificationQueue>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: (args) => (
    <div className="co-dt">
      <PharmacyVerificationQueue {...args} />
      <PharmacyVerificationQueue orders={orders} defaultSelected="o2" />
      <PharmacyVerificationQueue orders={[]} />
    </div>
  ),
};

export const DoseAboveHardLimit: Story = { args: { defaultSelected: 'o2' } };

export const AllOrders: Story = { args: { defaultFilter: 'all', defaultSelected: 'o5' } };

export const Empty: Story = { args: { orders: [], oldest: undefined } };
