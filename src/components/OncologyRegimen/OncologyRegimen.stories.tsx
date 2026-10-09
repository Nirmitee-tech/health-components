import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { OncologyRegimen, type OncologyRegimenDef, type RegimenCycle } from './OncologyRegimen';

const folfox: OncologyRegimenDef = {
  name: 'mFOLFOX6',
  intent: 'Adjuvant, colon cancer stage III',
  cycleDays: 14,
  cycles: 12,
  hold: { anc: 1.5, plt: 75 },
  drugs: [
    { name: 'Oxaliplatin', route: 'IV', days: 'D1', mgm2: 85 },
    { name: 'Leucovorin', route: 'IV', days: 'D1', mgm2: 400 },
    { name: 'Fluorouracil bolus', route: 'IV push', days: 'D1', mgm2: 400 },
    { name: 'Fluorouracil infusion', route: 'CIV 46 h', days: 'D1-2', mgm2: 2400 },
  ],
};
const cyc: RegimenCycle[] = [
  { n: 1, date: '07/06', status: 'given' },
  { n: 2, date: '07/20', status: 'given' },
  { n: 3, date: '08/03', status: 'given' },
  { n: 4, date: '08/17', status: 'delayed' },
  { n: 5, date: '08/24', status: 'given', reduction: 20 },
  { n: 6, date: '09/07', status: 'given', reduction: 20 },
  { n: 7, date: '10/09', status: 'current', reduction: 20, labsDate: '10/08', labs: { anc: 2.1, plt: 142, hgb: 11.2, cr: 0.84 } },
  { n: 8, date: '10/23', status: 'planned' },
  { n: 9, date: '11/06', status: 'planned' },
];
const held: RegimenCycle[] = cyc.slice(0, 6).concat([
  { n: 7, date: '10/09', status: 'current', labsDate: '10/08', labs: { anc: 0.9, plt: 68, hgb: 9.4, cr: 1.31 } },
  { n: 8, date: '10/23', status: 'planned' },
]);
const ac: OncologyRegimenDef = {
  name: 'AC then T (dose-dense)',
  intent: 'Neoadjuvant, breast cancer',
  cycleDays: 14,
  cycles: 8,
  bsaCap: 2.0,
  hold: { anc: 1.0, plt: 100 },
  drugs: [
    { name: 'Doxorubicin', route: 'IV', days: 'D1', mgm2: 60 },
    { name: 'Cyclophosphamide', route: 'IV', days: 'D1', mgm2: 600 },
    { name: 'Pegfilgrastim', route: 'SC', days: 'D2', flat: 6 },
  ],
};

const meta = {
  title: 'Complex/Specialty/OncologyRegimen',
  component: OncologyRegimen,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'OncologyRegimen tracks a chemotherapy regimen cycle by cycle, with BSA-based doses, dose reductions, pre-cycle labs against hold rules and lifetime cumulative doses.',
      },
    },
  },
  argTypes: {
    rangeContext: { control: 'select', options: [undefined, 'outpatient', 'inpatient', 'ed', 'pediatric', 'pregnancy'] },
    readOnly: { control: 'boolean' },
  },
  args: {
    regimen: folfox,
    patient: { heightCm: 172, weightKg: 68.5, weightChange: -4 },
    cycles: cyc,
    onHoldCycle: fn(),
    onRelease: fn(),
  },
} satisfies Meta<typeof OncologyRegimen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** On schedule with a 20% reduction. */
export const Playground: Story = {};

/** Hold criteria met, release blocked. */
export const HoldCriteriaMet: Story = { args: { patient: { heightCm: 172, weightKg: 66.1, weightChange: -11 }, cycles: held } };

/** BSA capped, cumulative anthracycline, read-only. */
export const BsaCappedCumulative: Story = {
  args: {
    readOnly: true,
    regimen: ac,
    patient: { heightCm: 183, weightKg: 112 },
    cycles: [
      { n: 1, date: '09/01', status: 'given' },
      { n: 2, date: '09/15', status: 'given' },
      { n: 3, date: '09/29', status: 'held' },
      { n: 4, date: '10/09', status: 'current', labsDate: '10/09', labs: { anc: 3.4, plt: 210, hgb: 10.8, cr: 0.71 } },
    ],
    cumulative: [{ drug: 'doxorubicin', given: 380, limit: 450, note: 'Includes 200 mg/m² from 2019 treatment. Echo before cycle 4: LVEF 58%.' }],
  },
};
