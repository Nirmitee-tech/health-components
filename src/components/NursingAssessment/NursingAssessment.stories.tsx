import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { DEFAULT_NURSING_SYSTEMS, NursingAssessment, type NursingSystem } from './NursingAssessment';

const OPTIONS: Record<string, string[]> = {
  neuro: ['Confused', 'Drowsy', 'Pupils unequal', 'Weakness L', 'Weakness R'],
  cardio: ['Irregular', 'Edema 1+', 'Edema 2+', 'Weak pulses', 'Cap refill over 3 s'],
  resp: ['Crackles', 'Wheezes', 'Diminished bases', 'On O2', 'Cough'],
  gi: ['Nausea', 'Distended', 'Hypoactive bowel sounds', 'NPO'],
  gu: ['Foley', 'Retention', 'Hematuria'],
  skin: ['Incision', 'Pressure injury', 'Bruising', 'Diaphoretic'],
  msk: ['Limited ROM', 'Unsteady gait', 'Brace', 'Pain on movement'],
  psych: ['Anxious', 'Withdrawn', 'Agitated'],
};
const sys: NursingSystem[] = DEFAULT_NURSING_SYSTEMS.map((s) => ({ ...s, options: OPTIONS[s.id] }));

const meta = {
  title: 'Complex/Inpatient nursing/NursingAssessment',
  component: NursingAssessment,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'NursingAssessment is the head-to-toe shift assessment: one row per body system with a WDL or Exception choice (a radio group), finding chips and a note for exceptions.',
      },
    },
  },
  argTypes: { readOnly: { control: 'boolean' } },
  args: {
    subtitle: 'Ortho . Marcus Hill . POD 1 right total knee . Day shift 08:20',
    systems: sys,
    values: {
      neuro: { wdl: true, findings: [], note: '' },
      cardio: { wdl: false, findings: ['Edema 1+'], note: 'Right lower leg, pedal pulses palpable.' },
      resp: { wdl: false, findings: ['Diminished bases', 'On O2'], note: '2 L/min nasal cannula, incentive spirometer 750 mL.' },
      gi: { wdl: true, findings: [], note: '' },
      skin: { wdl: false, findings: ['Incision'], note: 'Right knee dressing dry and intact.' },
      msk: { wdl: false, findings: ['Limited ROM', 'Pain on movement'], note: '' },
    },
    onChange: fn(),
  },
} satisfies Meta<typeof NursingAssessment>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Mixed: WDL, exceptions with findings, not yet assessed. */
export const Mixed: Story = {};

/** Nothing charted yet (admission). */
export const Admission: Story = {
  args: { subtitle: 'Admission . Behavioral health transfer', values: undefined },
};

/** Signed, read only. */
export const Signed: Story = {
  args: {
    subtitle: 'Signed by J. Ortiz RN, 20:10',
    readOnly: true,
    systems: sys.slice(0, 4),
    values: {
      neuro: { wdl: false, findings: ['Confused'], note: 'Oriented to person only; baseline per daughter.' },
      cardio: { wdl: true, findings: [], note: '' },
      resp: { wdl: true, findings: [], note: '' },
      gi: { wdl: true, findings: [], note: '' },
    },
  },
};
