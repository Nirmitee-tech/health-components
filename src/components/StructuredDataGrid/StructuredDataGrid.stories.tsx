import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { RANGE_CONTEXTS } from '../../clinical';
import { StructuredDataGrid, type StructuredDataGridColumn } from './StructuredDataGrid';

const cols: StructuredDataGridColumn[] = [
  { key: 'time', label: 'Time', type: 'text', readOnly: true },
  { key: 'hr', label: 'HR', code: 'HR', min: 20, max: 250, required: true },
  { key: 'sbp', label: 'SBP', code: 'SBP', min: 40, max: 300, required: true },
  { key: 'dbp', label: 'DBP', code: 'DBP', min: 20, max: 200 },
  { key: 'spo2', label: 'SpO2', code: 'SpO2', min: 50, max: 100 },
  { key: 'temp', label: 'Temp', code: 'Temp', min: 30, max: 43 },
  { key: 'rhythm', label: 'Rhythm', type: 'select', options: ['Sinus', 'A-fib', 'Paced'] },
];
const rows = [
  { time: '08:00', hr: '88', sbp: '124', dbp: '72', spo2: '96', temp: '37.1', rhythm: 'Sinus' },
  { time: '09:00', hr: '112', sbp: '168', dbp: '94', spo2: '91', temp: '38.4', rhythm: 'A-fib' },
  { time: '10:00', hr: '7o', sbp: '', dbp: '64', spo2: '104', temp: '36.9', rhythm: '' },
];
const dcols: StructuredDataGridColumn[] = [
  { key: 'run', label: 'Dialysis run', type: 'text', readOnly: true },
  { key: 'k', label: 'Pre K', code: 'K', readOnly: true },
  { key: 'cr', label: 'Pre creatinine', code: 'Cr', readOnly: true },
  { key: 'wt', label: 'Post weight', code: 'Wt', readOnly: true },
];
const drows = [
  { run: '10/07/2026', k: '5.9', cr: '6.42', wt: '71.4' },
  { run: '10/09/2026', k: '4.8', cr: '5.88', wt: '71.0' },
];

const meta = {
  title: 'Complex/Chart panels/StructuredDataGrid',
  component: StructuredDataGrid,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'StructuredDataGrid is a spreadsheet-like flowsheet for entering many numbers at once, with checks that block impossible values (not a number, outside the hard limits, missing required) and warn on out-of-range ones (shared `fmt` ranges for the `rangeContext`). Enter or Down moves to the next row; Left and Right at the edge of a value move between cells.',
      },
    },
  },
  argTypes: {
    rangeContext: { control: 'select', options: [undefined, ...RANGE_CONTEXTS] },
  },
  args: { title: 'ICU hourly vitals', subtitle: 'Bed 12 . Ralph Edwards', columns: cols, rows, onSave: fn(), onRowsChange: fn() },
} satisfies Meta<typeof StructuredDataGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: (args) => (
    <div className="co-dt">
      <StructuredDataGrid {...args} />
      <StructuredDataGrid title="Nephrology: dialysis runs" readOnly columns={dcols} rows={drows} />
    </div>
  ),
};

export const InpatientRanges: Story = { args: { title: 'ICU hourly vitals (inpatient ranges)', rangeContext: 'inpatient' } };

export const ReadOnly: Story = { args: { title: 'Nephrology: dialysis runs', subtitle: undefined, readOnly: true, columns: dcols, rows: drows } };
