import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { FilterChip } from './FilterChip';

const meta = {
  title: 'Basic/Selection/FilterChip',
  component: FilterChip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'FilterChip toggles a quick filter above a list, such as Rejected or Needs Review, and can show a count. aria-pressed shows the state; the check icon adds a non-colour cue.',
      },
    },
  },
  argTypes: {
    children: { control: 'text' },
    count: { control: 'number' },
  },
  args: { children: 'Rejected', onChange: fn() },
} satisfies Meta<typeof FilterChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { defaultSelected: true, count: 12 } };

export const Showcase: Story = {
  render: () => (
    <div className="co-row">
      <FilterChip defaultSelected count={12}>
        Rejected
      </FilterChip>
      <FilterChip count={4}>Needs Review</FilterChip>
      <FilterChip>Aetna</FilterChip>
      <FilterChip onRemove={() => {}}>Payer: BCBS IL</FilterChip>
      <FilterChip disabled>Archived</FilterChip>
    </div>
  ),
};

export const Removable: Story = { args: { children: 'Payer: BCBS IL', onRemove: fn() } };

export const WithoutCheck: Story = { args: { children: 'Self-Pay', defaultSelected: true, check: false } };

export const Disabled: Story = { args: { children: 'Archived', disabled: true } };
