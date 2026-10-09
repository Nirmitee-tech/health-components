import type { Meta, StoryObj } from '@storybook/react-vite';
import { RANGE_CONTEXTS } from '../../clinical';
import { ChartSummary, type ChartSummaryProblem } from './ChartSummary';

const problems: ChartSummaryProblem[] = [
  {
    code: 'E11.65',
    label: 'Type 2 diabetes with hyperglycemia',
    onset: '2019',
    chronic: true,
    specialty: 'Endocrinology',
    results: [
      { code: 'A1c', value: 8.4, date: '09/22/2026' },
      { code: 'eGFR', value: 52, date: '09/22/2026' },
    ],
    meds: ['Metformin 1000 mg BID', 'Empagliflozin 10 mg daily'],
    plan: 'Add GLP-1 if A1c above 8 % at next visit',
    gap: 'Retinal exam overdue',
  },
  {
    code: 'I50.22',
    label: 'Chronic systolic heart failure',
    onset: '2022',
    chronic: true,
    specialty: 'Cardiology',
    results: [
      { code: 'BNP', value: 1840, date: '10/01/2026' },
      { code: 'K', value: 5.6, date: '10/01/2026' },
      { code: 'Na', value: 133, date: '10/01/2026' },
    ],
    meds: ['Sacubitril/valsartan 49/51 mg BID', 'Carvedilol 12.5 mg BID', 'Spironolactone 25 mg daily'],
    plan: 'Recheck potassium in 1 week; hold spironolactone if above 5.5',
  },
  {
    code: 'F33.1',
    label: 'Major depressive disorder, recurrent, moderate',
    onset: '2021',
    specialty: 'Behavioral health',
    results: [{ code: 'PHQ9', value: 14, date: '10/01/2026' }],
    meds: ['Sertraline 100 mg daily'],
    plan: 'Therapy referral placed',
  },
  {
    code: 'N18.3',
    label: 'Chronic kidney disease, stage 3',
    onset: '2024',
    chronic: true,
    specialty: 'Nephrology',
    results: [{ code: 'Cr', value: 1.48, date: '09/22/2026' }],
  },
];

const meta = {
  title: 'Complex/Chart panels/ChartSummary',
  component: ChartSummary,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'ChartSummary is the one-page, problem-oriented summary: each active problem with the results, medications, plan and care gap that belong to it, plus allergies, code status and last vitals. `allergies` undefined means not reviewed; `[]` means No Known Allergies. Values are formatted and flagged by the shared `fmt` rules for the `rangeContext`.',
      },
    },
  },
  argTypes: {
    rangeContext: { control: 'select', options: [undefined, ...RANGE_CONTEXTS] },
  },
  args: {
    subtitle: 'Ralph Edwards . 74 y . MRN-100118',
    problems,
    allergies: [
      { substance: 'Penicillin', severity: 'severe' },
      { substance: 'Lisinopril (angioedema)', severity: 'severe' },
    ],
    codeStatus: 'DNR/DNI',
    vitals: [
      { code: 'SBP', value: 148 },
      { code: 'DBP', value: 86 },
      { code: 'HR', value: 58 },
      { code: 'SpO2', value: 94 },
      { code: 'Wt', value: 88.35 },
      { code: 'Temp', value: 36.8 },
    ],
    vitalsTaken: '10/09/2026 09:12',
    gaps: ['Pneumococcal vaccine due', 'Diabetic foot exam due'],
  },
} satisfies Meta<typeof ChartSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: (args) => (
    <div className="co-dt">
      <ChartSummary {...args} />
      <div className="pv-grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(380px,1fr))' }}>
        <ChartSummary
          title="Pediatrics: well child"
          subtitle="Maya Ortiz . 4 y"
          allergies={[]}
          problems={[
            { code: 'J45.20', label: 'Mild intermittent asthma', onset: '2025', specialty: 'Pediatrics', meds: ['Albuterol HFA 90 mcg 2 puffs q4h PRN'] },
          ]}
          vitals={[
            { code: 'Wt', value: 16.2 },
            { code: 'HR', value: 104 },
            { code: 'Temp', value: 37.2 },
          ]}
        />
        <ChartSummary title="New patient, nothing recorded" subtitle="Henna West . 38 y" />
      </div>
    </div>
  ),
};

export const InpatientContext: Story = { args: { rangeContext: 'inpatient', title: 'Chart Summary (inpatient ranges)' } };

export const NothingRecorded: Story = {
  args: { title: 'New patient, nothing recorded', subtitle: 'Henna West . 38 y', problems: undefined, allergies: undefined, vitals: undefined, codeStatus: undefined, gaps: undefined, vitalsTaken: undefined },
};
