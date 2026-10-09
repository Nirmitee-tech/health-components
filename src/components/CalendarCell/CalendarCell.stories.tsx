import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import type { AppointmentChipProps } from '../AppointmentChip/AppointmentChip';
import { CalendarCell } from './CalendarCell';

const appts: AppointmentChipProps[] = [
  { time: '8:00', patient: 'Henna West', type: 'Follow-Up', status: 'Completed', paid: true },
  { time: '8:40', patient: 'Ralph Edwards', type: 'New Patient', status: 'Arrived' },
  { time: '9:20', patient: 'Nora Scott', type: 'Therapy 50', status: 'Confirmed', telehealth: true },
  { time: '10:00', patient: 'Jacob Jones', type: 'Well Child', status: 'Scheduled' },
];

const meta = {
  title: 'Complex/Scheduling/CalendarCell',
  component: CalendarCell,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'CalendarCell renders one cell of the month, week or day calendar with its appointments, blocked time and free slots. Month and week cells are grid cells and day rows are grid rows, so they sit inside a `role="grid"` container (Calendar provides it; these stories add one).',
      },
    },
  },
  argTypes: {
    view: { control: 'inline-radio', options: ['month', 'week', 'day'] },
    date: { control: 'text' },
  },
  args: { onBook: fn(), onMore: fn() },
} satisfies Meta<typeof CalendarCell>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Month and week cells are grid cells and day rows are grid rows: give them a grid. */
const inGrid: Story['decorators'] = [
  (Story, ctx) => (
    <div role="grid" aria-label="Schedule for Dr. James Bell">
      {ctx.args.view === 'day' ? (
        <Story />
      ) : (
        <div role="row" className="co-row" style={{ alignItems: 'flex-start', gap: 0 }}>
          <Story />
        </div>
      )}
    </div>
  ),
];

export const Playground: Story = {
  args: { view: 'month', date: 9, today: true, count: 14, appointments: appts, label: 'Thursday October 9, 14 appointments' },
  decorators: inGrid,
};

export const Showcase: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div role="grid" aria-label="October month view">
        <div role="row" className="co-row" style={{ alignItems: 'flex-start', gap: 0 }}>
          <CalendarCell view="month" date={30} dim label="Tuesday September 30" />
          <CalendarCell view="month" date={9} today count={14} appointments={appts} label="Thursday October 9, today" onMore={args.onMore} />
          <CalendarCell view="month" date={10} blocked="CME conference" label="Friday October 10, blocked" />
        </div>
      </div>
      <div className="co-row" style={{ alignItems: 'flex-start' }}>
        <div role="grid" aria-label="Week view">
          <div role="row">
            <CalendarCell view="week" date="Thu 9" appointments={appts.slice(0, 3)} label="Thursday October 9" />
          </div>
        </div>
        <div role="grid" aria-label="Day view, Thursday October 9" style={{ flex: '1 1 320px' }}>
          <CalendarCell view="day" time="9:20 AM" appointments={[appts[2]!]} />
          <CalendarCell view="day" time="9:40 AM" onBook={args.onBook} />
          <CalendarCell view="day" time="12:00 PM" blocked="Lunch" />
          <CalendarCell
            view="day"
            time="1:00 PM"
            appointments={[{ time: '1:00', patient: 'Kristin Watson', type: 'Annual Wellness', status: 'No Show', paid: false }]}
          />
        </div>
      </div>
    </div>
  ),
};

export const MonthOverflow: Story = {
  args: {
    view: 'month',
    date: 14,
    count: 6,
    label: 'Tuesday October 14',
    appointments: [
      ...appts,
      { time: '11:00', patient: 'Kristin Watson', type: 'Annual Wellness', status: 'Confirmed' },
      { time: '11:40', patient: 'Leslie Alexander', type: 'Physical Therapy', status: 'Scheduled' },
    ],
  },
  decorators: inGrid,
};

export const Week: Story = { args: { view: 'week', date: 'Thu 9', appointments: appts, label: 'Thursday October 9' }, decorators: inGrid };

export const DayFree: Story = { args: { view: 'day', time: '9:40 AM' }, decorators: inGrid };

export const DayBlocked: Story = { args: { view: 'day', time: '12:00 PM', blocked: 'Lunch' }, decorators: inGrid };

export const Dim: Story = { args: { view: 'month', date: 30, dim: true, label: 'Tuesday September 30' }, decorators: inGrid };
