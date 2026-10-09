import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { MAR, type MarRow } from './MAR';

const times = ['06:00', '08:00', '09:00', '12:00', '14:00', '18:00'];
const rows: MarRow[] = [
  {
    id: 'm1',
    med: 'metoprolol tartrate',
    dose: '25 mg',
    route: 'PO',
    freq: 'BID',
    type: 'scheduled',
    barcode: 'NDC0378-0018',
    slots: { '08:00': { status: 'Held', by: 'L. Chen RN', at: '08:05', reason: 'HR 54, provider notified' }, '18:00': { status: 'Scheduled' } },
  },
  {
    id: 'm2',
    med: 'cefTRIAXone',
    dose: '1 g',
    route: 'IV',
    freq: 'q24h',
    type: 'scheduled',
    barcode: 'NDC0409-7332',
    lateBy: '40 min',
    slots: { '09:00': { status: 'Late' } },
  },
  {
    id: 'm3',
    med: 'enoxaparin',
    dose: '40 mg',
    route: 'subcut',
    freq: 'daily',
    type: 'scheduled',
    barcode: 'NDC0075-0624',
    slots: { '09:00': { status: 'Given', by: 'L. Chen RN', at: '09:02' } },
  },
  {
    id: 'm4',
    med: 'insulin lispro (sliding scale)',
    dose: '4 units',
    route: 'subcut',
    freq: 'AC',
    type: 'scheduled',
    highAlert: true,
    barcode: 'NDC0002-7510',
    slots: {
      '12:00': { status: 'Due', value: { measure: 'glucose', v: 212 } },
      '08:00': { status: 'Given', by: 'L. Chen RN', at: '07:55', witness: 'R. Patel RN', value: { measure: 'glucose', v: 168 } },
    },
  },
  {
    id: 'm5',
    med: 'oxyCODONE',
    dose: '5 mg',
    route: 'PO',
    freq: 'q4h PRN pain 4 to 6',
    type: 'prn',
    barcode: 'NDC0406-0552',
    prnReason: 'Pain 6/10 right knee',
    reassess: '60 min',
    lastGiven: '08:10',
    slots: { '08:00': { status: 'Given', by: 'L. Chen RN', at: '08:10' }, '12:00': { status: 'Available' } },
  },
  {
    id: 'm6',
    med: 'ondansetron',
    dose: '4 mg',
    route: 'IV push',
    freq: 'q6h PRN nausea',
    type: 'prn',
    barcode: 'NDC0143-9890',
    slots: {
      '06:00': { status: 'Refused', by: 'J. Ortiz RN', at: '06:15', reason: 'Patient declined, nausea resolved' },
      '12:00': { status: 'Available' },
    },
  },
  {
    id: 'm7',
    med: 'heparin 25,000 units / 250 mL',
    dose: '18 units/kg/h',
    route: 'IV',
    freq: 'continuous, titrate per aPTT',
    type: 'continuous',
    highAlert: true,
    cosign: 'charge RN',
    rateMlH: 14,
    barcode: 'NDC63323-0047',
    slots: { '06:00': { status: 'Running', by: 'J. Ortiz RN', at: '06:00', witness: 'K. Wu RN' }, '12:00': { status: 'Due' } },
  },
  {
    id: 'm8',
    med: "lactated Ringer's",
    dose: '1,000 mL',
    route: 'IV',
    freq: 'continuous',
    type: 'continuous',
    rateMlH: 125,
    barcode: 'NDC0338-0117',
    slots: { '08:00': { status: 'Running', by: 'L. Chen RN', at: '08:00' } },
  },
];

const meta = {
  title: 'Complex/Inpatient nursing/MAR',
  component: MAR,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'MAR is the medication administration record: scheduled, PRN and continuous orders by time, with Given, Held, Refused, Late and Due states, a two-scan five rights check, a witness for high-alert drugs and co-sign. Select a Due, Late or PRN available cell to open the administer panel.',
      },
    },
  },
  argTypes: {
    defaultFilter: { control: 'inline-radio', options: ['all', 'scheduled', 'prn', 'continuous'] },
    rangeContext: { control: 'select', options: [undefined, 'outpatient', 'inpatient', 'ed', 'pediatric', 'pregnancy'] },
    readOnly: { control: 'boolean' },
  },
  args: {
    subtitle: '4 West . Bed 12 . Marcus Hill, 67 y . 82.0 kg . Allergy: penicillin (rash)',
    times,
    nowTime: '12:00',
    patientName: 'Marcus Hill',
    patientBarcode: 'MRN0048213',
    nurse: 'L. Chen RN',
    now: '12:04',
    rows,
    onRecord: fn(),
  },
} satisfies Meta<typeof MAR>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** All order types and every status. */
export const AllStatuses: Story = {};

/** Administer panel: high-alert insulin, both scans matched, witness still needed. */
export const HighAlertWitness: Story = {
  args: { title: 'MAR, 12:00 pass', subtitle: undefined, defaultActive: { row: 'm4', time: '12:00' }, defaultScans: { patient: true, med: true } },
};

/** Scan mismatch on a late antibiotic. */
export const ScanMismatch: Story = {
  args: {
    title: 'MAR, late dose',
    subtitle: undefined,
    defaultFilter: 'scheduled',
    defaultActive: { row: 'm2', time: '09:00' },
    defaultScans: { patient: true, med: false },
  },
};

/** PRN filter, waiting for scans. */
export const PrnWaiting: Story = {
  args: { title: 'MAR, PRN', subtitle: undefined, defaultFilter: 'prn', defaultActive: { row: 'm5', time: '12:00' } },
};

/** Continuous, read only (pharmacist view). */
export const ContinuousReadOnly: Story = {
  args: { title: 'MAR, infusions', subtitle: undefined, defaultFilter: 'continuous', readOnly: true },
};
