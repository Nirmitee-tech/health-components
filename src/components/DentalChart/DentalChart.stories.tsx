import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { DentalChart, type DentalPlanItem, type ToothRecord } from './DentalChart';

const teeth: Record<number, ToothRecord> = {
  1: { whole: 'missing' },
  2: { surfaces: { O: 'restoration', M: 'restoration' } },
  3: { surfaces: { O: 'caries', M: 'caries' } },
  4: { surfaces: { D: 'planned' } },
  8: { whole: 'crown' },
  9: { surfaces: { M: 'caries' } },
  14: { whole: 'crown' },
  15: { surfaces: { O: 'sealant' } },
  16: { whole: 'impacted' },
  17: { whole: 'extract' },
  18: { surfaces: { O: 'restoration', B: 'restoration' } },
  19: { whole: 'rct', note: 'RCT 2023, needs crown' },
  20: { surfaces: { O: 'planned' } },
  24: { surfaces: { L: 'caries' } },
  30: { whole: 'implant' },
  31: { surfaces: { O: 'restoration' } },
  32: { whole: 'missing' },
};

const plan: DentalPlanItem[] = [
  { phase: 1, tooth: 3, surface: 'MO', cdt: 'D2392', desc: 'Resin composite, 2 surfaces, posterior', status: 'scheduled', fee: 245, insurance: 196 },
  { phase: 1, tooth: 9, surface: 'M', cdt: 'D2330', desc: 'Resin composite, 1 surface, anterior', status: 'planned', fee: 165, insurance: 132 },
  { phase: 1, tooth: 17, surface: '', cdt: 'D7240', desc: 'Removal of impacted tooth, completely bony', status: 'planned', fee: 520, insurance: 260 },
  { phase: 2, tooth: 19, surface: '', cdt: 'D2740', desc: 'Crown, porcelain/ceramic', status: 'planned', fee: 1250, insurance: 625 },
  { phase: 2, tooth: 4, surface: 'D', cdt: 'D2391', desc: 'Resin composite, 1 surface, posterior', status: 'declined', fee: 190, insurance: 152 },
  { phase: 0, tooth: null, surface: '', cdt: 'D1110', desc: 'Prophylaxis, adult', status: 'completed', fee: 115, insurance: 115 },
];

const meta = {
  title: 'Complex/Specialty/DentalChart',
  component: DentalChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'DentalChart draws all 32 adult teeth in universal numbering with five surfaces each, marks caries, restorations, crowns, root canals, implants and missing teeth, and lists the phased treatment plan with fees.',
      },
    },
  },
  argTypes: {
    rangeContext: { control: 'select', options: [undefined, 'outpatient', 'inpatient', 'ed', 'pediatric', 'pregnancy'] },
    readOnly: { control: 'boolean' },
    title: { control: 'text' },
    subtitle: { control: 'text' },
  },
  args: {
    subtitle: 'Maria Gonzalez . DOB 04/12/1981 . Delta Dental PPO',
    teeth,
    plan,
    selected: 19,
    onSelectedChange: fn(),
    onPerioChart: fn(),
    onAddProcedure: fn(),
  },
} satisfies Meta<typeof DentalChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const NewPatientReadOnly: Story = {
  args: { title: 'Dental chart', subtitle: 'Liam Chen . first visit', teeth: {}, plan: [], readOnly: true, selected: undefined },
};
