import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Calendar, type CalendarAppointment } from "./Calendar";

const appts: CalendarAppointment[] = [
  {
    day: 9,
    slot: "8:00 AM",
    time: "8:00",
    patient: "Henna West",
    type: "Follow-Up",
    status: "Completed",
    paid: true,
  },
  {
    day: 9,
    slot: "8:40 AM",
    time: "8:40",
    patient: "Ralph Edwards",
    type: "New Patient",
    status: "Arrived",
  },
  {
    day: 9,
    slot: "9:20 AM",
    time: "9:20",
    patient: "Nora Scott",
    type: "Therapy 50",
    status: "Confirmed",
    telehealth: true,
  },
  {
    day: 8,
    time: "10:00",
    patient: "Jacob Jones",
    type: "Well Child",
    status: "Scheduled",
  },
  {
    day: 7,
    time: "1:00",
    patient: "Kristin Watson",
    type: "Annual Wellness",
    status: "No Show",
    paid: false,
  },
  {
    day: 10,
    time: "2:00",
    patient: "Leslie Alexander",
    type: "Physical Therapy",
    status: "Confirmed",
    color: "teal",
  },
];

const busyDay: CalendarAppointment[] = [
  ...appts,
  {
    day: 14,
    time: "8:00",
    patient: "Devon Lane",
    type: "Follow-Up",
    status: "Confirmed",
  },
  {
    day: 14,
    time: "9:00",
    patient: "Esther Howard",
    type: "Lab Review",
    status: "Scheduled",
  },
  {
    day: 14,
    time: "10:00",
    patient: "Cody Fisher",
    type: "New Patient",
    status: "Scheduled",
  },
  {
    day: 14,
    time: "11:00",
    patient: "Jenny Wilson",
    type: "Annual Wellness",
    status: "Confirmed",
  },
];

const meta = {
  title: "Complex/Scheduling/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Calendar is the full schedule with Day, Week and Month views, built from CalendarCell and AppointmentChip. Each view is an ARIA grid; every chip reads time, patient, type and status. Also exported as `ScheduleCalendar`.",
      },
    },
  },
  argTypes: {
    defaultView: { control: "inline-radio", options: ["day", "week", "month"] },
    defaultColorMode: { control: "inline-radio", options: ["status", "type"] },
    colorBy: { control: "boolean" },
    title: { control: "text" },
  },
  args: {
    defaultDate: "2026-10-09",
    today: "2026-10-09",
    appointments: appts,
    onViewChange: fn(),
    onDateChange: fn(),
    onBook: fn(),
    onAppointmentClick: fn(),
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { defaultView: "week", colorBy: true },
};

export const Schedule: Story = {
  render: (args) => (
    <div className="pv-stack">
      <Calendar {...args} defaultView="week" colorBy />
      <Calendar {...args} defaultView="day" blocks={{ "12:00 PM": "Lunch" }} />
    </div>
  ),
};

export const Day: Story = {
  args: { defaultView: "day", blocks: { "12:00 PM": "Lunch" } },
};

export const Month: Story = {
  args: {
    defaultView: "month",
    appointments: busyDay,
    monthBlocks: { 16: "CME conference", 23: "Clinic closed" },
  },
};

export const ColorByType: Story = {
  args: { defaultView: "week", colorBy: true, defaultColorMode: "type" },
};
