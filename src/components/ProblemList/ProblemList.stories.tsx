import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ProblemList, type ProblemItem } from './ProblemList';

const problems: ProblemItem[] = [
  { code: 'E11.9', label: 'Type 2 diabetes mellitus without complications', onset: '2019', chronic: true, hcc: '38' },
  { code: 'I10', label: 'Essential (primary) hypertension', onset: '2017', chronic: true },
  { code: 'F41.1', label: 'Generalized anxiety disorder', onset: '2023', by: 'Mandy Harley LCSW' },
  { code: 'S93.401A', label: 'Sprain of right ankle', onset: '2025', status: 'resolved' },
];

const icd10 = [
  { code: 'E78.5', label: 'Hyperlipidemia, unspecified' },
  { code: 'J45.909', label: 'Unspecified asthma, uncomplicated' },
];

const meta = {
  title: 'Complex/Clinical/ProblemList',
  component: ProblemList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'ProblemList is the coded problem list with ICD-10 codes, onset, chronic and HCC tags, filtered by Active, Resolved or All. New problems are added with the ICD-10 picker under the list.',
      },
    },
  },
  argTypes: {
    filter: { control: 'inline-radio', options: [undefined, 'active', 'resolved', 'all'] },
    defaultFilter: { control: 'inline-radio', options: ['active', 'resolved', 'all'] },
  },
  args: { items: problems, icdOptions: icd10, onFilterChange: fn(), onAdd: fn() },
} satisfies Meta<typeof ProblemList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllProblems: Story = { args: { defaultFilter: 'all' } };

export const Resolved: Story = { args: { defaultFilter: 'resolved' } };

export const Empty: Story = { args: { items: [] } };

export const ReadOnly: Story = { args: { readOnly: true } };
