import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AfterVisitSummary, type AfterVisitMed } from './AfterVisitSummary';

const meds: AfterVisitMed[] = [
  {
    name: 'Furosemide',
    dose: 40,
    unit: 'mg',
    route: 'by mouth',
    freq: 'twice a day',
    action: 'changed',
    note: 'Was 20 mg once a day. Weigh yourself every morning.',
  },
  {
    name: 'Metoprolol succinate',
    dose: 25,
    unit: 'mg',
    route: 'by mouth',
    freq: 'once a day',
    action: 'new',
  },
  {
    name: 'Lisinopril',
    dose: 10,
    unit: 'mg',
    route: 'by mouth',
    freq: 'once a day',
    action: 'continue',
  },
  {
    name: 'Potassium chloride',
    dose: 0.5,
    unit: 'tablet',
    route: 'by mouth',
    freq: 'once a day',
    action: 'continue',
  },
  {
    name: 'Ibuprofen',
    dose: 400,
    unit: 'mg',
    action: 'stop',
    note: 'It can make your heart failure worse. Use acetaminophen for pain.',
  },
];

const meta = {
  title: 'Complex/Inpatient flow/AfterVisitSummary',
  component: AfterVisitSummary,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'AfterVisitSummary is the plain-language discharge summary a patient takes home: why they were here, last results, new, changed, continued and stopped medicines, appointments, home care and warning signs. Doses drop trailing zeros and keep a leading zero (0.5 tablet, 40 mg).',
      },
    },
  },
  argTypes: {
    rangeContext: {
      control: 'select',
      options: [undefined, 'outpatient', 'inpatient', 'ed', 'pediatric', 'pregnancy'],
    },
  },
  args: {
    patient: 'Grace Okafor',
    dates: 'Oct 6 to Oct 9, 2026',
    reason:
      'Your heart was not pumping well, so fluid built up in your lungs and legs. We removed the extra fluid with medicine.',
    meds,
    results: [
      { measure: 'k', value: 3.4 },
      { measure: 'creat', value: 1.31 },
      { measure: 'weight', value: 78.2 },
    ],
    followups: [
      {
        when: 'Tue Oct 13, 10:30',
        with: 'Dr. Marcus Feld, Cardiology',
        where: 'Heart Clinic, 2nd floor',
      },
      { when: 'Within 7 days', with: 'Your primary care doctor, Dr. Ito' },
    ],
    instructions: [
      'Weigh yourself every morning before breakfast. Call if you gain more than 1 kg in a day or 2 kg in a week.',
      'Keep salt under 2,000 mg a day.',
    ],
    warnings: ['Trouble breathing when lying flat', 'Chest pain', 'Fainting'],
    onPrint: fn(),
    onSendToPortal: fn(),
  },
} satisfies Meta<typeof AfterVisitSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: (args) => (
    <div className="pv-stack" style={{ gap: 16 }}>
      <AfterVisitSummary {...args} />
      <AfterVisitSummary
        patient="Daniel Lee"
        dates="Oct 9, 2026 (observation)"
        language="Spanish"
        reason="You fainted. Your heart tests and blood tests were normal."
        followups={[{ when: 'Within 2 weeks', with: 'Primary care' }]}
      />
    </div>
  ),
};

export const SecondLanguage: Story = {
  args: {
    patient: 'Daniel Lee',
    dates: 'Oct 9, 2026 (observation)',
    language: 'Spanish',
    reason: 'You fainted. Your heart tests and blood tests were normal.',
    meds: [],
    results: [],
    followups: [{ when: 'Within 2 weeks', with: 'Primary care' }],
    instructions: undefined,
    warnings: undefined,
  },
};
