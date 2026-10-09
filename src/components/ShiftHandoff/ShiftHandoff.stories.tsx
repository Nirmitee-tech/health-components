import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ShiftHandoff } from './ShiftHandoff';

const meta = {
  title: 'Complex/Inpatient nursing/ShiftHandoff',
  component: ShiftHandoff,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'ShiftHandoff is the SBAR nurse-to-nurse report: Situation, Background, Assessment with formatted values, Recommendation, what is due next, and the receiving nurse accepting it.',
      },
    },
  },
  argTypes: {
    rangeContext: { control: 'select', options: [undefined, 'outpatient', 'inpatient', 'ed', 'pediatric', 'pregnancy'] },
  },
  args: {
    subtitle: '4 West . Bed 12 . 15:00 handoff',
    from: 'L. Chen RN',
    to: 'J. Ortiz RN',
    flags: [
      { label: 'Contact isolation', tone: 'warning' },
      { label: 'High fall risk', tone: 'danger', icon: 'alert' },
      { label: 'Full code', tone: 'neutral' },
    ],
    pending: ['16:00 repeat lactate', '18:00 metoprolol 25 mg PO (held at 08:00)', '20:00 vitals and neuro check'],
    situation: { text: 'Marcus Hill, 67 y, POD 1 right total knee, now meets SIRS criteria. Rapid response called 12:40; stayed on unit.' },
    background: { items: ['Hx: type 2 diabetes, hypertension, CKD stage 3', 'Allergy: penicillin (rash)', 'Full code . Fall risk high (Morse 85)'] },
    assessment: {
      text: 'Febrile and tachycardic, soft BP after 1 L bolus, urine output low.',
      values: [
        { label: 'Temp', measure: 'temp', value: 38.6 },
        { label: 'HR', measure: 'hr', value: 121 },
        { label: 'BP', measure: 'bp', value: '92/54' },
        { label: 'MAP', measure: 'map', value: 67 },
        { label: 'SpO2', measure: 'spo2', value: 93 },
        { label: 'Lactate', measure: 'lactate', value: 3.1, unit: 'mmol/L', dp: 1, range: { high: 2, critHigh: 4 } },
        { label: 'Glucose', measure: 'glucose', value: 212 },
      ],
    },
    recommendation: {
      items: [
        'Repeat lactate at 16:00',
        'Blood cultures x2 drawn 12:50, cefTRIAXone given late at 09:40',
        'Call provider if MAP under 65 or UO under 30 mL/h x2',
      ],
    },
    onAcknowledge: fn(),
  },
} satisfies Meta<typeof ShiftHandoff>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Full SBAR, waiting for the receiving nurse. */
export const Waiting: Story = {};

/** Accepted (L&D to postpartum). */
export const Accepted: Story = {
  args: {
    subtitle: 'L&D to Mother-Baby . Sofia Martin, 31 y, G2P2',
    from: 'A. Patel RN',
    to: 'M. Green RN',
    flags: undefined,
    pending: undefined,
    acknowledged: true,
    ackTime: '19:12',
    situation: { text: 'Vaginal delivery 16:48, estimated blood loss 450 mL.' },
    background: { items: ['GBS negative', 'Gestational diabetes, diet controlled'] },
    assessment: {
      values: [
        { label: 'BP', measure: 'bp', value: '128/82' },
        { label: 'HR', measure: 'hr', value: 92 },
        { label: 'Temp', measure: 'temp', value: 37.1 },
        { label: 'Pain', measure: 'pain', value: 3 },
      ],
    },
    recommendation: { items: ['Fundal checks q15 min x4 then q30 min', 'Glucose fasting in the morning'] },
  },
};

/** Incomplete: assessment and recommendation missing. */
export const Incomplete: Story = {
  args: {
    subtitle: undefined,
    from: 'K. Wu RN',
    to: 'R. Patel RN',
    flags: undefined,
    pending: undefined,
    situation: { text: 'Transfer from ED, chest pain, troponin pending.' },
    background: { items: ['Hx: CAD, stent 2021'] },
    assessment: undefined,
    recommendation: undefined,
  },
};
