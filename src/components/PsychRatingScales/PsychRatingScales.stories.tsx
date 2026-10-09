import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { PsychRatingScales, type PsychHistoryEntry } from './PsychRatingScales';

const hist: PsychHistoryEntry[] = [
  { date: '06/02/2026', phq9: 19, gad7: 15, cssrs: 'low' },
  { date: '08/01/2026', phq9: 17, gad7: 13, cssrs: 'none' },
];

const meta = {
  title: 'Complex/Specialty/PsychRatingScales',
  component: PsychRatingScales,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'PsychRatingScales gives PHQ-9, GAD-7 and the C-SSRS screen in tabs, scores them live with the published bands, and escalates suicide risk with the actions to take.',
      },
    },
  },
  argTypes: {
    defaultTab: { control: 'inline-radio', options: ['phq9', 'gad7', 'cssrs'] },
    rangeContext: { control: 'select', options: [undefined, 'outpatient', 'inpatient', 'ed', 'pediatric', 'pregnancy'] },
    readOnly: { control: 'boolean' },
    title: { control: 'text' },
    subtitle: { control: 'text' },
  },
  args: {
    subtitle: 'Jordan Ellis . 10/09/2026',
    defaultAnswers: { phq9: [2, 2, 1, 2, 1, 1, 1, 0, 1], gad7: [2, 2, 1, 1, 0, 1, 1] },
    history: hist,
    onAnswersChange: fn(),
    onTabChange: fn(),
    onCallCrisisTeam: fn(),
    onStartSafetyPlan: fn(),
  },
} satisfies Meta<typeof PsychRatingScales>;

export default meta;
type Story = StoryObj<typeof meta>;

/** PHQ-9 complete, item 9 positive. */
export const Playground: Story = {};

/** GAD-7 partly answered. */
export const Gad7Partial: Story = { args: { subtitle: 'Mia Turner', defaultTab: 'gad7', defaultAnswers: { gad7: [1, 2, 1] }, history: [] } };

/** C-SSRS moderate risk. */
export const CssrsModerate: Story = {
  args: {
    subtitle: 'Chris Park',
    defaultTab: 'cssrs',
    defaultAnswers: { cssrs: { q1: true, q2: true, q3: true, q4: false, q5: false, q6: false } },
    history: [],
  },
};

/** C-SSRS high risk, read-only. */
export const CssrsHighReadOnly: Story = {
  args: {
    subtitle: 'Alex Moore . ED',
    defaultTab: 'cssrs',
    readOnly: true,
    defaultAnswers: { cssrs: { q1: true, q2: true, q3: true, q4: true, q5: false, q6: true, q6r: true } },
    history: [],
  },
};

/** C-SSRS no risk. */
export const CssrsNoRisk: Story = {
  args: { subtitle: 'Lena Fox', defaultTab: 'cssrs', defaultAnswers: { cssrs: { q1: false, q2: false, q6: false } }, history: [] },
};
