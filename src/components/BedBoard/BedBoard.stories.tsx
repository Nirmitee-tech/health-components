import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { BedBoard, type BedQueuePatient, type BedUnit } from './BedBoard';

const units: BedUnit[] = [
  {
    id: '4w',
    name: '4 West Med-Surg',
    level: 'medsurg',
    ratio: '1:5',
    rooms: [
      {
        id: '401',
        beds: [
          {
            id: 'A',
            status: 'occupied',
            patient: {
              name: 'Okafor, Grace',
              age: 67,
              sex: 'F',
              dx: 'CHF exacerbation',
              los: 3,
              dischargeToday: true,
            },
          },
          { id: 'B', status: 'clean' },
        ],
      },
      {
        id: '402',
        beds: [
          {
            id: 'A',
            status: 'occupied',
            patient: {
              name: 'Nguyen, Bao',
              age: 54,
              sex: 'M',
              dx: 'Cellulitis, left leg',
              los: 1,
              isolation: 'contact',
              fallRisk: true,
            },
          },
          {
            id: 'B',
            status: 'blocked',
            note: 'Blocked: isolation, private room',
          },
        ],
      },
      {
        id: '403',
        negativePressure: true,
        beds: [{ id: 'A', status: 'clean' }],
      },
      {
        id: '404',
        beds: [
          { id: 'A', status: 'dirty', note: 'EVS called 13:52' },
          {
            id: 'B',
            status: 'occupied',
            patient: {
              name: 'Ruiz, Carmen',
              age: 81,
              sex: 'F',
              dx: 'Hip fracture, post-op day 2',
              los: 2,
              fallRisk: true,
            },
          },
        ],
      },
    ],
  },
  {
    id: '5e',
    name: '5 East Telemetry',
    level: 'tele',
    ratio: '1:4',
    rooms: [
      {
        id: '510',
        beds: [
          {
            id: 'A',
            status: 'occupied',
            patient: {
              name: 'Hassan, Omar',
              age: 72,
              sex: 'M',
              dx: 'New atrial fibrillation',
              los: 0,
            },
          },
        ],
      },
      { id: '511', beds: [{ id: 'A', status: 'clean' }] },
      {
        id: '512',
        beds: [{ id: 'A', status: 'blocked', note: 'Maintenance: call light' }],
      },
    ],
  },
];

const queue: BedQueuePatient[] = [
  {
    id: 'p1',
    name: 'Patel, Ravi',
    age: 59,
    sex: 'M',
    reason: 'Chest pain, rule out MI',
    level: 'tele',
    waiting: '2 h 10 min',
  },
  {
    id: 'p2',
    name: 'Kowalski, Anna',
    age: 34,
    sex: 'F',
    reason: 'Cavitary lesion',
    level: 'medsurg',
    isolation: 'airborne',
    waiting: '48 min',
  },
  {
    id: 'p3',
    name: 'Brooks, Tyrone',
    age: 46,
    sex: 'M',
    reason: 'DKA, resolving',
    level: 'medsurg',
    waiting: '25 min',
  },
];

const meta = {
  title: 'Complex/Inpatient flow/BedBoard',
  component: BedBoard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'BedBoard shows every bed on one or more units by room, with its status, the patient in it and their precautions, and lets bed management drag a waiting patient onto a clean bed (or select the patient and press Assign on a bed). The placement check catches bed status, airborne isolation outside a negative-pressure room, isolation with a roommate and a different-sex roommate; a nurse confirms every move.',
      },
    },
  },
  argTypes: {
    rangeContext: {
      control: 'select',
      options: [undefined, 'outpatient', 'inpatient', 'ed', 'pediatric', 'pregnancy'],
    },
  },
  args: { units, queue, onAssign: fn() },
} satisfies Meta<typeof BedBoard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: () => (
    <div className="pv-stack" style={{ gap: 16 }}>
      <BedBoard
        units={units}
        queue={queue}
        defaultSelected="p2"
        subtitle="Kowalski, Anna selected: only the negative-pressure room 403A accepts her"
      />
      <BedBoard title="Bed Board (view only)" units={[units[1]!]} readOnly />
    </div>
  ),
};

export const PatientSelected: Story = {
  args: {
    defaultSelected: 'p1',
    subtitle: 'Patel, Ravi selected: clean beds that pass the check show Assign',
  },
};

export const ReadOnly: Story = {
  args: {
    title: 'Bed Board (view only)',
    units: [units[1]!],
    queue: [],
    readOnly: true,
  },
};
