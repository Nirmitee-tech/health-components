import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SigBuilder, sigText, type Sig } from './SigBuilder';

const meta = {
  title: 'Complex/Medications/SigBuilder',
  component: SigBuilder,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'SigBuilder builds the directions from dose, route, frequency and duration and shows the plain-language sig the patient will read. Frequencies are spelled out, never Latin abbreviations. For C-II drugs the Refills helper says none are allowed.',
      },
    },
  },
  args: {
    value: {
      dose: '1 tablet',
      route: 'by mouth',
      freq: 'every 6 hours',
      prn: 'pain',
      duration: '5 days',
      qty: 20,
      refills: 0,
      schedule: 'C-II',
    },
  },
} satisfies Meta<typeof SigBuilder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Maintenance: Story = {
  args: { value: { dose: '1 tablet', route: 'by mouth', freq: 'twice daily', qty: 60, refills: 3 } },
};

export const Empty: Story = { args: { value: undefined } };

export const Controlled: Story = {
  render: function Render() {
    const [sig, setSig] = useState<Sig>({ dose: '2 puffs', route: 'inhaled', freq: 'every 6 hours', prn: 'wheeze', qty: 1, refills: 2 });
    return (
      <div className="co-dt">
        <SigBuilder value={sig} onChange={setSig} />
        <span className="co-mi-s">{`Saved to the order: ${sigText(sig)}`}</span>
      </div>
    );
  },
};
