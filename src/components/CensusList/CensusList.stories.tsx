import type { Meta, StoryObj } from '@storybook/react-vite';
import { CensusList, type CensusRow } from './CensusList';

const rows: CensusRow[] = [
  {
    bed: '401A',
    name: 'Okafor, Grace',
    mrn: '40007719',
    age: 67,
    sex: 'F',
    dx: 'CHF exacerbation',
    level: 'medsurg',
    los: 3,
    gmlos: 3.6,
    vitals: [
      { measure: 'hr', value: 88 },
      { measure: 'spo2', value: 93 },
      { measure: 'temp', value: 36.8 },
    ],
    isolation: 'contact',
    organism: 'MRSA',
    attending: 'Raman',
    edd: '14:00',
    dischargeToday: true,
  },
  {
    bed: '402A',
    name: 'Nguyen, Bao',
    mrn: '40019903',
    age: 54,
    sex: 'M',
    dx: 'Cellulitis, left leg',
    level: 'medsurg',
    los: 6,
    gmlos: 3.9,
    vitals: [
      { measure: 'hr', value: 104 },
      { measure: 'temp', value: 38.6 },
      { measure: 'sbp', value: 112 },
    ],
    isolation: 'contact',
    attending: 'Raman',
    edd: '10/11',
  },
  {
    bed: '510A',
    name: 'Hassan, Omar',
    mrn: '40021345',
    age: 72,
    sex: 'M',
    dx: 'New atrial fibrillation',
    level: 'tele',
    los: 1,
    gmlos: 2.8,
    vitals: [
      { measure: 'hr', value: 132 },
      { measure: 'sbp', value: 96 },
    ],
    attending: 'Feld',
    edd: '10/10',
  },
  {
    bed: 'ED 7',
    name: 'Silva, Marisol',
    mrn: '40018822',
    age: 61,
    sex: 'F',
    dx: 'NSTEMI',
    level: 'boarding',
    pendingTo: 'tele',
    los: 0,
    gmlos: 3.2,
    vitals: [
      { measure: 'hr', value: 78 },
      { measure: 'sbp', value: 148 },
    ],
    attending: 'Feld',
    edd: '--',
  },
  {
    bed: 'OBS 3',
    name: 'Lee, Daniel',
    mrn: '40023310',
    age: 29,
    sex: 'M',
    dx: 'Syncope',
    level: 'obs',
    los: 0,
    gmlos: 1,
    vitals: [
      { measure: 'hr', value: 62 },
      { measure: 'sbp', value: 118 },
    ],
    attending: 'Ortiz',
    edd: 'Today 17:00',
    dischargeToday: true,
  },
  {
    bed: '403A',
    name: 'Kowalski, Anna',
    mrn: '40023377',
    age: 34,
    sex: 'F',
    dx: 'Cavitary lesion, rule out TB',
    level: 'medsurg',
    los: 0,
    gmlos: 4.4,
    vitals: [
      { measure: 'spo2', value: 86 },
      { measure: 'rr', value: 26 },
      { measure: 'temp', value: 38.1 },
    ],
    isolation: 'airborne',
    organism: 'TB rule-out',
    attending: 'Raman',
    edd: '--',
  },
];

const meta = {
  title: 'Complex/Inpatient flow/CensusList',
  component: CensusList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'CensusList is the unit or service list of current inpatients with bed, level of care, length of stay against the expected stay, last vitals with flags, isolation and expected discharge. Flags come from the shared reference ranges in the `inpatient` context unless `rangeContext` or a provider says otherwise.',
      },
    },
  },
  argTypes: {
    defaultFilter: {
      control: 'inline-radio',
      options: ['all', 'dc', 'iso', 'flag', 'obs'],
    },
    rangeContext: {
      control: 'select',
      options: [undefined, 'outpatient', 'inpatient', 'ed', 'pediatric', 'pregnancy'],
    },
  },
  args: { rows, subtitle: 'Hospital Medicine, Team B · 6 patients' },
} satisfies Meta<typeof CensusList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: () => (
    <div className="pv-stack" style={{ gap: 16 }}>
      <CensusList rows={rows} subtitle="Hospital Medicine, Team B · 6 patients" />
      <CensusList rows={rows} defaultFilter="flag" title="Census, critical vitals filter" />
      <CensusList rows={[]} title="Census, loading" loading />
      <CensusList rows={rows.slice(2, 3)} defaultFilter="iso" title="Census, no matches" />
    </div>
  ),
};

export const CriticalVitals: Story = {
  args: { defaultFilter: 'flag', title: 'Census, critical vitals filter' },
};

export const Loading: Story = {
  args: { rows: [], loading: true, title: 'Census, loading' },
};

export const NoMatches: Story = {
  args: {
    rows: rows.slice(2, 3),
    defaultFilter: 'iso',
    title: 'Census, no matches',
  },
};
