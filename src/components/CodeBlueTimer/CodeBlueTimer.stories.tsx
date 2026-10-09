import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { CodeBlueTimer, type CodeEvent } from './CodeBlueTimer';

const t0 = 1760000000000;
const ev: CodeEvent[] = [
  { t: 0, text: 'Code called, CPR started', by: 'K. Moore, RN' },
  { t: 62, text: 'Pads on, rhythm VF' },
  { t: 70, text: 'Shock 1, 200 J' },
  { t: 75, text: 'CPR started' },
  { t: 140, text: 'IV access, left AC' },
  { t: 198, text: 'Epinephrine 1 mg IV push' },
  { t: 200, text: 'Rhythm check: VF' },
  { t: 205, text: 'Shock 2, 200 J' },
];

const meta = {
  title: 'Complex/Inpatient flow/CodeBlueTimer',
  component: CodeBlueTimer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'CodeBlueTimer runs a resuscitation: elapsed time, the 2-minute CPR cycle, time since epinephrine, rhythm and shocks, one-tap event logging, and the event log for the code record. Timers follow AHA ACLS 2020 (rhythm check every 2 minutes, epinephrine every 3 to 5 minutes) and are reminders only. Pass `now` to freeze the clock for review; the live clock stops when the code ends and on unmount.',
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
    patient: 'Ruiz, Carmen, 81 F',
    location: '4 West 404B',
    startedAt: t0,
    now: t0 + (5 * 60 + 31) * 1000,
    events: ev,
    rhythm: 'VF',
    energy: 200,
    vitals: [
      { measure: 'etco2', value: 14 },
      { measure: 'spo2', value: null },
    ],
    team: ['Dr. Kim (lead)', 'K. Moore, RN', 'R. Diaz, RT', 'S. Ahmed, PharmD'],
    onEvent: fn(),
    onRosc: fn(),
  },
} satisfies Meta<typeof CodeBlueTimer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: (args) => (
    <div className="pv-stack" style={{ gap: 16 }}>
      <CodeBlueTimer {...args} />
      <CodeBlueTimer
        patient="Lee, Daniel, 29 M"
        location="OBS 3"
        startedAt={t0}
        now={t0 + 95000}
        events={[
          { t: 0, text: 'Code called, CPR started' },
          { t: 40, text: 'Rhythm PEA' },
        ]}
        rhythm="PEA"
        vitals={[{ measure: 'etco2', value: 22 }]}
      />
      <CodeBlueTimer
        patient="Hassan, Omar, 72 M"
        location="5 East 510A"
        startedAt={t0}
        now={t0 + (11 * 60 + 4) * 1000}
        ended="ROSC at 11:04"
        readOnly
        events={ev.concat([{ t: 664, text: 'ROSC' }])}
        rhythm="Sinus tachycardia"
        vitals={[
          { measure: 'hr', value: 118 },
          { measure: 'sbp', value: 86 },
          { measure: 'etco2', value: 38 },
        ]}
      />
    </div>
  ),
};

export const Live: Story = {
  args: {
    now: undefined,
    startedAt: undefined,
    events: [{ t: 0, text: 'Code called, CPR started' }],
    team: undefined,
  },
  parameters: {
    docs: {
      description: {
        story: 'A live clock that starts when the component mounts.',
      },
    },
  },
};

export const Ended: Story = {
  args: {
    patient: 'Hassan, Omar, 72 M',
    location: '5 East 510A',
    now: t0 + (11 * 60 + 4) * 1000,
    ended: 'ROSC at 11:04',
    readOnly: true,
    events: ev.concat([{ t: 664, text: 'ROSC' }]),
    rhythm: 'Sinus tachycardia',
    vitals: [
      { measure: 'hr', value: 118 },
      { measure: 'sbp', value: 86 },
      { measure: 'etco2', value: 38 },
    ],
  },
};
