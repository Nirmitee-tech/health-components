import type { Meta, StoryObj } from '@storybook/react-vite';
import { RANGE_CONTEXTS } from '../../clinical';
import { ORSchedule, SurgeryBoard, type ORCase, type ORRoom } from './ORSchedule';

const rooms: ORRoom[] = [
  { id: 'OR1', name: 'OR 1', service: 'General' },
  { id: 'OR2', name: 'OR 2', service: 'Orthopedics' },
  { id: 'OR3', name: 'OR 3', service: 'Cardiac' },
  { id: 'OR4', name: 'OR 4', service: 'Gyn / Urology' },
];
const cases: ORCase[] = [
  { room: 'OR1', start: '07:30', duration: 90, patient: 'Aaliyah Brooks', publicId: '4471', age: 27, procedure: 'Lap appendectomy', surgeon: 'Dr. Hannah Cole', anesthesia: 'Dr. Femi Ade, CRNA J. Ross', status: 'Complete' },
  { room: 'OR1', start: '09:30', duration: 150, patient: 'George Miller', publicId: '5120', age: 64, procedure: 'Lap cholecystectomy', surgeon: 'Dr. Hannah Cole', anesthesia: 'Dr. Femi Ade', status: 'Closing' },
  { room: 'OR1', start: '12:30', duration: 120, patient: 'Rosa Delgado', publicId: '6634', age: 52, procedure: 'Ventral hernia repair', surgeon: 'Dr. Hannah Cole', status: 'Scheduled' },
  { room: 'OR2', start: '07:30', duration: 120, patient: 'Frank Owens', publicId: '3302', age: 69, procedure: 'Total knee arthroplasty', laterality: 'Right', surgeon: 'Dr. Luis Mendez', anesthesia: 'Dr. Kim Wu', status: 'PACU' },
  { room: 'OR2', start: '10:00', duration: 105, patient: 'Sara Ahmed', publicId: '7781', age: 45, procedure: 'ORIF distal radius', laterality: 'Left', surgeon: 'Dr. Luis Mendez', anesthesia: 'Dr. Kim Wu', status: 'Delayed', delay: 35, delayReason: 'implant tray not sterile' },
  { room: 'OR3', start: '08:00', duration: 300, patient: 'William Hart', publicId: '2209', age: 71, procedure: 'CABG x3', surgeon: 'Dr. Anita Shah', anesthesia: 'Dr. Paul Grant', status: 'Incision' },
  { room: 'OR4', start: '08:00', duration: 60, patient: 'Mei Lin', publicId: '8812', age: 38, procedure: 'Hysteroscopy, D&C', surgeon: 'Dr. Grace Obi', status: 'Complete' },
  { room: 'OR4', start: '09:30', duration: 90, patient: 'Tom Becker', publicId: '9045', age: 66, procedure: 'TURP', surgeon: 'Dr. Ravi Iyer', status: 'Cancelled' },
  { room: 'OR4', start: '11:30', duration: 75, patient: 'Jenna Cruz', publicId: '1180', age: 31, procedure: 'Diagnostic laparoscopy', surgeon: 'Dr. Grace Obi', status: 'Add-on' },
];

const meta = {
  title: 'Complex/ED & periop/ORSchedule',
  component: ORSchedule,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "ORSchedule lays out the day's surgical cases per operating room on a timeline, with case status, delays, the current time and room utilization; `SurgeryBoard` (or `variant=\"board\"`) shows the same cases as a status board table, with `publicView` for the family waiting room. Arrow keys move between case blocks on the timeline.",
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['timeline', 'board'] },
    rangeContext: { control: 'select', options: [undefined, ...RANGE_CONTEXTS] },
  },
  args: { rooms, cases, now: '10:40', subtitle: 'Tue 13 Oct . Main OR . 9 cases' },
} satisfies Meta<typeof ORSchedule>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: () => (
    <div className="pv-stack">
      <ORSchedule rooms={rooms} cases={cases} now="10:40" subtitle="Tue 13 Oct . Main OR . 9 cases" />
      <SurgeryBoard rooms={rooms} cases={cases} subtitle="Staff view" />
      <SurgeryBoard title="Family Waiting Board" rooms={rooms} cases={cases.slice(0, 4)} publicView />
      <ORSchedule rooms={rooms} cases={[]} date="Sun 18 Oct" />
    </div>
  ),
};

export const StatusBoard: Story = { args: { variant: 'board', subtitle: 'Staff view', now: undefined } };

export const FamilyBoard: Story = {
  render: () => <SurgeryBoard title="Family Waiting Board" rooms={rooms} cases={cases.slice(0, 4)} publicView />,
};

export const Empty: Story = { args: { cases: [], date: 'Sun 18 Oct', now: undefined, subtitle: undefined } };
