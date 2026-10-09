import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { PediatricDosingCalculator, type PediatricDrug } from './PediatricDosingCalculator';

const drugs: PediatricDrug[] = [
  {
    name: 'Acetaminophen',
    form: '160 mg/5 mL suspension',
    mgkg: 15,
    perDay: 5,
    freq: 'every 4 to 6 hours as needed, up to 5 doses a day',
    maxDose: 1000,
    maxDaily: 4000,
    conc: 32,
    note: 'Count acetaminophen in combination products too.',
  },
  {
    name: 'Ibuprofen',
    form: '100 mg/5 mL suspension',
    mgkg: 10,
    perDay: 4,
    freq: 'every 6 hours as needed',
    maxDose: 400,
    maxDaily: 1600,
    conc: 20,
    note: 'Not under 6 months of age.',
  },
  {
    name: 'Amoxicillin',
    form: '400 mg/5 mL suspension',
    mgkg: 45,
    perDay: 2,
    freq: 'every 12 hours for 10 days',
    maxDose: 1000,
    maxDaily: 4000,
    conc: 80,
    note: 'High dose for acute otitis media (90 mg/kg/day in 2 doses).',
  },
];

const meta = {
  title: 'Complex/Specialty/PediatricDosingCalculator',
  component: PediatricDosingCalculator,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'PediatricDosingCalculator works out a weight-based dose in mg/kg, caps it at the maximum single and daily dose, converts it to mL, and shows the working so a second person can check it.',
      },
    },
  },
  argTypes: {
    rangeContext: { control: 'select', options: [undefined, 'outpatient', 'inpatient', 'ed', 'pediatric', 'pregnancy'] },
    readOnly: { control: 'boolean' },
    defaultWeight: { control: 'number' },
    defaultDrug: { control: 'select', options: [0, 1, 2] },
    title: { control: 'text' },
    subtitle: { control: 'text' },
    weightDate: { control: 'text' },
    weightStale: { control: 'text' },
  },
  args: {
    subtitle: 'Zoe Martin . 4 y',
    drugs,
    defaultDrug: 1,
    defaultWeight: 18.4,
    weightDate: 'today 09:12',
    onWeightChange: fn(),
    onDrugChange: fn(),
    onUseInOrder: fn(),
    onRequestDoubleCheck: fn(),
  },
} satisfies Meta<typeof PediatricDosingCalculator>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Toddler, ibuprofen, normal. */
export const Playground: Story = {};

/** Teen, amoxicillin capped at the maximum single dose. */
export const CappedSingleDose: Story = { args: { subtitle: 'Owen Price . 14 y', defaultDrug: 2, defaultWeight: 62, weightDate: 'today 14:30' } };

/** Stale weight. */
export const StaleWeight: Story = {
  args: { subtitle: 'Ella Brooks . 2 y', defaultDrug: 0, defaultWeight: 11.2, weightDate: '08/20/2026', weightStale: '50 days' },
};

/** No weight yet, read-only. */
export const NoWeightReadOnly: Story = {
  args: { subtitle: 'New patient', defaultDrug: 0, defaultWeight: undefined, weightDate: undefined, readOnly: true },
};
