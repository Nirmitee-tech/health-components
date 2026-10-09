import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { FallRiskScore } from './FallRiskScore';

const meta = {
  title: 'Complex/Inpatient nursing/FallRiskScore',
  component: FallRiskScore,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'FallRiskScore is the Morse Fall Scale: six items, automatic total and the risk band with the precautions it calls for. Each item is a radio group (arrow keys move and choose); the total is announced politely.',
      },
    },
  },
  argTypes: { readOnly: { control: 'boolean' } },
  args: {
    subtitle: 'Marcus Hill . 4 West',
    defaultValues: { history: 1, secondary: 1, aid: 1, iv: 1, gait: 2, mental: 0 },
    previous: { total: 35, when: 'yesterday 20:00' },
    onChange: fn(),
  },
} satisfies Meta<typeof FallRiskScore>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** High risk: ortho post-op. */
export const HighRisk: Story = {};

/** Moderate risk: cardiology. */
export const ModerateRisk: Story = {
  args: { subtitle: 'Grace Kim, 74 y . Telemetry', defaultValues: { history: 0, secondary: 1, aid: 0, iv: 1, gait: 0, mental: 0 }, previous: undefined },
};

/** Low risk, read only. */
export const LowRiskReadOnly: Story = {
  args: {
    subtitle: 'Signed 07:45',
    readOnly: true,
    defaultValues: { history: 0, secondary: 0, aid: 0, iv: 0, gait: 0, mental: 0 },
    previous: undefined,
  },
};

/** Incomplete. */
export const Incomplete: Story = {
  args: { subtitle: 'Admission in progress', defaultValues: { history: 1, iv: 1 }, previous: undefined },
};
