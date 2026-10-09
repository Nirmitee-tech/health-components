import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AllergyList, type AllergyItem } from './AllergyList';

const allergies: AllergyItem[] = [
  { substance: 'Penicillin', type: 'Drug', reaction: 'Anaphylaxis', severity: 'severe', onset: '2004' },
  { substance: 'Sulfamethoxazole', type: 'Drug', reaction: 'Rash', severity: 'moderate' },
  { substance: 'Latex', type: 'Environmental', reaction: 'Itching', severity: 'mild' },
  { substance: 'Codeine', type: 'Drug', reaction: 'Nausea (intolerance)', severity: 'mild', status: 'inactive' },
];

const meta = {
  title: 'Complex/Clinical/AllergyList',
  component: AllergyList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'AllergyList is the Allergies card: each allergy with type, reaction, severity and status, plus the No Known Allergies (`items=[]`) and not-reviewed (`items` undefined) states.',
      },
    },
  },
  argTypes: { reviewed: { control: 'text' } },
  args: {
    items: allergies,
    reviewed: '10/09/2026 by Lisa Chen RN',
    onMarkReviewed: fn(),
    onAdd: fn(),
    onItemAction: fn(),
  },
} satisfies Meta<typeof AllergyList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div className="pv-grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(380px,1fr))' }}>
      <AllergyList reviewed="10/09/2026 by Lisa Chen RN" items={allergies} />
      <div className="co-dt">
        <AllergyList items={[]} />
        <AllergyList />
      </div>
    </div>
  ),
};

export const NoKnownAllergies: Story = { args: { items: [], reviewed: '10/09/2026 by Lisa Chen RN' } };

export const NotReviewed: Story = { args: { items: undefined, reviewed: undefined } };

export const ReadOnly: Story = { args: { readOnly: true } };
