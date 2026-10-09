import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AppointmentChip, appointmentChipColors } from './AppointmentChip';

const meta = {
  title: 'Complex/Scheduling/AppointmentChip',
  component: AppointmentChip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'AppointmentChip is one appointment on the calendar, coloured by status or by appointment type, with telehealth and paid or unpaid icons. The whole chip is one button whose accessible name reads time, patient, type, status, telehealth and copay.',
      },
    },
  },
  argTypes: {
    status: {
      control: 'select',
      options: [undefined, 'Scheduled', 'Confirmed', 'Arrived', 'In Room', 'Completed', 'No Show', 'Cancelled'],
    },
    colorBy: { control: 'inline-radio', options: ['status', 'type'] },
    color: { control: 'select', options: [...appointmentChipColors] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    paid: { control: 'select', options: [undefined, true, false] },
  },
  args: { time: '9:20', patient: 'Nora Scott', type: 'Therapy 50', status: 'Confirmed', onClick: fn() },
} satisfies Meta<typeof AppointmentChip>;

export default meta;
type Story = StoryObj<typeof meta>;

const narrow: Story['decorators'] = [
  (Story) => (
    <div style={{ maxWidth: 220 }}>
      <Story />
    </div>
  ),
];

export const Playground: Story = { args: { telehealth: true, paid: false }, decorators: narrow };

const statuses = ['Scheduled', 'Confirmed', 'Arrived', 'In Room', 'Completed', 'No Show', 'Cancelled'];
const patients = ['Henna West', 'Ralph Edwards', 'Nora Scott', 'Jacob Jones', 'Kristin Watson', 'Darlene Robertson', 'Leslie Alexander'];
const types = ['Follow-Up', 'New Patient', 'Therapy 50', 'Well Child', 'Annual Wellness', 'Follow-Up', 'Physical Therapy'];
const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 6 } as const;

export const Showcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="pv-label">By status</div>
      <div style={grid}>
        {statuses.map((s, i) => (
          <AppointmentChip
            key={s}
            time={`${8 + i}:00 AM`}
            patient={patients[i]!}
            type={types[i]!}
            status={s}
            telehealth={i === 2}
            paid={i === 3 ? true : i === 1 ? false : undefined}
          />
        ))}
      </div>
      <div className="pv-label">By appointment type</div>
      <div style={grid}>
        {appointmentChipColors.map((c, i) => (
          <AppointmentChip
            key={c}
            colorBy="type"
            color={c}
            time={`2:${10 + i * 5} PM`}
            patient={`Patient ${i + 1}`}
            type={`${c.charAt(0).toUpperCase()}${c.slice(1)} type`}
          />
        ))}
      </div>
      <div style={{ width: 150 }}>
        <AppointmentChip size="sm" time="9:20" patient="H. West" type="Follow-Up" status="Confirmed" telehealth />
      </div>
    </div>
  ),
};

export const ByType: Story = { args: { colorBy: 'type', color: 'purple', status: undefined, type: 'Behavioral Health' }, decorators: narrow };

export const Small: Story = { args: { size: 'sm', time: '9:20', patient: 'H. West', type: 'Follow-Up', telehealth: true }, decorators: narrow };

export const NoShow: Story = {
  args: { time: '1:00', patient: 'Kristin Watson', type: 'Annual Wellness', status: 'No Show', paid: false },
  decorators: narrow,
};
