import type { Meta, StoryObj } from '@storybook/react-vite';
import { RANGE_CONTEXTS } from '../../clinical';
import { FetalMonitorStrip } from './FetalMonitorStrip';

/* Synthetic display data, the same generator as the design-system preview. */
function wave(n: number, base: number, amp: number, decel?: [number, number, number]): Array<number | null> {
  const a: Array<number | null> = [];
  for (let i = 0; i < n; i++) {
    let v = base + Math.sin(i / 2.3) * amp + (Math.sin(i / 0.7) * amp) / 2;
    if (decel && i > decel[0] && i < decel[1]) v -= decel[2] * Math.sin((Math.PI * (i - decel[0])) / (decel[1] - decel[0]));
    a.push(Math.round(v));
  }
  return a;
}
function toco(n: number, every: number): number[] {
  const a: number[] = [];
  for (let i = 0; i < n; i++) {
    const ph = i % every;
    a.push(Math.round(10 + (ph < 14 ? 55 * Math.sin((Math.PI * ph) / 14) : 0)));
  }
  return a;
}
const f2 = wave(120, 140, 6, [52, 74, 35]);
for (let i = 88; i < 96; i++) f2[i] = null;

const meta = {
  title: 'Complex/ED & periop/FetalMonitorStrip',
  component: FetalMonitorStrip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'FetalMonitorStrip is a display placeholder for the cardiotocography feed: fetal heart rate above, uterine activity below, on the standard grid, with an approximate baseline and the category the clinician assigned. It never classifies the tracing.',
      },
    },
  },
  argTypes: {
    state: { control: 'inline-radio', options: [undefined, 'live', 'paused', 'disconnected'] },
    category: { control: 'inline-radio', options: [undefined, 'I', 'II', 'III'] },
    rangeContext: { control: 'select', options: [undefined, ...RANGE_CONTEXTS] },
  },
  args: {
    subtitle: 'LDR 1 . Keisha Moore . last 30 min',
    fhr: wave(120, 142, 6),
    toco: toco(120, 36),
    category: 'I',
    categoryBy: 'T. Ruiz RN 14:10',
  },
} satisfies Meta<typeof FetalMonitorStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: (args) => (
    <div className="pv-stack">
      <FetalMonitorStrip {...args} />
      <FetalMonitorStrip
        subtitle="LDR 2 . Ana Souza . late decelerations, signal loss"
        fhr={f2}
        toco={toco(120, 24)}
        category="II"
        categoryBy="Dr. Grace Obi 14:22"
      />
      <FetalMonitorStrip subtitle="LDR 4 . Maria Lopez . paused for ambulation" state="paused" fhr={wave(60, 136, 5)} toco={toco(60, 40)} />
      <FetalMonitorStrip subtitle="Triage 2" state="disconnected" room="Triage 2" />
    </div>
  ),
};

export const SignalLoss: Story = {
  args: { subtitle: 'LDR 2 . Ana Souza . late decelerations, signal loss', fhr: f2, toco: toco(120, 24), category: 'II', categoryBy: 'Dr. Grace Obi 14:22' },
};

export const Disconnected: Story = {
  args: { subtitle: 'Triage 2', state: 'disconnected', room: 'Triage 2', fhr: [], toco: [], category: undefined, categoryBy: undefined },
};
