import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { OrderReconciliation, type TransferOrder } from './OrderReconciliation';

const orders: TransferOrder[] = [
  {
    type: 'Medications',
    name: 'Norepinephrine',
    dose: 0.04,
    unit: 'mcg/kg/min',
    detail: 'IV continuous, titrate to MAP 65 mmHg',
    notAllowedOn: ['medsurg', 'tele'],
    action: 'discontinue',
  },
  {
    type: 'Medications',
    name: 'Heparin',
    dose: 18,
    unit: 'units/kg/h',
    detail: 'IV continuous, aPTT protocol',
    notAllowedOn: ['medsurg'],
  },
  {
    type: 'Medications',
    name: 'Pantoprazole',
    dose: 40,
    unit: 'mg',
    detail: 'IV daily',
    action: 'modify',
  },
  {
    type: 'Medications',
    name: 'Ceftriaxone',
    dose: 2,
    unit: 'g',
    detail: 'IV q24h, day 3 of 7',
    action: 'continue',
  },
  {
    type: 'Nursing',
    name: 'Neuro checks',
    detail: 'q1h',
    notAllowedOn: ['medsurg', 'tele'],
  },
  { type: 'Nursing', name: 'Strict intake and output', action: 'continue' },
  { type: 'Labs', name: 'Basic metabolic panel', detail: 'Daily AM' },
];

const levels = ['icu', 'stepdown', 'tele', 'medsurg', 'obs', 'boarding', 'l-d', 'nicu', 'psych'];

const meta = {
  title: 'Complex/Inpatient flow/OrderReconciliation',
  component: OrderReconciliation,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'OrderReconciliation reviews every active order when a patient changes level of care, so orders that are not allowed on the new unit are stopped or changed before the transfer. Release Orders turns on only when every order is continued, changed or stopped.',
      },
    },
  },
  argTypes: {
    from: { control: 'select', options: levels },
    to: { control: 'select', options: levels },
    rangeContext: {
      control: 'select',
      options: [undefined, 'outpatient', 'inpatient', 'ed', 'pediatric', 'pregnancy'],
    },
  },
  args: {
    patient: 'Hassan, Omar · MICU 12 to 4 West',
    from: 'icu',
    to: 'medsurg',
    orders,
    onRelease: fn(),
  },
} satisfies Meta<typeof OrderReconciliation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: () => (
    <div className="pv-stack" style={{ gap: 16 }}>
      <OrderReconciliation patient="Hassan, Omar · MICU 12 to 4 West" from="icu" to="medsurg" orders={orders} />
      <OrderReconciliation
        patient="Brooks, Tyrone · DKA"
        from="stepdown"
        to="medsurg"
        orders={[
          {
            type: 'Medications',
            name: 'Insulin glargine',
            dose: 20,
            unit: 'units',
            detail: 'SubQ at bedtime',
            action: 'continue',
          },
          {
            type: 'Labs',
            name: 'Glucose, point of care',
            detail: 'AC and HS',
            action: 'continue',
          },
        ]}
      />
      <OrderReconciliation
        patient="Ruiz, Carmen"
        from="medsurg"
        to="icu"
        orders={[
          {
            type: 'Medications',
            name: 'Oxycodone',
            dose: 5,
            unit: 'mg',
            detail: 'PO q4h PRN pain',
            action: 'continue',
          },
        ]}
        readOnly
      />
    </div>
  ),
};

export const AllReviewed: Story = {
  args: {
    patient: 'Brooks, Tyrone · DKA',
    from: 'stepdown',
    to: 'medsurg',
    orders: [
      {
        type: 'Medications',
        name: 'Insulin glargine',
        dose: 20,
        unit: 'units',
        detail: 'SubQ at bedtime',
        action: 'continue',
      },
      {
        type: 'Labs',
        name: 'Glucose, point of care',
        detail: 'AC and HS',
        action: 'continue',
      },
    ],
  },
};
