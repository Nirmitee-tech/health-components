import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ClaimForm, type ClaimLine } from './ClaimForm';

const lines: ClaimLine[] = [
  { dos: '10/06/2026', cpt: '99214', mods: '25', dx: 'A,B', units: 1, charge: 182 },
  { dos: '10/06/2026', cpt: '83036', dx: 'A', units: 1, charge: 38 },
  {
    dos: '10/06/2026',
    cpt: '9921',
    dx: 'Q',
    units: 1,
    charge: 0,
    errors: { cpt: 'Enter a 5 character CPT code.', dx: 'Pointer Q is not on this claim.' },
  },
];

const meta = {
  title: 'Complex/Revenue/ClaimForm',
  component: ClaimForm,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'ClaimForm is the claim line-item editor: DOS, CPT, modifiers, diagnosis pointers, units and charge per line, with totals, claim check and submit. Every cell input is named "<field> line N". Also exported as `ClaimLineEditor`.',
      },
    },
  },
  argTypes: {
    payerOrder: { control: 'inline-radio', options: ['Primary', 'Secondary', 'Tertiary'] },
    frequency: { control: 'text' },
    errorsCount: { control: { type: 'number', min: 0 } },
    readOnly: { control: 'boolean' },
  },
  args: { defaultLines: lines, onChange: fn(), onSaveDraft: fn(), onSubmit: fn() },
} satisfies Meta<typeof ClaimForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { errorsCount: 1 } };

export const Showcase: Story = {
  render: (args) => (
    <div className="pv-stack">
      <ClaimForm {...args} errorsCount={1} />
      <div className="pv-label">Read-only</div>
      <ClaimForm
        readOnly
        frequency="7 Corrected"
        defaultLines={[{ dos: '09/29/2026', cpt: '97110', mods: 'GP', dx: 'A', units: 3, charge: 55 }]}
      />
    </div>
  ),
};

export const CheckPassed: Story = { args: { defaultLines: lines.slice(0, 2), payerOrder: 'Secondary' } };

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    frequency: '7 Corrected',
    defaultLines: [{ dos: '09/29/2026', cpt: '97110', mods: 'GP', dx: 'A', units: 3, charge: 55 }],
  },
};
