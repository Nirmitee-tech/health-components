import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { CarePlanByShift, type CarePlanProblem } from './CarePlanByShift';

const plan: CarePlanProblem[] = [
  {
    problem: 'Risk for infection (sepsis)',
    priority: true,
    goalStatus: 'notmet',
    goal: 'Temperature under 38.0 and lactate under 2 within 24 h.',
    target: 'Thu 12:00',
    measure: { measure: 'temp', value: 38.6 },
    interventions: [
      { text: 'Vitals and SIRS screen', freq: 'q1h', status: ['done', 'partial'] },
      { text: 'Antibiotics on time', freq: 'per MAR', status: ['notdone'] },
      { text: 'Hand hygiene and line care', status: ['done', 'done'] },
    ],
    evaluation: 'Fever persists; provider aware, cultures sent.',
  },
  {
    problem: 'Acute pain, right knee',
    goalStatus: 'progressing',
    goal: 'Pain at or under 3 at rest.',
    measure: { measure: 'pain', value: 4 },
    interventions: [
      { text: 'Reassess pain after PRN', freq: 'within 60 min', status: ['done'] },
      { text: 'Ice and elevation', freq: 'q2h', status: ['done', 'partial'] },
      { text: 'Physical therapy session', status: ['na'] },
    ],
  },
  {
    problem: 'Risk for falls',
    goalStatus: 'met',
    goal: 'No falls this admission.',
    interventions: [
      { text: 'Bed alarm on, low bed', status: ['done', 'done'] },
      { text: 'Hourly rounding', status: ['done', 'done'] },
    ],
  },
];

const meta = {
  title: 'Complex/Inpatient nursing/CarePlanByShift',
  component: CarePlanByShift,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'CarePlanByShift shows each nursing problem with its goal, goal status and the interventions charted Done, Partly, Not done or N/A for each shift; only the current shift is editable (select a cell to step through the statuses).',
      },
    },
  },
  argTypes: {
    currentShift: { control: { type: 'number', min: 0, max: 2 } },
    readOnly: { control: 'boolean' },
  },
  args: { subtitle: 'Marcus Hill . Day 2', currentShift: 1, problems: plan, onStatusChange: fn() },
} satisfies Meta<typeof CarePlanByShift>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Evening shift is current (editable column). */
export const EveningCurrent: Story = {};

/** Read only, NICU three-shift plan. */
export const NicuReadOnly: Story = {
  args: {
    subtitle: 'Baby Boy Nguyen, 34w 2d . 2.14 kg',
    readOnly: true,
    currentShift: 2,
    shifts: ['07-11', '11-19', '19-07'],
    problems: [
      {
        problem: 'Ineffective thermoregulation',
        goalStatus: 'new',
        goal: 'Axillary temperature 36.5 to 37.5 in open crib.',
        measure: { measure: 'temp', value: 36.3, range: { low: 36.5, high: 37.5 } },
        interventions: [
          { text: 'Temp with cares', freq: 'q3h', status: ['done', 'done', 'done'] },
          { text: 'Wean isolette', status: ['partial', 'notdone'] },
        ],
      },
    ],
  },
};
