import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ScoreQuestionnaire } from './ScoreQuestionnaire';

const gad7 = [
  'Feeling nervous, anxious, or on edge',
  'Not being able to stop or control worrying',
  'Worrying too much about different things',
  'Trouble relaxing',
  'Being so restless that it is hard to sit still',
  'Becoming easily annoyed or irritable',
  'Feeling afraid, as if something awful might happen',
];

const phq9 = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself, or that you are a failure or have let yourself or your family down',
  'Trouble concentrating on things, such as reading the newspaper or watching television',
  'Moving or speaking so slowly that other people could have noticed, or being so fidgety or restless that you have been moving around a lot more than usual',
  'Thoughts that you would be better off dead, or of hurting yourself in some way',
];

const meta = {
  title: 'Complex/Orders and notes/ScoreQuestionnaire',
  component: ScoreQuestionnaire,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'ScoreQuestionnaire runs GAD-7 or PHQ-9 with a live total and severity band, and flags a positive PHQ-9 item 9. Each item is a radio group (arrow keys move and choose); the score is announced politely.',
      },
    },
  },
  argTypes: {
    instrument: { control: 'inline-radio', options: ['GAD-7', 'PHQ-9'] },
    title: { control: 'text' },
  },
  args: { instrument: 'GAD-7', title: 'Generalized anxiety', questions: gad7, onChange: fn() },
} satisfies Meta<typeof ScoreQuestionnaire>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** The design system demo: GAD-7 with six of seven items answered. */
export const GAD7InProgress: Story = { args: { answers: [2, 2, 1, 2, 1, 1, null] } };

export const PHQ9Item9Positive: Story = {
  args: { instrument: 'PHQ-9', title: 'Depression', questions: phq9, answers: [2, 3, 2, 2, 1, 2, 1, 1, 1] },
};

export const Unanswered: Story = { args: { instrument: 'PHQ-9', title: 'Depression', questions: phq9, answers: [] } };
