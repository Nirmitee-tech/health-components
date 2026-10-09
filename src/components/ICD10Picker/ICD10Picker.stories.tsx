import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ICD10Picker, type ICD10Favorite, type ICD10Option } from './ICD10Picker';

const options: ICD10Option[] = [
  { code: 'F41.1', label: 'Generalized anxiety disorder' },
  { code: 'F41.9', label: 'Anxiety disorder, unspecified' },
  { code: 'F41.0', label: 'Panic disorder without agoraphobia' },
  { code: 'F32.1', label: 'Major depressive disorder, single episode, moderate' },
  { code: 'E11.9', label: 'Type 2 diabetes mellitus without complications' },
  { code: 'I10', label: 'Essential (primary) hypertension' },
];

const favorites: ICD10Favorite[] = [
  { code: 'F41.1', short: 'GAD' },
  { code: 'F32.1', short: 'MDD moderate' },
];

const meta = {
  title: 'Complex/Orders and notes/ICD10Picker',
  component: ICD10Picker,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "ICD10Picker searches ICD-10-CM by code or words, shows billable codes and the provider's favourites. Choosing a result or a favourite chip calls `onSelect` with the code.",
      },
    },
  },
  argTypes: {
    label: { control: 'text' },
    defaultQuery: { control: 'text' },
    error: { control: 'text' },
  },
  args: { options, onSelect: fn() },
} satisfies Meta<typeof ICD10Picker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { favorites } };

/** The design system demo: "anx" typed, results open, two favourites. */
export const Searching: Story = {
  args: { defaultQuery: 'anx', defaultOpen: true, favorites },
  render: (args) => (
    <div style={{ minHeight: 300 }}>
      <ICD10Picker {...args} />
    </div>
  ),
};

export const NoMatch: Story = {
  args: { defaultQuery: 'zzz', defaultOpen: true },
  render: (args) => (
    <div style={{ minHeight: 160 }}>
      <ICD10Picker {...args} />
    </div>
  ),
};

export const Selected: Story = { args: { favorites, defaultValue: 'F41.1', defaultQuery: 'F41.1 Generalized anxiety disorder' } };
