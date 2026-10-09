import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '../Button/Button';
import { LabResultTable, type LabResultRow } from './LabResultTable';

const bmp: LabResultRow[] = [
  { test: 'Potassium', loinc: '2823-3', value: '6.1', flag: 'HH', range: '3.5 to 5.1', units: 'mmol/L', trend: [4.6, 5.0, 5.4, 6.1], collected: '7:40 AM' },
  { test: 'Sodium', value: '134', flag: 'L', range: '136 to 145', units: 'mmol/L', collected: '7:40 AM' },
  { test: 'Glucose', value: '142', flag: 'H', range: '70 to 99', units: 'mg/dL', trend: [160, 151, 148, 142], collected: '7:40 AM' },
  { test: 'Creatinine', value: '1.0', range: '0.7 to 1.3', units: 'mg/dL', collected: '7:40 AM' },
];

const meta = {
  title: 'Complex/Clinical/LabResultTable',
  component: LabResultTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'LabResultTable shows a lab panel with value, H, L and critical flags, reference range, units, trend and collection time, plus Sign and Notify Patient and Route to Nurse when `onSign` is set. Critical rows are shaded and a critical value alert sits above the table.',
      },
    },
  },
  argTypes: { title: { control: 'text' }, subtitle: { control: 'text' }, critical: { control: 'text' } },
  args: {
    title: 'Basic metabolic panel',
    subtitle: 'Quest . collected 10/09/2026 7:40 AM . Ralph Edwards',
    critical: 'Potassium 6.1 mmol/L. Call the patient and document within 1 hour.',
    rows: bmp,
    onSign: fn(),
    onRoute: fn(),
  },
} satisfies Meta<typeof LabResultTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllNormal: Story = {
  args: {
    title: 'Lipid panel',
    subtitle: 'LabCorp . collected 10/02/2026 8:15 AM . Henna West',
    critical: undefined,
    rows: [
      { test: 'Total cholesterol', loinc: '2093-3', value: '182', range: 'under 200', units: 'mg/dL', collected: '8:15 AM' },
      { test: 'LDL cholesterol', loinc: '13457-7', value: '96', range: 'under 100', units: 'mg/dL', trend: [131, 118, 104, 96], collected: '8:15 AM' },
      { test: 'HDL cholesterol', loinc: '2085-9', value: '54', range: 'over 40', units: 'mg/dL', collected: '8:15 AM' },
    ],
  },
};

export const ReviewOnly: Story = {
  args: {
    onSign: undefined,
    critical: undefined,
    actions: <Button size="sm">Print</Button>,
  },
};
