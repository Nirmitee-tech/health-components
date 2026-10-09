import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { DrugSearch, type DrugOption } from './DrugSearch';

const drugs: DrugOption[] = [
  { label: 'Oxycodone 5 mg tablet', form: 'Tablet', rxnorm: '1049621', coverage: 'Covered, prior auth', schedule: 'C-II' },
  { label: 'Ondansetron 4 mg ODT', form: 'ODT', rxnorm: '312086', coverage: 'Covered, tier 1' },
  { label: 'Omeprazole 20 mg capsule', form: 'Capsule', coverage: 'Covered, tier 1' },
  { label: 'Metformin 500 mg tablet', form: 'Tablet', rxnorm: '861007', coverage: 'Covered, tier 1' },
  { label: 'Lorazepam 0.5 mg tablet', form: 'Tablet', rxnorm: '197901', coverage: 'Covered, tier 2', schedule: 'C-IV' },
];

const meta = {
  title: 'Complex/Medications/DrugSearch',
  component: DrugSearch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "DrugSearch finds a medication with form, RxNorm, plan coverage and DEA schedule shown in each result. It is a Combobox: arrows move, Enter picks, Escape closes. The footer names the payer whose formulary is shown.",
      },
    },
  },
  argTypes: { payer: { control: 'text' }, label: { control: 'text' } },
  args: { options: drugs, payer: 'Aetna PPO', onSelect: fn() },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 280 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DrugSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Open: Story = { args: { defaultQuery: 'o', defaultOpen: true } };

export const NoMatches: Story = {
  args: { defaultQuery: 'zolpi', defaultOpen: true, emptyText: 'No drug matches. Check the spelling or search by RxNorm.' },
};

export const UnknownPlan: Story = { args: { payer: undefined } };
