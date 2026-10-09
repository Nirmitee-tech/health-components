import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { DatePicker } from './DatePicker';

const meta = {
  title: 'Basic/Inputs/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'DatePicker takes a date as MM/DD/YYYY by typing or from a month grid. Typing always works; the grid is optional. In the grid, arrow keys move by day and week, Home/End go to the start or end of the week, PageUp/PageDown change month (Shift for year), Enter picks and Escape closes.',
      },
    },
  },
  args: { label: 'Date of Service', today: '10/09/2026', onChange: fn() },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 400, maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { required: true, defaultValue: '10/09/2026' } };

export const Showcase: Story = {
  render: () => (
    <div className="pv-grid" style={{ minHeight: 360 }}>
      <DatePicker label="Date of Service" required defaultValue="10/09/2026" defaultOpen disableWeekends today="10/09/2026" />
      <DatePicker label="Date of Birth" defaultValue="02/30/1988" disableFuture today="10/09/2026" />
      <DatePicker label="Coverage Start" defaultValue="01/01/2026" readOnly today="10/09/2026" />
    </div>
  ),
};

export const CalendarOpen: Story = { args: { defaultValue: '10/14/2026', defaultOpen: true, disablePast: true } };

export const InvalidDate: Story = { args: { label: 'Date of Birth', defaultValue: '02/30/1988', disableFuture: true } };

export const ReadOnly: Story = { args: { label: 'Coverage Start', defaultValue: '01/01/2026', readOnly: true } };
