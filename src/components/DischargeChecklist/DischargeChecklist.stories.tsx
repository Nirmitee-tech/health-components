import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { DischargeChecklist, type DischargeItem } from './DischargeChecklist';

const items: DischargeItem[] = [
  {
    label: 'Medication reconciliation signed',
    required: true,
    done: true,
    auto: true,
    by: 'Dr. Raman',
  },
  {
    label: 'Follow-up booked with cardiology',
    required: true,
    done: true,
    by: 'L. Chen, RN CM',
  },
  {
    label: 'Home oxygen delivered',
    detail: '2 L/min by nasal cannula, Apria',
    required: true,
    owner: 'Case management',
  },
  { label: 'Teach-back on daily weights', required: true, owner: 'Primary RN' },
  {
    label: 'Ride confirmed',
    detail: 'Daughter, 14:00',
    done: true,
    by: 'Unit clerk',
  },
  { label: 'Flu vaccine offered' },
];
const ready = items.map((i) => ({
  ...i,
  done: true,
  by: i.by || 'J. Patel, RN',
}));

const meta = {
  title: 'Complex/Inpatient flow/DischargeChecklist',
  component: DischargeChecklist,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'DischargeChecklist tracks the tasks that must be done before a patient leaves, who owns each one, and turns on Ready for Discharge only when the required ones are done. Items filled from the chart (`auto`) cannot be ticked by hand; a tick stamps the `user` name.',
      },
    },
  },
  argTypes: {
    rangeContext: {
      control: 'select',
      options: [undefined, 'outpatient', 'inpatient', 'ed', 'pediatric', 'pregnancy'],
    },
  },
  args: {
    patient: 'Okafor, Grace',
    edd: 'Today 14:00',
    items,
    user: 'J. Patel, RN',
    onReady: fn(),
  },
} satisfies Meta<typeof DischargeChecklist>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: () => (
    <div className="pv-stack" style={{ gap: 16 }}>
      <DischargeChecklist patient="Okafor, Grace" edd="Today 14:00" items={items} />
      <DischargeChecklist patient="Lee, Daniel" edd="Today 17:00" items={ready.slice(1, 5)} />
      <DischargeChecklist patient="Ruiz, Carmen" edd="10/12" items={items.slice(0, 3)} readOnly />
    </div>
  ),
};

export const Ready: Story = {
  args: {
    patient: 'Lee, Daniel',
    edd: 'Today 17:00',
    items: ready.slice(1, 5),
  },
};

export const ReadOnly: Story = {
  args: {
    patient: 'Ruiz, Carmen',
    edd: '10/12',
    items: items.slice(0, 3),
    readOnly: true,
  },
};
