import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { IntakeOutputPanel, type IntakeOutputEntry } from './IntakeOutputPanel';

const adult: IntakeOutputEntry[] = [
  { time: '07:30', kind: 'in', category: 'PO', amount: 240, note: 'coffee, water' },
  { time: '08:00', kind: 'in', category: 'IV', amount: 125 },
  { time: '09:00', kind: 'in', category: 'IV', amount: 125 },
  { time: '09:15', kind: 'out', category: 'Urine', amount: 180 },
  { time: '10:00', kind: 'in', category: 'IV piggyback', amount: 50, note: 'cefTRIAXone' },
  { time: '11:40', kind: 'out', category: 'Emesis', amount: 150 },
  { time: '12:00', kind: 'out', category: 'Urine', amount: 90 },
  { time: '12:30', kind: 'out', category: 'Drain', amount: 45, note: 'JP right' },
];
const peds: IntakeOutputEntry[] = [
  { time: '08:00', kind: 'in', category: 'Tube feed', amount: 60 },
  { time: '10:00', kind: 'in', category: 'Tube feed', amount: 60 },
  { time: '10:30', kind: 'out', category: 'Urine', amount: 42, note: 'diaper weight' },
  { time: '12:00', kind: 'in', category: 'Tube feed', amount: 60 },
];

const meta = {
  title: 'Complex/Inpatient nursing/IntakeOutputPanel',
  component: IntakeOutputPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'IntakeOutputPanel lists intake and output entries for a shift with a running balance, totals and urine output in mL/kg/h against a target (default 0.5 mL/kg/h).',
      },
    },
  },
  argTypes: {
    rangeContext: { control: 'select', options: [undefined, 'outpatient', 'inpatient', 'ed', 'pediatric', 'pregnancy'] },
    readOnly: { control: 'boolean' },
  },
  args: {
    subtitle: 'Day shift 07:00 to 15:00 . Marcus Hill . 82.0 kg',
    entries: adult,
    weightKg: 82,
    hours: 5,
    now: '12:45',
    onAdd: fn(),
  },
} satisfies Meta<typeof IntakeOutputPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Adult post-op, urine output below target. */
export const LowUrineOutput: Story = {};

/** Peds, target 1.0 mL/kg/h, adding an entry. */
export const PedsAdding: Story = {
  args: {
    subtitle: 'Ava Reyes, 4 y . 16.2 kg',
    entries: peds,
    weightKg: 16.2,
    hours: 4,
    uoTarget: 1,
    defaultAdding: true,
    now: '12:30',
    inCategories: ['Tube feed', 'PO', 'IV'],
    outCategories: ['Urine', 'Stool', 'Emesis'],
  },
};

/** Empty: night shift not started. */
export const Empty: Story = {
  args: { subtitle: 'Night shift not started', entries: [], weightKg: undefined, hours: undefined },
};

/** Read only, 24 h, renal patient net negative. */
export const ReadOnlyNetNegative: Story = {
  args: {
    title: 'Intake and Output (24 h)',
    subtitle: undefined,
    readOnly: true,
    weightKg: undefined,
    hours: undefined,
    entries: [
      { time: '00:00', kind: 'in', category: 'PO', amount: 600 },
      { time: '06:00', kind: 'out', category: 'Urine', amount: 1450 },
      { time: '14:00', kind: 'out', category: 'Dialysis UF', amount: 2000 },
      { time: '18:00', kind: 'in', category: 'IV', amount: 250 },
    ],
  },
};
