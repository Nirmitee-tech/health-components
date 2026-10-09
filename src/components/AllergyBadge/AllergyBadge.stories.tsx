import type { Meta, StoryObj } from '@storybook/react-vite';
import { AllergyBadge } from './AllergyBadge';

const meta = {
  title: 'Complex/Clinical/AllergyBadge',
  component: AllergyBadge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'AllergyBadge is the red allergy tag used in banners and lists, with severity in its title and optional label. Mild allergies are amber; moderate and severe are red.',
      },
    },
  },
  argTypes: {
    severity: { control: 'inline-radio', options: ['severe', 'moderate', 'mild'] },
    substance: { control: 'text' },
    reaction: { control: 'text' },
  },
  args: { substance: 'Penicillin', severity: 'severe', reaction: 'Anaphylaxis', showSeverity: true },
} satisfies Meta<typeof AllergyBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Severities: Story = {
  render: () => (
    <div className="co-row co-gap-6">
      <AllergyBadge substance="Penicillin" severity="severe" reaction="Anaphylaxis" showSeverity />
      <AllergyBadge substance="Sulfa drugs" severity="moderate" showSeverity />
      <AllergyBadge substance="Latex" severity="mild" showSeverity />
      <AllergyBadge substance="Shellfish" />
    </div>
  ),
};

export const Compact: Story = {
  args: { substance: 'Peanuts', severity: 'severe', reaction: 'Hives, throat swelling', showSeverity: false },
};
