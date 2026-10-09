import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { DateTimeClinical } from './DateTimeClinical';

const meta = {
  title: 'Basic/Clinical values/DateTimeClinical',
  component: DateTimeClinical,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'DateTimeClinical shows dates as MM/DD/YYYY, times in 12- or 24-hour form with an optional zone, and ages from date of birth down to days for newborns, plus gestational age. It renders a `<time>` element.',
      },
    },
  },
  argTypes: {
    mode: { control: 'inline-radio', options: ['date', 'time', 'datetime', 'dob', 'age', 'gestational'] },
    value: { control: 'text' },
    asOf: { control: 'text' },
  },
  args: { mode: 'datetime', value: '2026-10-09T19:05:00Z', timeZone: 'America/Chicago' },
} satisfies Meta<typeof DateTimeClinical>;

export default meta;
type Story = StoryObj<typeof meta>;

const now = '2026-10-09';
const Cell = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="pv-stack" style={{ gap: 2, minWidth: 120 }}>
    <span className="pv-label">{label}</span>
    {children}
  </div>
);

export const Playground: Story = {};

export const DatesAndTimes: Story = {
  render: () => (
    <div className="co-row co-gap-16" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <Cell label="Date">
        <DateTimeClinical value="2026-10-09" />
      </Cell>
      <Cell label="12-hour, Central">
        <DateTimeClinical mode="datetime" value="2026-10-09T19:05:00Z" timeZone="America/Chicago" />
      </Cell>
      <Cell label="24-hour, Eastern">
        <DateTimeClinical mode="datetime" hour24 value="2026-10-09T19:05:00Z" timeZone="America/New_York" />
      </Cell>
      <Cell label="Time, Pacific">
        <DateTimeClinical mode="time" value="2026-10-09T19:05:00Z" timeZone="America/Los_Angeles" />
      </Cell>
    </div>
  ),
};

export const Ages: Story = {
  render: () => (
    <div className="co-row co-gap-16" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <Cell label="Newborn">
        <DateTimeClinical mode="dob" value="2026-10-01" asOf={now} />
      </Cell>
      <Cell label="Infant">
        <DateTimeClinical mode="dob" value="2026-08-28" asOf={now} />
      </Cell>
      <Cell label="Toddler">
        <DateTimeClinical mode="dob" value="2025-01-20" asOf={now} />
      </Cell>
      <Cell label="Adult">
        <DateTimeClinical mode="dob" value="1979-03-14" asOf={now} />
      </Cell>
      <Cell label="Geriatric">
        <DateTimeClinical mode="age" value="1938-11-02" asOf={now} />
      </Cell>
    </div>
  ),
};

export const Obstetrics: Story = {
  render: () => (
    <div className="co-row co-gap-16" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <Cell label="From weeks and days">
        <DateTimeClinical mode="gestational" weeks={38} days={4} />
      </Cell>
      <Cell label="From EDD 11/20/2026">
        <DateTimeClinical mode="gestational" edd="2026-11-20" asOf={now} />
      </Cell>
    </div>
  ),
};

export const PrefixAndRelative: Story = {
  args: { mode: 'datetime', value: '2026-10-09T13:40:00Z', timeZone: 'America/Chicago', prefix: 'Collected', relative: '2 h ago' },
};
