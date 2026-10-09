import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AllergyAlert, DrugInteractionAlert } from './DrugInteractionAlert';

const meta = {
  title: 'Complex/Medications/DrugInteractionAlert',
  component: DrugInteractionAlert,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'DrugInteractionAlert (and AllergyAlert) stops an order for an interaction, duplicate or allergy and asks for an override reason or a change. Contraindicated and severe alerts are red; moderate ones amber. Override and Continue stays disabled until a reason is chosen; `overridable={false}` removes the override.',
      },
    },
  },
  argTypes: {
    kind: { control: 'inline-radio', options: ['interaction', 'duplicate', 'allergy'] },
    severity: { control: 'inline-radio', options: ['contraindicated', 'severe', 'moderate'] },
  },
  args: {
    title: 'Sertraline + Tramadol',
    body: 'Both raise serotonin. Risk of serotonin syndrome.',
    severity: 'severe',
    source: 'First Databank, sample',
    onOverride: fn(),
    onChangeOrder: fn(),
    onReasonChange: fn(),
  },
} satisfies Meta<typeof DrugInteractionAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const InteractionAndAllergy: Story = {
  render: () => (
    <div className="co-dt">
      <DrugInteractionAlert
        title="Sertraline + Tramadol"
        body="Both raise serotonin. Risk of serotonin syndrome."
        severity="severe"
        source="First Databank, sample"
      />
      <AllergyAlert
        title="Amoxicillin"
        body="Henna West is allergic to penicillin (anaphylaxis). Cross-reactivity is likely."
        severity="contraindicated"
        overridable={false}
      />
    </div>
  ),
};

export const Duplicate: Story = {
  args: {
    kind: 'duplicate',
    title: 'Ibuprofen + Naproxen',
    body: 'Two NSAIDs on the active list. Higher risk of GI bleeding and kidney injury.',
    severity: 'moderate',
    source: 'First Databank, sample',
  },
};

export const ReasonChosen: Story = { args: { defaultReason: 'Will monitor levels' } };

export const NotOverridable: Story = {
  args: {
    kind: 'allergy',
    title: 'Amoxicillin',
    body: 'Henna West is allergic to penicillin (anaphylaxis). Cross-reactivity is likely.',
    severity: 'contraindicated',
    source: undefined,
    overridable: false,
  },
};
