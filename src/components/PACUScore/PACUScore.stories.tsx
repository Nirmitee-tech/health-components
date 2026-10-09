import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { PACUScore } from './PACUScore';

const meta = {
  title: 'Complex/ED & periop/PACUScore',
  component: PACUScore,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'PACUScore scores recovery with the modified Aldrete scale (activity, respiration, circulation, consciousness, oxygen saturation; 0 to 2 each, total out of 10) and shows when the patient meets phase I discharge criteria: 9 or more with no item at 0. The scoring is exported as `aldrete` and `ALDRETE_CRITERIA`.',
      },
    },
  },
  args: { onChange: fn() },
} satisfies Meta<typeof PACUScore>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    subtitle: 'PACU bay 3 . Frank Owens . arrived 09:34 . 30 min score',
    defaultValues: { activity: 1, respiration: 2, circulation: 2, consciousness: 1, spo2: 1 },
    history: [
      { time: '09:34', activity: 0, respiration: 1, circulation: 1, consciousness: 1, spo2: 1 },
      { time: '09:49', activity: 1, respiration: 2, circulation: 1, consciousness: 1, spo2: 1 },
    ],
  },
};

export const Showcase: Story = {
  render: (args) => (
    <div className="pv-stack">
      <PACUScore
        {...args}
        name="a"
        subtitle="PACU bay 3 . Frank Owens . arrived 09:34 . 30 min score"
        defaultValues={{ activity: 1, respiration: 2, circulation: 2, consciousness: 1, spo2: 1 }}
        history={[
          { time: '09:34', activity: 0, respiration: 1, circulation: 1, consciousness: 1, spo2: 1 },
          { time: '09:49', activity: 1, respiration: 2, circulation: 1, consciousness: 1, spo2: 1 },
        ]}
      />
      <PACUScore {...args} name="b" subtitle="PACU bay 1 . Aaliyah Brooks . 45 min" defaultValues={{ activity: 2, respiration: 2, circulation: 2, consciousness: 2, spo2: 1 }} />
      <PACUScore
        {...args}
        name="c"
        subtitle="PACU bay 5 . total 9 but activity 0 (spinal)"
        defaultValues={{ activity: 0, respiration: 2, circulation: 2, consciousness: 2, spo2: 2 }}
      />
      <PACUScore {...args} name="d" subtitle="PACU bay 2 . just arrived" />
      <PACUScore {...args} name="f" subtitle="PACU bay 4 . scoring in progress" defaultValues={{ activity: 1, respiration: 2 }} />
      <PACUScore {...args} name="e" subtitle="Signed 11:20" readOnly defaultValues={{ activity: 2, respiration: 2, circulation: 2, consciousness: 2, spo2: 2 }} />
    </div>
  ),
};

export const Ready: Story = {
  args: { subtitle: 'PACU bay 1 . Aaliyah Brooks . 45 min', defaultValues: { activity: 2, respiration: 2, circulation: 2, consciousness: 2, spo2: 1 } },
};

export const NotReadyItemAtZero: Story = {
  args: { subtitle: 'PACU bay 5 . total 9 but activity 0 (spinal)', defaultValues: { activity: 0, respiration: 2, circulation: 2, consciousness: 2, spo2: 2 } },
};

export const NotScored: Story = { args: { subtitle: 'PACU bay 2 . just arrived' } };

export const Signed: Story = {
  args: { subtitle: 'Signed 11:20', readOnly: true, defaultValues: { activity: 2, respiration: 2, circulation: 2, consciousness: 2, spo2: 2 } },
};
