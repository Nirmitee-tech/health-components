import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { RANGE_CONTEXTS } from '../../clinical';
import { EDTrackingBoard, ESIBadge, type EDPatient } from './EDTrackingBoard';

const patients: EDPatient[] = [
  { room: 'Trauma 1', name: 'Marcus Bell', age: 34, sex: 'M', mrn: 'MRN-204811', esi: 1, complaint: 'MVC, unrestrained, GCS 9', wait: 0, status: 'In Room', provider: 'Dr. Priya Raman', nurse: 'K. Osei RN', vitals: { hr: 138, bp: [78, 42], spo2: 87 }, flags: ['Trauma'] },
  { room: '12', name: 'Evelyn Ortiz', age: 71, sex: 'F', mrn: 'MRN-118402', esi: 2, complaint: 'Left arm weakness, onset 40 min', wait: 6, status: 'Results Pending', pending: 'CT head in progress', provider: 'Dr. Priya Raman', nurse: 'L. Chen RN', vitals: { hr: 88, bp: [186, 102], spo2: 96 }, flags: ['Stroke', 'Fall Risk'] },
  { room: '', name: 'Daniel Kim', age: 58, sex: 'M', esi: 2, complaint: 'Chest pressure, diaphoretic', wait: 14, status: 'Triage', nurse: 'M. Alvarez RN', vitals: { hr: 112, bp: [154, 94], spo2: 95 }, flags: ['Interpreter'] },
  { room: '7', name: 'Aaliyah Brooks', age: 27, sex: 'F', esi: 3, complaint: 'RLQ abdominal pain, vomiting', wait: 52, status: 'Waiting', vitals: { hr: 104, bp: [118, 76], spo2: 99 } },
  { room: 'Hall 3', name: 'Robert Nguyen', age: 82, sex: 'M', esi: 3, complaint: 'Fever, cough, confusion', wait: 310, status: 'Boarding', pending: 'Admit Med-Surg 4W', provider: 'Dr. Sam Patel', nurse: 'L. Chen RN', vitals: { hr: 118, bp: [96, 58], spo2: 90 }, flags: ['Sepsis', 'Isolation'] },
  { room: '', name: 'Lily Turner', age: 6, sex: 'F', esi: 4, complaint: 'Forearm laceration 3 cm', wait: 75, status: 'Waiting', vitals: { hr: 96, bp: [102, 64], spo2: 100 } },
  { room: '18', name: 'Jordan Price', age: 24, sex: 'M', esi: 5, complaint: 'Medication refill request', wait: 40, status: 'Ready to Discharge', provider: 'A. Gomez PA-C', nurse: 'M. Alvarez RN', flags: ['Behavioral'] },
];

const meta = {
  title: 'Complex/ED & periop/EDTrackingBoard',
  component: EDTrackingBoard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'EDTrackingBoard is the emergency department whiteboard: every patient with ESI acuity, room, chief complaint, wait against the ESI target, status, provider and nurse, last vitals and safety flags. Rows sort by ESI then wait. Values flag against the shared reference ranges in the `ed` context by default. `ESIBadge` is exported from the same module.',
      },
    },
  },
  argTypes: {
    density: { control: 'inline-radio', options: ['comfortable', 'compact'] },
    defaultFilter: { control: 'inline-radio', options: ['all', 'waiting', 'boarding', 'mine'] },
    filter: { control: 'inline-radio', options: [undefined, 'all', 'waiting', 'boarding', 'mine'] },
    rangeContext: { control: 'select', options: [undefined, ...RANGE_CONTEXTS] },
  },
  args: {
    patients,
    currentProvider: 'Dr. Priya Raman',
    subtitle: 'Main ED . 7 patients . updated 14:32',
    onFilterChange: fn(),
    onQuickRegister: fn(),
  },
} satisfies Meta<typeof EDTrackingBoard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: () => (
    <div className="pv-stack">
      <EDTrackingBoard patients={patients} currentProvider="Dr. Priya Raman" subtitle="Main ED . 7 patients . updated 14:32" />
      <EDTrackingBoard
        title="ED Wall Board (compact, waiting filter)"
        patients={patients}
        density="compact"
        defaultFilter="waiting"
        summary={false}
      />
      <EDTrackingBoard title="ED Tracking Board (empty)" patients={[]} summary={false} />
      <div className="co-row co-gap-8">
        {([1, 2, 3, 4, 5, null] as const).map((l) => (
          <ESIBadge key={String(l)} level={l} showLabel />
        ))}
      </div>
    </div>
  ),
};

export const WallBoard: Story = {
  args: { title: 'ED Wall Board', density: 'compact', summary: false, readOnly: true, subtitle: undefined },
};

export const MyPatients: Story = { args: { defaultFilter: 'mine' } };

export const Empty: Story = { args: { title: 'ED Tracking Board (empty)', patients: [], summary: false, subtitle: undefined } };

export const ESIBadges: Story = {
  render: () => (
    <div className="pv-stack">
      <div className="co-row co-gap-8">
        {([1, 2, 3, 4, 5, null] as const).map((l) => (
          <ESIBadge key={String(l)} level={l} showLabel />
        ))}
      </div>
      <div className="co-row co-gap-8">
        {([1, 2, 3, 4, 5] as const).map((l) => (
          <ESIBadge key={l} level={l} size="sm" />
        ))}
      </div>
    </div>
  ),
};
