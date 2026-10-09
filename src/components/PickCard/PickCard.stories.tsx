import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { PickCard } from './PickCard';

const meta = {
  title: 'Basic/Layout/PickCard',
  component: PickCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'PickCard is a large selectable card for choosing one option on phones, portal and kiosk (appointment, provider, reason). It is a toggle button (`aria-pressed`); the screen keeps which card is selected.',
      },
    },
  },
  args: { title: 'Thu 10/09 9:20 AM', meta: 'Follow-Up . James Bell MD . Main Street', onClick: fn() },
} satisfies Meta<typeof PickCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { selected: true } };

export const Showcase: Story = {
  render: () => (
    <div className="pv-grid">
      <PickCard title="Thu 10/09 9:20 AM" meta="Follow-Up . James Bell MD . Main Street" selected />
      <PickCard title="Thu 10/09 2:30 PM" meta="Telehealth . Priya Shah MD" />
      <PickCard title="Fri 10/10" meta="Fully booked" disabled />
    </div>
  ),
};

export const ChooseOne: Story = {
  render: function Render() {
    const [pick, setPick] = useState('a');
    const options = [
      { id: 'a', title: 'Thu 10/09 9:20 AM', meta: 'Follow-Up . James Bell MD . Main Street' },
      { id: 'b', title: 'Thu 10/09 2:30 PM', meta: 'Telehealth . Priya Shah MD' },
      { id: 'c', title: 'Fri 10/10 8:00 AM', meta: 'Follow-Up . James Bell MD . Main Street' },
    ];
    return (
      <div className="pv-stack" style={{ maxWidth: 430 }}>
        {options.map((o) => (
          <PickCard key={o.id} title={o.title} meta={o.meta} selected={pick === o.id} onClick={() => setPick(o.id)} />
        ))}
      </div>
    );
  },
};

export const Disabled: Story = { args: { title: 'Fri 10/10', meta: 'Fully booked', disabled: true } };
