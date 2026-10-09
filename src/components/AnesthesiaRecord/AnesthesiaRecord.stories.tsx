import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { RANGE_CONTEXTS } from '../../clinical';
import { AnesthesiaRecord, type AnesthesiaRecordProps } from './AnesthesiaRecord';

const t = ['08:00', '08:05', '08:10', '08:15', '08:20', '08:25', '08:30', '08:35'];
const chole = {
  subtitle: 'OR 1 . George Miller, 64 y M . Lap cholecystectomy . GETA',
  times: t,
  vitals: {
    hr: [82, 96, 74, 70, 68, 72, 76, 78],
    bp: [[138, 84], [150, 92], [104, 62], [98, 58], [86, 50], [112, 68], [118, 70], [122, 74]],
    map: [102, 111, 76, 71, 62, 83, 86, 90],
    spo2: [99, 100, 100, 99, 99, 100, 99, 99],
    etco2: [null, 36, 38, 40, 41, 39, 38, 37],
    temp: [36.6, 36.5, 36.4, 36.3, 36.2, 36.2, 36.1, 36.1],
  },
  events: [
    { time: '08:05', label: 'Induction' },
    { time: '08:15', label: 'Incision' },
  ],
  meds: [
    { time: '08:04', drug: 'Midazolam', dose: 2, unit: 'mg', route: 'IV', controlled: 'C-IV' },
    { time: '08:05', drug: 'Fentanyl', dose: 100, unit: 'mcg', route: 'IV', controlled: 'C-II' },
    { time: '08:05', drug: 'Propofol', dose: 150, unit: 'mg', route: 'IV' },
    { time: '08:06', drug: 'Rocuronium', dose: 50, unit: 'mg', route: 'IV' },
    { time: '08:10', drug: 'Cefazolin', dose: 2, unit: 'g', route: 'IV' },
    { time: '08:20', drug: 'Phenylephrine', dose: 100, unit: 'mcg', route: 'IV' },
    { time: '08:30', drug: 'Ondansetron', dose: 4, unit: 'mg', route: 'IV' },
  ],
  airway: {
    device: 'Endotracheal tube, cuffed',
    size: 7.5,
    view: 'Cormack-Lehane grade 1, video laryngoscope',
    attempts: 1,
    depth: 22,
    confirm: 'EtCO2 waveform and bilateral breath sounds',
  },
  totals: { fluids: 1200, ebl: 150, urine: 220 },
  alert: { title: 'Hypotension 08:20', body: 'MAP 62 mmHg. Phenylephrine 100 mcg IV given.' },
} satisfies AnesthesiaRecordProps;
const mac = {
  subtitle: 'Procedure room 2 . Mei Lin, 38 y F . Hysteroscopy . MAC . signed',
  readOnly: true,
  times: ['09:00', '09:05', '09:10'],
  vitals: { hr: [74, 70, null], bp: [[124, 78], [118, 72], null], spo2: [98, 97, 98] },
  meds: [{ time: '09:01', drug: 'Propofol infusion', dose: 75, unit: 'mcg/kg/min', route: 'IV' }],
  totals: { fluids: 400, ebl: 20 },
} satisfies AnesthesiaRecordProps;

const meta = {
  title: 'Complex/ED & periop/AnesthesiaRecord',
  component: AnesthesiaRecord,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'AnesthesiaRecord is the intraoperative record: vitals every 5 minutes as a trend and a grid, case events, medications given, airway details and fluid totals. The trend is a plain SVG with an accessible summary; every grid value flags against the shared reference ranges.',
      },
    },
  },
  argTypes: { rangeContext: { control: 'select', options: [undefined, ...RANGE_CONTEXTS] } },
  args: { ...chole, onAddEvent: fn(), onGiveMedication: fn() },
} satisfies Meta<typeof AnesthesiaRecord>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: () => (
    <div className="pv-stack">
      <AnesthesiaRecord {...chole} />
      <AnesthesiaRecord {...mac} />
    </div>
  ),
};

export const SignedMAC: Story = { args: { ...mac, events: undefined, airway: undefined, alert: undefined } };
