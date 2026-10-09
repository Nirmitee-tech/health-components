import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { RANGE_CONTEXTS } from '../../clinical';
import { HistoryPanels, type HistoryFamilyMember, type HistoryMedicalItem, type HistorySocial, type HistorySurgicalItem } from './HistoryPanels';

const pmh: HistoryMedicalItem[] = [
  { code: 'I21.4', label: 'NSTEMI', when: '2022', note: 'PCI to LAD' },
  { code: 'K35.80', label: 'Acute appendicitis', when: '1989', resolved: true },
  { code: 'O24.419', label: 'Gestational diabetes', when: '2015', resolved: true },
];
const psh: HistorySurgicalItem[] = [
  { cpt: '92928', label: 'Coronary stent, LAD', date: '03/2022', surgeon: 'Dr. Kim', site: 'St. Mary Cath Lab' },
  { cpt: '27447', label: 'Total knee arthroplasty', date: '06/2019', laterality: 'Right', complication: 'Post-op DVT' },
  { cpt: '44970', label: 'Laparoscopic appendectomy', date: '1989' },
];
const family: HistoryFamilyMember[] = [
  {
    relation: 'Father',
    side: 'Paternal',
    deceased: true,
    ageAtDeath: 61,
    conditions: [
      { label: 'Myocardial infarction', onset: 58, causeOfDeath: true },
      { label: 'Type 2 diabetes', onset: 45 },
    ],
  },
  { relation: 'Mother', age: 92, conditions: [{ label: 'Breast cancer', onset: 67 }, { label: 'Osteoporosis' }] },
  { relation: 'Brother', age: 70, conditions: [{ label: 'Colon cancer', onset: 49 }] },
  { relation: 'Sister', age: 66, conditions: [] },
  { relation: 'Maternal grandfather', side: 'Maternal', unknown: true },
];
const social: HistorySocial = {
  tobacco: 'Former smoker, quit 2015',
  packYears: 22.5,
  alcohol: '2 to 3 drinks a week',
  auditC: 3,
  sex: 'M',
  drugs: 'None',
  occupation: 'Retired electrician',
  livesWith: 'Wife',
  sexual: 'Not asked',
  sdohTool: 'AHC HRSN',
  sdohDate: '10/09/2026',
  sdoh: [
    { domain: 'Food insecurity', loinc: '88122-7', answer: 'Sometimes true', result: 'positive' },
    { domain: 'Housing instability', loinc: '71802-3', answer: 'Steady place', result: 'negative' },
    { domain: 'Transportation', loinc: '93030-5', answer: 'Yes, missed visits', result: 'positive', referral: 'Referred to ride program 10/09' },
    { domain: 'Utilities', loinc: '96779-4', answer: '', result: 'declined' },
    { domain: 'Interpersonal safety', loinc: '95618-5', answer: 'Never', result: 'negative' },
  ],
};

const meta = {
  title: 'Complex/Chart panels/HistoryPanels',
  component: HistoryPanels,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'HistoryPanels holds past medical, surgical, family and social history in tabs, with family history as a relative-by-relative pedigree list and social history including the social needs (SDOH) screening. A section that is undefined shows "not asked"; an empty list shows "none".',
      },
    },
  },
  argTypes: {
    defaultTab: { control: 'inline-radio', options: ['pmh', 'psh', 'fam', 'soc'] },
    tab: { control: 'inline-radio', options: [undefined, 'pmh', 'psh', 'fam', 'soc'] },
    rangeContext: { control: 'select', options: [undefined, ...RANGE_CONTEXTS] },
  },
  args: {
    reviewed: '10/09/2026 by Lisa Chen RN',
    pmh,
    psh,
    family,
    social,
    defaultTab: 'soc',
    onTabChange: fn(),
    onMarkReviewed: fn(),
    onAdd: fn(),
    onRefer: fn(),
  },
} satisfies Meta<typeof HistoryPanels>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: (args) => (
    <div className="pv-grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(420px,1fr))' }}>
      <HistoryPanels {...args} />
      <HistoryPanels pmh={pmh} psh={psh} family={family} defaultTab="fam" />
      <HistoryPanels pmh={[]} psh={psh} defaultTab="psh" />
      <HistoryPanels title="History, new patient" readOnly />
    </div>
  ),
};

export const Medical: Story = { args: { defaultTab: 'pmh' } };

export const FamilyPedigree: Story = { args: { defaultTab: 'fam', reviewed: undefined } };

export const NotAsked: Story = {
  args: { title: 'History, new patient', readOnly: true, pmh: undefined, psh: undefined, family: undefined, social: undefined, defaultTab: 'pmh', reviewed: undefined },
};
