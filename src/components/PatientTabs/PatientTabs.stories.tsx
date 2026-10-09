import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { PatientTabs, type PatientTab } from './PatientTabs';

const tabs: PatientTab[] = [
  { id: 's', name: 'Schedule', icon: 'calendar', pinned: true },
  { id: 'p1', name: 'Henna West', meta: 'F 38' },
  { id: 'p2', name: 'Ralph Edwards', meta: 'M 74' },
  { id: 'p3', name: 'Nora Scott', meta: 'F 27' },
];

const meta = {
  title: 'Complex/Navigation/PatientTabs',
  component: PatientTabs,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'PatientTabs keep several open patients as closable tabs across the top, like a browser, in the Focus Rail style. Arrow keys, Home and End move between tabs; Delete closes the focused tab; each close button names the patient.',
      },
    },
  },
  args: { tabs, defaultActive: 'p1', onAdd: fn(), onChange: fn(), onClose: fn() },
} satisfies Meta<typeof PatientTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const TwoCharts: Story = {
  args: {
    tabs: [
      { id: 'a', name: 'Henna West', meta: 'F 38' },
      { id: 'b', name: 'Ralph Edwards', meta: 'M 74' },
    ],
    defaultActive: 'a',
  },
};
