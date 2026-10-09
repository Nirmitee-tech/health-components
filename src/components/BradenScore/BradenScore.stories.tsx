import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { BradenScore } from './BradenScore';

const meta = {
  title: 'Complex/Inpatient nursing/BradenScore',
  component: BradenScore,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'BradenScore is the Braden Scale for pressure injury risk: six subscales, automatic total from 6 to 23 and the risk band (lower is higher risk).',
      },
    },
  },
  argTypes: { readOnly: { control: 'boolean' } },
  args: {
    subtitle: 'MICU Bed 3 . Daniel Okafor, 58 y',
    defaultValues: { sensory: 0, moisture: 1, activity: 0, mobility: 0, nutrition: 1, friction: 0 },
    previous: { total: 9, when: 'yesterday' },
    onChange: fn(),
  },
} satisfies Meta<typeof BradenScore>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Very high risk: ICU, ventilated. */
export const VeryHighRisk: Story = {};

/** Mild risk: geriatrics. */
export const MildRisk: Story = {
  args: {
    subtitle: 'Rose Alvarez, 88 y . Acute care for elders',
    defaultValues: { sensory: 2, moisture: 2, activity: 2, mobility: 2, nutrition: 2, friction: 1 },
    previous: undefined,
  },
};

/** No risk, read only. */
export const NoRiskReadOnly: Story = {
  args: {
    subtitle: 'Signed 08:00',
    readOnly: true,
    defaultValues: { sensory: 3, moisture: 3, activity: 3, mobility: 3, nutrition: 2, friction: 2 },
    previous: undefined,
  },
};

/** Incomplete. */
export const Incomplete: Story = {
  args: { subtitle: 'Admission', defaultValues: { sensory: 2, moisture: 1 }, previous: undefined },
};
