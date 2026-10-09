import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { SuperbillTable, type SuperbillGroup } from './SuperbillTable';

const feeSheet: SuperbillGroup[] = [
  {
    name: 'Office visits, established',
    codes: [
      { code: '99212', label: 'Straightforward', fee: 76 },
      { code: '99213', label: 'Low', fee: 118 },
      { code: '99214', label: 'Moderate', fee: 182 },
    ],
  },
  {
    name: 'In-office labs and procedures',
    codes: [
      { code: '83036', label: 'Hemoglobin A1c', fee: 38 },
      { code: '81002', label: 'Urinalysis, non-auto', fee: 12 },
      { code: '96127', label: 'Brief behavioral assessment', fee: 22 },
    ],
  },
];

const meta = {
  title: 'Complex/Revenue/SuperbillTable',
  component: SuperbillTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'SuperbillTable is the tick-box fee sheet grouped by visit type with fees and a running total. Selection is uncontrolled with `defaultSelected`, or controlled with `selected` and `onSelectedChange`.',
      },
    },
  },
  args: {
    groups: feeSheet,
    subtitle: 'Henna West . 10/09/2026 . Family Medicine',
    onSelectedChange: fn(),
    onPrint: fn(),
    onSend: fn(),
  },
} satisfies Meta<typeof SuperbillTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { defaultSelected: ['99214', '83036'] } };

export const Empty: Story = {};

export const Controlled: Story = {
  render: (args) => {
    const [codes, setCodes] = useState<string[]>(['99213']);
    return (
      <div className="pv-stack">
        <SuperbillTable {...args} selected={codes} onSelectedChange={setCodes} />
        <p className="pv-label">Selected: {codes.join(', ') || 'none'}</p>
      </div>
    );
  },
};
