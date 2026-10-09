import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { PrenatalFlowsheet, type PrenatalHeader, type PrenatalVisit } from './PrenatalFlowsheet';

const hd: PrenatalHeader = {
  edd: '01/14/2027',
  eddBy: '8w ultrasound',
  gp: 'G2 P1001',
  blood: 'O negative, antibody screen neg',
  rubella: 'Immune',
  gbs: 'Pending (36w)',
  bmi: 27.4,
  risks: ['Rh negative: RhIG at 28w', 'Prior cesarean'],
};
const v: PrenatalVisit[] = [
  { date: '06/02/2026', ga: [8, 1], wt: 68.2, sbp: 112, dbp: 70, protein: 'neg', glucose: 'neg', fh: null, fhr: null, by: 'K. Adams, CNM' },
  { date: '07/07/2026', ga: [13, 1], wt: 68.9, sbp: 116, dbp: 72, protein: 'neg', glucose: 'neg', fh: null, fhr: 156, by: 'K. Adams, CNM' },
  { date: '08/18/2026', ga: [19, 1], wt: 70.1, sbp: 118, dbp: 76, protein: 'trace', glucose: 'neg', fh: null, fhr: 150, fm: 'Yes', by: 'K. Adams, CNM' },
  { date: '09/15/2026', ga: [23, 1], wt: 71.0, sbp: 124, dbp: 78, protein: 'neg', glucose: '1+', fh: 23, fhr: 146, fm: 'Yes', edema: 'None', by: 'R. Shah, MD' },
  { date: '10/09/2026', ga: [26, 4], wt: 72.8, sbp: 144, dbp: 92, protein: '1+', glucose: 'neg', fh: 29, fhr: 142, fm: 'Yes', pres: 'Variable', edema: '1+ ankles', by: 'R. Shah, MD' },
];
const sev: PrenatalVisit[] = v.slice(0, 4).concat([
  { date: '10/09/2026', ga: [34, 2], wt: 79.6, sbp: 164, dbp: 112, protein: '3+', glucose: 'neg', fh: 31, fhr: 96, fm: 'Decreased', pres: 'Vertex', edema: '2+ hands, face', by: 'R. Shah, MD' },
]);

const meta = {
  title: 'Complex/Specialty/PrenatalFlowsheet',
  component: PrenatalFlowsheet,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'PrenatalFlowsheet tracks every prenatal visit in one table, gestational age, weight, blood pressure, urine, fundal height and fetal heart rate, with flags for hypertension, size and dates mismatch and abnormal heart rate.',
      },
    },
  },
  argTypes: {
    rangeContext: { control: 'select', options: [undefined, 'outpatient', 'inpatient', 'ed', 'pediatric', 'pregnancy'] },
    readOnly: { control: 'boolean' },
    title: { control: 'text' },
    subtitle: { control: 'text' },
  },
  args: { subtitle: 'Hannah Lee . 33 y', header: hd, visits: v, onAddVisit: fn() },
} satisfies Meta<typeof PrenatalFlowsheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Elevated BP after 20 weeks, size greater than dates. */
export const Playground: Story = {};

/** Severe-range BP and low FHR (critical row). */
export const SevereRange: Story = { args: { visits: sev, readOnly: true } };
