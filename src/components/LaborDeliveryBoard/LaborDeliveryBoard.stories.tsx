import type { Meta, StoryObj } from '@storybook/react-vite';
import { RANGE_CONTEXTS } from '../../clinical';
import { LaborDeliveryBoard, type LDPatient } from './LaborDeliveryBoard';

const patients: LDPatient[] = [
  { room: 'LDR 1', name: 'Keisha Moore', age: 29, g: 2, p: 1, gaWeeks: 39, gaDays: 4, dilation: 8, effacement: 90, station: 1, checked: '14:05', rom: 6, fhr: 142, fhrCategory: 'I', oxytocin: null, status: 'Active', provider: 'Dr. Grace Obi', nurse: 'T. Ruiz RN', flags: ['Epidural'] },
  { room: 'LDR 2', name: 'Ana Souza', age: 34, g: 1, p: 0, gaWeeks: 40, gaDays: 2, dilation: 10, effacement: 100, station: 2, checked: '14:20', rom: 20, fhr: 118, fhrCategory: 'II', oxytocin: 12, status: 'Pushing', provider: 'Dr. Grace Obi', nurse: 'P. Shah RN', flags: ['GBS+', 'Epidural'] },
  { room: 'LDR 3', name: 'Hannah Lee', age: 41, g: 3, p: 2, gaWeeks: 36, gaDays: 1, dilation: 4, effacement: 60, station: -2, checked: '13:10', rom: null, fhr: 96, fhrCategory: 'III', oxytocin: null, status: 'Active', provider: 'Dr. Ben Okafor', nurse: 'T. Ruiz RN', flags: ['Pre-eclampsia', 'TOLAC'] },
  { room: 'LDR 4', name: 'Maria Lopez', age: 23, g: 1, p: 0, gaWeeks: 38, gaDays: 0, dilation: 2, effacement: 50, station: -3, checked: '12:30', rom: null, fhr: 136, fhrCategory: 'I', oxytocin: 4, status: 'Latent', provider: 'L. Hart CNM', nurse: 'J. Park RN' },
  { room: 'Triage 2', name: 'Chloe Davis', age: 31, g: 2, p: 1, gaWeeks: 33, gaDays: 5, fhr: 150, fhrCategory: 'I', status: 'Triage', provider: 'L. Hart CNM', nurse: 'J. Park RN', flags: ['Hemorrhage risk'] },
  { room: 'OR 5', name: 'Fatima Noor', age: 36, g: 4, p: 3, gaWeeks: 39, gaDays: 0, status: 'C-section', provider: 'Dr. Ben Okafor', nurse: 'P. Shah RN', flags: ['Epidural'] },
];

const meta = {
  title: 'Complex/ED & periop/LaborDeliveryBoard',
  component: LaborDeliveryBoard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'LaborDeliveryBoard lists every patient on labor and delivery: room, gravida and para, gestational age, last cervical exam, time since membranes ruptured, fetal heart rate and tracing category, oxytocin rate, status and care team. A Category III row turns red; values flag against the shared reference ranges.',
      },
    },
  },
  argTypes: { rangeContext: { control: 'select', options: [undefined, ...RANGE_CONTEXTS] } },
  args: { patients, subtitle: 'L&D . 6 patients . 14:32' },
} satisfies Meta<typeof LaborDeliveryBoard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: () => (
    <div className="pv-stack">
      <LaborDeliveryBoard patients={patients} subtitle="L&D . 6 patients . 14:32" />
      <LaborDeliveryBoard title="L&D Board (empty)" patients={[]} />
    </div>
  ),
};

export const PregnancyRanges: Story = { args: { rangeContext: 'pregnancy', subtitle: 'Flags in the pregnancy range context' } };

export const Empty: Story = { args: { title: 'L&D Board (empty)', patients: [], subtitle: undefined } };
