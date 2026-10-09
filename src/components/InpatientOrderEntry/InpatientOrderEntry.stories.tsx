import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { InpatientOrderEntry } from './InpatientOrderEntry';

const meta = {
  title: 'Complex/Inpatient flow/InpatientOrderEntry',
  component: InpatientOrderEntry,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'InpatientOrderEntry writes one inpatient medication order with dose, route, frequency, duration, PRN reason and priority, shows the order sentence as it is built, and tracks pharmacist verification (draft, pending, verified, returned, override). A PRN order needs a reason before it can be signed.',
      },
    },
  },
  argTypes: {
    status: {
      control: 'inline-radio',
      options: ['draft', 'pending', 'verified', 'rejected', 'override'],
    },
    role: { control: 'inline-radio', options: ['prescriber', 'pharmacist'] },
    rangeContext: {
      control: 'select',
      options: [undefined, 'outpatient', 'inpatient', 'ed', 'pediatric', 'pregnancy'],
    },
  },
  args: {
    patient: 'Ruiz, Carmen · 81 y F · 4 West 404B · 52.4 kg',
    order: {
      name: 'Oxycodone',
      dose: 2.5,
      unit: 'mg',
      route: 'PO',
      freq: 'q4h',
      prn: true,
      maxDaily: 15,
      duration: '3 days',
    },
    showErrors: true,
    onSign: fn(),
    onVerify: fn(),
    onReturn: fn(),
    onCancel: fn(),
  },
} satisfies Meta<typeof InpatientOrderEntry>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: () => (
    <div className="pv-stack" style={{ gap: 16 }}>
      <InpatientOrderEntry
        patient="Ruiz, Carmen · 81 y F · 4 West 404B · 52.4 kg"
        order={{
          name: 'Oxycodone',
          dose: 2.5,
          unit: 'mg',
          route: 'PO',
          freq: 'q4h',
          prn: true,
          maxDaily: 15,
          duration: '3 days',
        }}
        showErrors
      />
      <InpatientOrderEntry
        patient="Nguyen, Bao · 54 y M"
        status="pending"
        role="pharmacist"
        order={{
          name: 'Vancomycin',
          dose: 1250,
          unit: 'mg',
          route: 'IV',
          freq: 'q12h',
          priority: 'now',
          duration: '7 days',
          weightBased: '15 mg/kg, 83 kg',
          warnings: [
            {
              tone: 'warning',
              title: 'Renal function',
              text: 'Creatinine 1.42 mg/dL (H), up from 0.98 mg/dL. Check a trough before the 4th dose.',
            },
          ],
        }}
      />
      <InpatientOrderEntry
        patient="Hassan, Omar"
        status="verified"
        verifiedBy="S. Ahmed, PharmD"
        verifiedAt="10/09 09:14"
        order={{
          name: 'Metoprolol tartrate',
          dose: 12.5,
          unit: 'mg',
          route: 'PO',
          freq: 'q6h',
          duration: 'Until discontinued',
        }}
        readOnly
      />
      <InpatientOrderEntry
        patient="Patel, Ravi"
        status="rejected"
        pharmacist="S. Ahmed, PharmD"
        pharmacistNote="Duplicate therapy: aspirin 325 mg already given in the ED. Change to 81 mg daily."
        order={{
          name: 'Aspirin',
          dose: 325,
          unit: 'mg',
          route: 'PO',
          freq: 'Daily',
        }}
      />
      <InpatientOrderEntry
        patient="Silva, Marisol"
        status="override"
        overrideBy="K. Moore, RN"
        order={{
          name: 'Nitroglycerin',
          dose: 0.4,
          unit: 'mg',
          route: 'SL',
          freq: 'Once',
          priority: 'stat',
          duration: 'Once',
        }}
      />
    </div>
  ),
};

export const PharmacistVerification: Story = {
  args: {
    patient: 'Nguyen, Bao · 54 y M',
    status: 'pending',
    role: 'pharmacist',
    showErrors: false,
    order: {
      name: 'Vancomycin',
      dose: 1250,
      unit: 'mg',
      route: 'IV',
      freq: 'q12h',
      priority: 'now',
      duration: '7 days',
      weightBased: '15 mg/kg, 83 kg',
      warnings: [
        {
          tone: 'warning',
          title: 'Renal function',
          text: 'Creatinine 1.42 mg/dL (H), up from 0.98 mg/dL. Check a trough before the 4th dose.',
        },
      ],
    },
  },
};

export const Stat: Story = {
  args: {
    patient: 'Silva, Marisol',
    showErrors: false,
    order: {
      name: 'Nitroglycerin',
      dose: 0.4,
      unit: 'mg',
      route: 'SL',
      freq: 'Once',
      priority: 'stat',
      duration: 'Once',
    },
  },
};
