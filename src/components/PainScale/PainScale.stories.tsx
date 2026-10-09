import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { PainScale } from './PainScale';

const meta = {
  title: 'Complex/Inpatient nursing/PainScale',
  component: PainScale,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'PainScale records pain on the 0 to 10 numeric scale, a faces scale for children, or FLACC for patients who cannot self-report, with severity band and goal check. The faces are drawn; licensed Wong-Baker artwork is not bundled.',
      },
    },
  },
  argTypes: {
    defaultMode: { control: 'inline-radio', options: ['numeric', 'faces', 'flacc'] },
    readOnly: { control: 'boolean' },
  },
  args: {
    subtitle: 'Hematology-oncology . Lena Brooks, 52 y',
    defaultValue: 7,
    goal: 3,
    reassess: '30 min',
    onChange: fn(),
  },
} satisfies Meta<typeof PainScale>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Numeric, severe, above goal (oncology). */
export const NumericSevere: Story = {};

/** Faces (pediatrics), moderate. */
export const Faces: Story = {
  args: { subtitle: 'Peds . Ava Reyes, 4 y', defaultMode: 'faces', defaultValue: 4, goal: 2, reassess: undefined },
};

/** FLACC (nonverbal, post-op toddler), complete. */
export const FlaccComplete: Story = {
  args: {
    subtitle: 'PACU . Noah Kim, 2 y',
    defaultMode: 'flacc',
    defaultValue: undefined,
    goal: undefined,
    defaultFlacc: { face: 1, legs: 1, activity: 0, cry: 1, consol: 1 },
  },
};

/** FLACC incomplete. */
export const FlaccIncomplete: Story = {
  args: { subtitle: undefined, modes: ['flacc'], defaultMode: 'flacc', defaultValue: undefined, goal: undefined, defaultFlacc: { face: 2 } },
};

/** Numeric only, read only, no pain. */
export const NoPainReadOnly: Story = {
  args: { subtitle: undefined, modes: ['numeric'], defaultValue: 0, readOnly: true, goal: 3 },
};
