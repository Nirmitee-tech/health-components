import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Flowsheet, type FlowsheetColumn, type FlowsheetRow } from './Flowsheet';

const cols: FlowsheetColumn[] = [
  { id: 'c1', label: '08:00' },
  { id: 'c2', label: '09:00' },
  { id: 'c3', label: '10:00' },
  { id: 'c4', label: '11:00' },
  { id: 'c5', label: '12:00' },
  { id: 'c6', label: '13:00' },
];
const adult: FlowsheetRow[] = [
  { id: 't', group: 'Vitals', label: 'Temperature', measure: 'temp', values: { c1: 37.0, c3: 37.9, c5: 38.6, c6: 38.4 } },
  { id: 'hr', group: 'Vitals', label: 'Heart rate', measure: 'hr', values: { c1: 88, c2: 94, c3: 104, c4: 112, c5: 118, c6: 121 } },
  {
    id: 'bp',
    group: 'Vitals',
    label: 'Blood pressure',
    measure: 'bp',
    values: { c1: '124/78', c2: '118/72', c3: '106/64', c4: '98/58', c5: '88/52', c6: '92/54' },
  },
  { id: 'map', group: 'Vitals', label: 'MAP', measure: 'map', values: { c1: 93, c2: 87, c3: 78, c4: 71, c5: 64, c6: 67 } },
  { id: 'rr', group: 'Vitals', label: 'Resp rate', measure: 'rr', values: { c1: 16, c2: 18, c3: 20, c4: 22, c5: 24, c6: 24 } },
  { id: 'sp', group: 'Vitals', label: 'SpO2', measure: 'spo2', values: { c1: 97, c2: 96, c3: 95, c4: 94, c5: 91, c6: 93 } },
  { id: 'o2', group: 'Vitals', label: 'O2 flow', measure: 'o2', values: { c4: 2, c5: 4, c6: 4 } },
  { id: 'gcs', group: 'Neuro', label: 'GCS', measure: 'gcs', values: { c1: 15, c3: 15, c5: 14 } },
  { id: 'pain', group: 'Neuro', label: 'Pain', measure: 'pain', values: { c1: 2, c3: 4, c5: 6 } },
  { id: 'loc', group: 'Neuro', label: 'Level of consciousness', values: { c1: 'Alert', c3: 'Alert', c5: 'Drowsy' } },
  { id: 'ns', group: 'Drips', label: 'NS bolus / maintenance', measure: 'rate', values: { c3: 125, c4: 125, c5: 1000, c6: 125 } },
  { id: 'gl', group: 'I&O', label: 'Glucose (POC)', measure: 'glucose', values: { c1: 142, c5: 212 } },
  { id: 'uo', group: 'I&O', label: 'Urine output', measure: 'ml', values: { c1: 60, c2: 45, c3: 30, c4: 25, c5: 15, c6: 20 } },
];
const picu: FlowsheetRow[] = [
  {
    id: 'hr',
    group: 'Vitals',
    label: 'Heart rate (age 4 range)',
    measure: 'hr',
    range: { low: 80, high: 140, critLow: 60, critHigh: 180 },
    values: { c1: 128, c2: 136, c3: 148, c4: 142 },
  },
  { id: 'sp', group: 'Vitals', label: 'SpO2', measure: 'spo2', values: { c1: 96, c2: 94, c3: 92, c4: 95 } },
  { id: 't', group: 'Vitals', label: 'Temperature', measure: 'temp', values: { c1: 38.9, c3: 38.2 } },
];
const copd: FlowsheetRow[] = [
  {
    id: 'sp',
    group: 'Vitals',
    label: 'SpO2 (COPD target 88 to 92%)',
    measure: 'spo2',
    range: { low: 88, high: 92 },
    values: { c1: 90, c2: 89, c3: 93, c4: 91 },
  },
  { id: 'rr', group: 'Vitals', label: 'Resp rate', measure: 'rr', values: { c1: 22, c2: 20, c3: 18, c4: 18 } },
];

const meta = {
  title: 'Complex/Inpatient nursing/Flowsheet',
  component: Flowsheet,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Flowsheet is the nurse charting grid: measures down the side, times across the top, with add column, edit in place, abnormal shading, collapsible groups and a graph view. Every value goes through the shared clinical formatting; flags use the inpatient range context unless a row passes its own range.',
      },
    },
  },
  argTypes: {
    defaultView: { control: 'inline-radio', options: ['grid', 'graph'] },
    rangeContext: { control: 'select', options: [undefined, 'outpatient', 'inpatient', 'ed', 'pediatric', 'pregnancy'] },
    readOnly: { control: 'boolean' },
  },
  args: {
    title: 'Vitals, Neuro, Drips, I&O',
    subtitle: '4 West Med-Surg . Bed 12 . Marcus Hill, 67 y . q1h',
    columns: cols,
    rows: adult,
    nowColumn: 'c6',
    nextTime: () => '14:00',
    onChange: fn(),
    onAddColumn: fn(),
  },
} satisfies Meta<typeof Flowsheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Grid: med-surg sepsis watch, abnormal and critical cells, current column. */
export const SepsisWatch: Story = {};

/** Editing a cell, Neuro group collapsed. */
export const EditingCollapsed: Story = {
  args: {
    title: 'Flowsheet',
    subtitle: 'Ortho . post-op day 1 total knee',
    rows: adult.slice(0, 10),
    nowColumn: undefined,
    defaultCollapsed: ['Neuro'],
    defaultEditing: 'hr|c6',
  },
};

/** Graph view: PICU, age-based heart rate range. */
export const GraphView: Story = {
  args: { title: 'PICU vitals', subtitle: 'Ava Reyes, 4 y . 16.2 kg', columns: cols.slice(0, 4), rows: picu, nowColumn: undefined, defaultView: 'graph' },
};

/** Read only: pulmonary, patient-specific SpO2 target. */
export const ReadOnly: Story = {
  args: {
    title: 'Respiratory flowsheet',
    subtitle: 'Viewed by Unit Clerk',
    columns: cols.slice(0, 4),
    rows: copd,
    nowColumn: undefined,
    readOnly: true,
  },
};
