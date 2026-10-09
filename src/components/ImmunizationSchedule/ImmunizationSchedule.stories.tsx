import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ImmunizationSchedule, type ImmunizationRow } from './ImmunizationSchedule';

const columns = ['Birth', '2 mo', '4 mo', '6 mo', '12 mo', '15 mo'];
const rows: ImmunizationRow[] = [
  {
    vaccine: 'Hep B',
    doses: [{ status: 'given', date: '01/20/17' }, { status: 'given', date: '03/22/17' }, {}, { status: 'given', date: '07/21/17' }, {}, {}],
  },
  {
    vaccine: 'DTaP',
    doses: [{}, { status: 'given', date: '03/22/17' }, { status: 'given', date: '05/24/17' }, { status: 'given', date: '07/21/17' }, {}, { status: 'overdue' }],
  },
  { vaccine: 'MMR', doses: [{}, {}, {}, {}, { status: 'due' }, {}] },
  { vaccine: 'Influenza', doses: [{}, {}, {}, { status: 'declined' }, { status: 'future' }, {}] },
];

const meta = {
  title: 'Complex/Clinical/ImmunizationSchedule',
  component: ImmunizationSchedule,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'ImmunizationSchedule is the vaccine grid by dose with Given, Due, Overdue, Declined and Later states, synced with the state registry (IIS). Given doses show their date; screen readers also hear "Given".',
      },
    },
  },
  argTypes: { synced: { control: 'text' } },
  args: { columns, rows, synced: '10/09/2026 (I-CARE)', onRecordDose: fn() },
} satisfies Meta<typeof ImmunizationSchedule>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const UpToDate: Story = {
  args: {
    columns: ['2 mo', '4 mo', '6 mo'],
    rows: [
      { vaccine: 'DTaP', doses: [{ status: 'given', date: '12/02/25' }, { status: 'given', date: '02/03/26' }, { status: 'given', date: '04/06/26' }] },
      { vaccine: 'IPV', doses: [{ status: 'given', date: '12/02/25' }, { status: 'given', date: '02/03/26' }, { status: 'future' }] },
      { vaccine: 'PCV15', doses: [{ status: 'given', date: '12/02/25' }, { status: 'given', date: '02/03/26' }, { status: 'due' }] },
    ],
  },
};

export const ReadOnly: Story = { args: { readOnly: true } };
