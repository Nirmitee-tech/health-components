import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { EyeExam, type Refraction } from './EyeExam';

const refr: Refraction[] = [
  { type: 'Manifest', od: { sph: -2.25, cyl: -0.5, axis: 180, add: 2, va: '20/20' }, os: { sph: -2, cyl: -0.75, axis: 5, add: 2, va: '20/20' } },
  { type: 'Autorefraction', od: { sph: -2.5, cyl: -0.5, axis: 178 }, os: { sph: -2.25, cyl: 0 } },
];

const meta = {
  title: 'Complex/Specialty/EyeExam',
  component: EyeExam,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'EyeExam records right eye (OD) and left eye (OS) visual acuity, intraocular pressure and refraction in one place, with flags for reduced acuity, high pressure and pressure asymmetry.',
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
    subtitle: 'Priya Raman . 52 y . annual exam',
    exam: {
      od: { vaSc: '20/80', vaCc: '20/20', near: 'J1', iop: 16 },
      os: { vaSc: '20/70', vaCc: '20/25', near: 'J1', iop: 17 },
      iopMethod: 'Goldmann',
      iopTime: '10:20',
    },
    refractions: refr,
    onCopyLastExam: fn(),
    onFinalizeRx: fn(),
  },
} satisfies Meta<typeof EyeExam>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Routine exam, normal pressures. */
export const Playground: Story = {};

/** Glaucoma follow-up: high and asymmetric IOP, reduced acuity. */
export const GlaucomaFollowUp: Story = {
  args: {
    subtitle: 'Walter Brooks . 71 y . POAG',
    readOnly: true,
    exam: { od: { vaCc: '20/50', ph: '20/30', iop: 24 }, os: { vaCc: '20/200', ph: '20/100', iop: 31 }, iopMethod: 'Goldmann', iopTime: '08:45' },
    refractions: [],
  },
};

/** Child screening, some tests not done. */
export const ChildScreening: Story = {
  args: {
    subtitle: 'Ava Johnson . 6 y . school referral',
    exam: { od: { vaSc: '20/30' }, os: { vaSc: '20/40', iop: null }, iopMethod: 'iCare' },
    refractions: [],
  },
};
