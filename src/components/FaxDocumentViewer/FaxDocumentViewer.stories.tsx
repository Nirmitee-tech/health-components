import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { FaxDocumentViewer } from './FaxDocumentViewer';

const patients = [
  { value: '1', label: 'Henna West', meta: '03/14/1988 . MRN-100231' },
  { value: '2', label: 'Ralph Edwards', meta: '11/02/1951 . MRN-100118' },
];

const meta = {
  title: 'Complex/Work queues/FaxDocumentViewer',
  component: FaxDocumentViewer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'FaxDocumentViewer shows an incoming fax page next to the indexing form: patient, document type, route, file or junk, with an AI match suggestion. A person always confirms the patient match before filing.',
      },
    },
  },
  argTypes: {
    pages: { control: { type: 'number', min: 1 } },
    page: { control: { type: 'number', min: 1 } },
    ai: { control: 'object' },
    patients: { control: 'object' },
  },
  args: {
    from: 'From: Lakeview Heart (312) 555-0188',
    pages: 3,
    patients,
    onPageChange: fn(),
    onFile: fn(),
    onJunk: fn(),
  },
} satisfies Meta<typeof FaxDocumentViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const SuggestedMatch: Story = {
  args: {
    ai: {
      text: 'Name and DOB on page 1 match Ralph Edwards (11/02/1951). A candidate: confirm before filing.',
      confidence: 'high',
    },
  },
};

export const SearchStarted: Story = {
  args: { from: 'From: Quest Diagnostics (800) 555-0110', pages: 1, patientQuery: 'Henna' },
};
