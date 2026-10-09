import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { TimeSlotPicker, type TimeSlot, type TimeSlotDay } from './TimeSlotPicker';

const slots: TimeSlot[] = ['8:00 AM', '8:20 AM', '8:40 AM', '9:00 AM', '9:20 AM', '9:40 AM', '10:00 AM', '10:20 AM', '10:40 AM', '11:00 AM'].map(
  (time, i) => ({ time, state: [1, 2, 5].includes(i) ? 'booked' : i === 7 ? 'held' : 'available' })
);
const days: TimeSlotDay[] = [
  { id: 'th', weekday: 'Thu', date: 'Oct 9' },
  { id: 'fr', weekday: 'Fri', date: 'Oct 10' },
  { id: 'sa', weekday: 'Sat', date: 'Oct 11', disabled: true },
  { id: 'mo', weekday: 'Mon', date: 'Oct 13' },
  { id: 'tu', weekday: 'Tue', date: 'Oct 14' },
];

const meta = {
  title: 'Complex/Scheduling/TimeSlotPicker',
  component: TimeSlotPicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'TimeSlotPicker shows open times as a grid of slots, with booked, held, available and selected states, and an optional day strip. Days and slots are radio groups: Arrow keys move and select, Home and End jump to the first and last open item. Also exported as `SlotPicker`.',
      },
    },
  },
  argTypes: { label: { control: 'text' } },
  args: { slots, onChange: fn(), onDayChange: fn() },
} satisfies Meta<typeof TimeSlotPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { label: 'Priya Shah MD . Follow-Up 20 min', days, defaultValue: '9:00 AM' } };

export const SlotsOnly: Story = { args: { label: 'James Bell MD . New Patient 40 min' } };

export const NothingSelected: Story = { args: { days, defaultDay: 'fr' } };

export const Controlled: Story = {
  render: function Render(args) {
    const [time, setTime] = useState<string | null>('9:20 AM');
    const [day, setDay] = useState('th');
    return (
      <div className="pv-stack">
        <TimeSlotPicker {...args} days={days} day={day} onDayChange={setDay} value={time} onChange={setTime} label="Priya Shah MD . Follow-Up 20 min" />
        <div className="co-muted">
          Chosen: {days.find((d) => d.id === day)?.date} at {time ?? 'no time yet'}
        </div>
      </div>
    );
  },
};
