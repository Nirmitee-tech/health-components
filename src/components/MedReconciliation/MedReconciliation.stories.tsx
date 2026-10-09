import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { MedReconciliation, type MedRecRow } from './MedReconciliation';

const rows: MedRecRow[] = [
  {
    home: {
      name: 'Metformin',
      dose: 1000,
      unit: 'mg',
      route: 'PO',
      freq: 'BID',
    },
    inpatient: {
      name: 'Insulin lispro',
      dose: 2,
      unit: 'units',
      route: 'SubQ',
      freq: 'AC and HS',
      prn: 'sliding scale',
    },
    note: 'Held: contrast on 10/07, creatinine 1.31 mg/dL',
    decision: 'continue',
  },
  {
    home: {
      name: 'Furosemide',
      dose: 20,
      unit: 'mg',
      route: 'PO',
      freq: 'Daily',
    },
    inpatient: {
      name: 'Furosemide',
      dose: 40,
      unit: 'mg',
      route: 'IV',
      freq: 'BID',
    },
    decision: 'modify',
    modified: {
      name: 'Furosemide',
      dose: 40,
      unit: 'mg',
      route: 'PO',
      freq: 'BID',
    },
  },
  {
    home: {
      name: 'Ibuprofen',
      dose: 400,
      unit: 'mg',
      route: 'PO',
      freq: 'q6h',
      prn: 'pain',
    },
    inpatient: null,
    decision: 'stop',
    stopReason: 'worsens heart failure',
  },
  {
    home: {
      name: 'Levothyroxine',
      dose: 0.075,
      unit: 'mg',
      route: 'PO',
      freq: 'Daily',
    },
    inpatient: {
      name: 'Levothyroxine',
      dose: 0.075,
      unit: 'mg',
      route: 'PO',
      freq: 'Daily',
    },
  },
  {
    home: null,
    inpatient: {
      name: 'Metoprolol succinate',
      dose: 25,
      unit: 'mg',
      route: 'PO',
      freq: 'Daily',
    },
  },
  {
    home: { name: 'Apixaban', dose: 5, unit: 'mg', route: 'PO', freq: 'BID' },
    inpatient: {
      name: 'Heparin',
      dose: 5000,
      unit: 'units',
      route: 'SubQ',
      freq: 'q8h',
    },
    note: 'Duplicate anticoagulation if both continue',
  },
];

const admission: MedRecRow[] = [
  {
    home: {
      name: 'Diltiazem ER',
      dose: 120,
      unit: 'mg',
      route: 'PO',
      freq: 'Daily',
    },
    inpatient: null,
  },
  {
    home: {
      name: 'Atorvastatin',
      dose: 40,
      unit: 'mg',
      route: 'PO',
      freq: 'At bedtime',
    },
    inpatient: null,
    decision: 'continue',
  },
];

const signed: MedRecRow[] = [
  {
    home: {
      name: 'Sertraline',
      dose: 50,
      unit: 'mg',
      route: 'PO',
      freq: 'Daily',
    },
    inpatient: {
      name: 'Sertraline',
      dose: 50,
      unit: 'mg',
      route: 'PO',
      freq: 'Daily',
    },
    decision: 'continue',
  },
];

const meta = {
  title: 'Complex/Inpatient flow/MedReconciliation',
  component: MedReconciliation,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'MedReconciliation lines up home, inpatient and discharge medicines row by row and asks for continue, modify or stop on each, and will not sign while any row has no decision. Each decision is a radio group: Tab reaches it, arrow keys change it.',
      },
    },
  },
  argTypes: {
    stage: { control: 'inline-radio', options: ['admission', 'discharge'] },
    rangeContext: {
      control: 'select',
      options: [undefined, 'outpatient', 'inpatient', 'ed', 'pediatric', 'pregnancy'],
    },
  },
  args: { patient: 'Okafor, Grace', rows, onSign: fn() },
} satisfies Meta<typeof MedReconciliation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: () => (
    <div className="pv-stack" style={{ gap: 16 }}>
      <MedReconciliation patient="Okafor, Grace" rows={rows} />
      <MedReconciliation
        stage="admission"
        patient="Hassan, Omar"
        source="Pharmacy fill history (Surescripts) and daughter"
        rows={admission}
      />
      <MedReconciliation patient="Lee, Daniel" readOnly signedBy="Dr. Ortiz, 10/09 15:10" rows={signed} />
    </div>
  ),
};

export const Admission: Story = {
  args: {
    stage: 'admission',
    patient: 'Hassan, Omar',
    source: 'Pharmacy fill history (Surescripts) and daughter',
    rows: admission,
  },
};

export const Signed: Story = {
  args: {
    patient: 'Lee, Daniel',
    readOnly: true,
    signedBy: 'Dr. Ortiz, 10/09 15:10',
    rows: signed,
  },
};
