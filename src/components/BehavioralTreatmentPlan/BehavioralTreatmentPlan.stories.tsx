import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { BehavioralTreatmentPlan, type TreatmentProblem } from './BehavioralTreatmentPlan';

const probs: TreatmentProblem[] = [
  {
    code: 'F33.1',
    label: 'Major depressive disorder, recurrent, moderate',
    priority: 'High',
    evidence: 'PHQ-9 of 17 at intake, low mood most days, withdrawn from friends.',
    goals: [
      {
        text: 'Reduce depressive symptoms and return to daily routine',
        words: 'I want to feel like myself again and go back to work full time.',
        objectives: [
          {
            text: 'PHQ-9 below 10 on two visits in a row',
            target: '12/15/2026',
            status: 'progressing',
            measure: { name: 'PHQ-9', k: 'pts', baseline: 17, current: 12, target: 9 },
            interventions: [
              { text: 'Cognitive behavioral therapy, 50 minutes', frequency: 'weekly', who: 'Dana Morales, LCSW' },
              { text: 'Medication management, sertraline', frequency: 'every 4 weeks', who: 'Dr. Kevin Ito, psychiatry' },
            ],
          },
          {
            text: 'Do 3 planned pleasant activities each week, logged in the app',
            target: '11/15/2026',
            status: 'met',
            interventions: [{ text: 'Behavioral activation and activity scheduling', frequency: 'weekly', who: 'Dana Morales, LCSW' }],
          },
        ],
      },
    ],
  },
  {
    code: 'F41.1',
    label: 'Generalized anxiety disorder',
    priority: 'Medium',
    evidence: 'GAD-7 of 13, worry about job and finances, poor sleep.',
    goals: [
      {
        text: 'Manage worry so it does not stop sleep or work',
        objectives: [
          {
            text: 'Use a relaxation skill on 5 of 7 days',
            target: '01/10/2027',
            status: 'not started',
            measure: { name: 'GAD-7', k: 'pts', baseline: 13, current: 13, target: 7 },
            interventions: [{ text: 'Progressive muscle relaxation and worry time', frequency: 'weekly', who: 'Dana Morales, LCSW' }],
          },
        ],
      },
    ],
  },
];

const meta = {
  title: 'Complex/Specialty/BehavioralTreatmentPlan',
  component: BehavioralTreatmentPlan,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'BehavioralTreatmentPlan lays out a behavioral health plan as problems, goals, measurable objectives and the interventions for each, with target dates, progress, review date and signatures.',
      },
    },
  },
  argTypes: {
    rangeContext: { control: 'select', options: [undefined, 'outpatient', 'inpatient', 'ed', 'pediatric', 'pregnancy'] },
    readOnly: { control: 'boolean' },
    reviewOverdue: { control: 'boolean' },
    title: { control: 'text' },
    subtitle: { control: 'text' },
    reviewDue: { control: 'text' },
  },
  args: {
    subtitle: 'Jordan Ellis . intake 09/10/2026',
    reviewDue: '12/09/2026',
    signatures: [{ role: 'Clinician', date: '09/24/2026' }, { role: 'Client' }],
    problems: probs,
    onReviewPlan: fn(),
    onSignPlan: fn(),
  },
} satisfies Meta<typeof BehavioralTreatmentPlan>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Active plan, client signature needed. */
export const Playground: Story = {};

/** Review overdue, read-only. */
export const ReviewOverdue: Story = {
  args: {
    subtitle: 'Sam Rivera . SUD IOP',
    readOnly: true,
    reviewDue: '09/30/2026',
    reviewOverdue: true,
    signatures: [
      { role: 'Clinician', date: '07/01/2026' },
      { role: 'Client', date: '07/01/2026' },
    ],
    problems: [
      {
        code: 'F10.20',
        label: 'Alcohol use disorder, moderate',
        priority: 'High',
        evidence: 'AUDIT 22; two DUIs.',
        goals: [
          {
            text: 'Stay abstinent from alcohol',
            objectives: [
              {
                text: 'Negative breath alcohol at every IOP session',
                target: '09/30/2026',
                status: 'not met',
                interventions: [{ text: 'Group therapy, relapse prevention', frequency: '3x/week', who: 'IOP team' }],
              },
            ],
          },
        ],
      },
    ],
  },
};
