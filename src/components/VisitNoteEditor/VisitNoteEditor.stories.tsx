import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { VisitNoteEditor, type VisitNoteCode, type VisitNoteSection } from './VisitNoteEditor';

const icd: VisitNoteCode[] = [
  { code: 'E11.9', label: 'Type 2 diabetes mellitus without complications' },
  { code: 'I10', label: 'Essential (primary) hypertension' },
  { code: 'F41.1', label: 'Generalized anxiety disorder' },
];
const cpt: VisitNoteCode[] = [
  { code: '99214', label: 'Office visit, est., moderate' },
  { code: '99213', label: 'Office visit, est., low' },
  { code: '90837', label: 'Psychotherapy, 60 min' },
];
const sections: VisitNoteSection[] = [
  {
    id: 's',
    title: 'Subjective',
    required: true,
    text: 'Here for A1c follow-up. Taking metformin 500 mg twice daily. No hypoglycemia.',
  },
  { id: 'o', title: 'Objective', text: 'BP 132/84, HR 76, BMI 29.1. A1c 6.8% (07/2026: 7.1%).' },
  {
    id: 'a',
    title: 'Assessment and Plan',
    ai: 'Type 2 diabetes, improving. Continue metformin. Recheck A1c in 3 months. Foot exam today normal.',
  },
  { id: 'p', title: 'Patient Instructions', error: 'Patient Instructions is required before signing.' },
];

const meta = {
  title: 'Complex/Clinical/VisitNoteEditor',
  component: VisitNoteEditor,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'VisitNoteEditor is the section-by-section visit note with AI Scribe drafts and ICD-10 and CPT search, from Draft to Signed. AI text is never saved without Accept. Also exported as `VisitNote`.',
      },
    },
  },
  argTypes: {
    defaultSigned: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    title: { control: 'text' },
    meta: { control: 'text' },
  },
  args: {
    meta: '10/09/2026 10:30 AM . Main Street Clinic . Primary Care SOAP',
    sections,
    icdOptions: icd,
    cptOptions: cpt,
    defaultDiagnoses: [icd[0]!],
    defaultProcedures: [cpt[0]!],
    onSign: fn(),
    onAiDraft: fn(),
    onSaveDraft: fn(),
    onSectionChange: fn(),
  },
} satisfies Meta<typeof VisitNoteEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Signed: Story = {
  args: {
    defaultSigned: true,
    meta: 'Signed by James Bell MD 10/08/2026',
    defaultDiagnoses: [icd[1]!],
    defaultProcedures: [cpt[1]!],
    sections: [{ id: 's', title: 'Subjective', text: 'BP check.' }],
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    lockText: 'Front desk can view this note but not edit it. Ask a provider to make changes.',
    sections: sections.slice(0, 2),
  },
};
