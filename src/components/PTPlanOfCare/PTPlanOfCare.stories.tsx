import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { PTPlanOfCare, type PTGoal, type PTScore } from './PTPlanOfCare';

const scores: PTScore[] = [
  { name: 'LEFS', range: '0 to 80, higher is better', k: 'pts', baseline: 22, current: 47, mcid: 9, higherBetter: true },
  { name: 'KOOS JR', range: '0 to 100, higher is better', k: 'pts', baseline: 38, current: 44, mcid: 10, higherBetter: true },
  { name: 'Pain (NPRS)', range: '0 to 10, lower is better', k: 'nprs', baseline: 7, current: 8, mcid: 2, higherBetter: false },
];
const goals: PTGoal[] = [
  { term: 'Short', text: 'Knee flexion to 110 degrees for stairs', k: 'deg', baseline: 72, current: 112, target: 110, status: 'met' },
  { term: 'Short', text: 'Walk 150 m without assistive device', k: 'm', baseline: 40, current: 110, target: 150, status: 'progressing' },
  { term: 'Long', text: 'Knee extension to 0 degrees (full)', k: 'deg', baseline: -12, current: -4, target: 0, status: 'progressing' },
  { term: 'Long', text: 'Return to 18-hole golf walking', k: 'pts', status: 'new' },
];

const meta = {
  title: 'Complex/Specialty/PTPlanOfCare',
  component: PTPlanOfCare,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'PTPlanOfCare shows a therapy plan of care: diagnosis and certification, visits used against the authorization, functional outcome scores against their minimal important change, and short and long term goals.',
      },
    },
  },
  argTypes: {
    rangeContext: { control: 'select', options: [undefined, 'outpatient', 'inpatient', 'ed', 'pediatric', 'pregnancy'] },
    readOnly: { control: 'boolean' },
    title: { control: 'text' },
    subtitle: { control: 'text' },
  },
  args: {
    subtitle: 'Robert Hale . 66 y',
    diagnosis: 'M17.11 Primary osteoarthritis, right knee; s/p TKA 08/20/2026',
    cert: '08/27/2026 to 11/24/2026',
    frequency: '2x/week for 12 weeks',
    referring: 'Dr. Alan Fisher, Orthopedics',
    auth: { used: 10, authorized: 24, payer: 'Medicare Part B', expires: '11/24/2026' },
    visitsSinceProgressNote: 10,
    scores,
    goals,
    onProgressNote: fn(),
    onSendForCertification: fn(),
  },
} satisfies Meta<typeof PTPlanOfCare>;

export default meta;
type Story = StoryObj<typeof meta>;

/** On track, progress note due. */
export const Playground: Story = {};

/** Authorization nearly used, read-only. */
export const AuthorizationNearlyUsed: Story = {
  args: {
    subtitle: 'Jasmine Wright . 29 y . lumbar strain',
    readOnly: true,
    diagnosis: 'M54.50 Low back pain',
    cert: '09/01/2026 to 10/31/2026',
    frequency: '2x/week for 6 weeks',
    referring: 'Self-referred (direct access)',
    auth: { used: 11, authorized: 12, payer: 'UnitedHealthcare', expires: '10/31/2026' },
    visitsSinceProgressNote: 3,
    scores: [{ name: 'ODI', range: '0 to 100%, lower is better', k: 'pct', baseline: 44, current: 38, mcid: 10, higherBetter: false }],
    goals: [{ term: 'Short', text: 'Sit 60 minutes at work with pain 3/10 or less', k: 'nprs', baseline: 7, current: 5, target: 3, status: 'progressing' }],
  },
};
