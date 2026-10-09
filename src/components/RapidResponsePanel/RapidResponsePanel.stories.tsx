import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { RapidResponsePanel } from './RapidResponsePanel';

const t0 = 1760000000000;

const meta = {
  title: 'Complex/Inpatient flow/RapidResponsePanel',
  component: RapidResponsePanel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'RapidResponsePanel supports a rapid response call: who called and why, vitals against calling criteria, recent labs, what has been done, outcome, and escalation to Code Blue. Vitals with a critical flag from the shared ranges (inpatient context by default) are listed as meeting criteria; each hospital sets its own.',
      },
    },
  },
  argTypes: {
    rangeContext: {
      control: 'select',
      options: [undefined, 'outpatient', 'inpatient', 'ed', 'pediatric', 'pregnancy'],
    },
  },
  args: {
    patient: 'Kowalski, Anna, 34 F',
    location: '4 West 403A (airborne)',
    calledBy: 'J. Patel, RN',
    reason: 'New confusion and SpO2 86% on 4 L nasal cannula',
    calledAt: t0,
    now: t0 + (8 * 60 + 12) * 1000,
    vitals: [
      { measure: 'spo2', value: 86, taken: '14:02' },
      { measure: 'rr', value: 32, taken: '14:02' },
      { measure: 'hr', value: 124, taken: '14:02' },
      { measure: 'sbp', value: 94, taken: '14:02' },
      { measure: 'temp', value: 38.9, taken: '13:40' },
    ],
    labs: [
      { measure: 'lactate', value: 3.1 },
      { measure: 'k', value: 3.3 },
      { measure: 'glucose', value: 142 },
    ],
    interventions: [
      { at: '14:04', text: 'Non-rebreather mask 15 L' },
      { at: '14:06', text: 'Blood cultures x2 drawn' },
    ],
    onEscalate: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof RapidResponsePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: (args) => (
    <div className="pv-stack" style={{ gap: 16 }}>
      <RapidResponsePanel {...args} />
      <RapidResponsePanel
        patient="Brooks, Tyrone, 46 M"
        location="4 West 406A"
        calledBy="Family"
        reason="Family worried, patient sweaty and shaky"
        calledAt={t0}
        now={t0 + 22 * 60 * 1000}
        outcome="Stays on unit, watch closely"
        readOnly
        vitals={[
          { measure: 'glucose', value: 48 },
          { measure: 'hr', value: 102 },
          { measure: 'sbp', value: 128 },
        ]}
        interventions={[
          { at: '09:12', text: 'Dextrose 50% 25 g IV push' },
          { at: '09:27', text: 'Recheck glucose 112 mg/dL' },
        ]}
      />
    </div>
  ),
};

export const Closed: Story = {
  args: {
    patient: 'Brooks, Tyrone, 46 M',
    location: '4 West 406A',
    calledBy: 'Family',
    reason: 'Family worried, patient sweaty and shaky',
    now: t0 + 22 * 60 * 1000,
    outcome: 'Stays on unit, watch closely',
    readOnly: true,
    vitals: [
      { measure: 'glucose', value: 48 },
      { measure: 'hr', value: 102 },
      { measure: 'sbp', value: 128 },
    ],
    labs: [],
    interventions: [
      { at: '09:12', text: 'Dextrose 50% 25 g IV push' },
      { at: '09:27', text: 'Recheck glucose 112 mg/dL' },
    ],
  },
};
