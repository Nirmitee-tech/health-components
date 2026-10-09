import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ProblemListEditor, type ProblemListEditorItem } from './ProblemListEditor';

const items: ProblemListEditorItem[] = [
  { snomed: '44054006', label: 'Type 2 diabetes mellitus', icd: [{ code: 'E11.9', label: 'Type 2 diabetes without complications' }], onset: '2019', hcc: '38', principal: true },
  {
    snomed: '49436004',
    label: 'Atrial fibrillation',
    icd: [
      { code: 'I48.91', label: 'Unspecified atrial fibrillation' },
      { code: 'I48.0', label: 'Paroxysmal atrial fibrillation', rule: 'IF episodes end within 7 days' },
      { code: 'I48.11', label: 'Longstanding persistent atrial fibrillation', rule: 'IF lasting over 12 months' },
    ],
    onset: '2025',
  },
  {
    snomed: '35489007',
    label: 'Depressive disorder',
    icd: [
      { code: 'F32.A', label: 'Depression, unspecified' },
      { code: 'F32.1', label: 'Major depressive disorder, single episode, moderate' },
    ],
    picked: 'F32.1',
    onset: '2024',
  },
  { snomed: '239873007', label: 'Osteoarthritis of knee', icd: [], onset: '2018', status: 'Active' },
];

const meta = {
  title: 'Complex/Chart panels/ProblemListEditor',
  component: ProblemListEditor,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'ProblemListEditor records problems as SNOMED CT concepts and shows the ICD-10-CM codes the map table offers, so a person picks the billable code the note supports. A single-target map is shown as matched, never as approved. Done keeps the edits; Cancel puts the problem back as it was.',
      },
    },
  },
  args: { items, defaultEditing: 1, onAdd: fn(), onItemsChange: fn(), onEditingChange: fn() },
} satisfies Meta<typeof ProblemListEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: (args) => (
    <div className="pv-grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(420px,1fr))' }}>
      <ProblemListEditor {...args} />
      <div className="co-dt">
        <ProblemListEditor items={items.slice(0, 2)} readOnly />
        <ProblemListEditor items={[]} />
      </div>
    </div>
  ),
};

export const NoMap: Story = { args: { defaultEditing: 3 } };

export const ReadOnly: Story = { args: { items: items.slice(0, 2), readOnly: true, defaultEditing: undefined } };

export const Empty: Story = { args: { items: [], defaultEditing: undefined } };
