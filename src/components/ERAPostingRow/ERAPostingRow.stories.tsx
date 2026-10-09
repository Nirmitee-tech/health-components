import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ERAPostingRow, type EraRow } from './ERAPostingRow';

const balanced: EraRow = {
  patient: 'Henna West',
  cpt: '99214',
  dos: '10/06/2026',
  claim: 'CLM-20871',
  billed: 182,
  allowed: 118.4,
  paid: 93.4,
  patientResp: 25,
  adjustments: [
    { group: 'CO', code: '45', amount: 63.6, text: 'Charge exceeds fee schedule' },
    { group: 'PR', code: '3', amount: 25, text: 'Copay' },
  ],
};

const outOfBalance: EraRow = {
  patient: 'Ralph Edwards',
  cpt: '97110',
  dos: '09/29/2026',
  claim: 'CLM-20841',
  billed: 165,
  allowed: 96,
  paid: 0,
  patientResp: 0,
  adjustments: [{ group: 'CO', code: '197', amount: 96, text: 'Precertification absent' }],
  remarks: [{ code: 'N54', text: 'Claim info inconsistent with precertification' }],
};

const meta = {
  title: 'Complex/Revenue/ERAPostingRow',
  component: ERAPostingRow,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'ERAPostingRow is one ERA (835) service line to post: billed, allowed, paid, contractual and patient amounts, CARC and RARC codes, balance check and Post. Post is enabled only when allowed = paid + patient responsibility.',
      },
    },
  },
  args: { row: balanced, onPost: fn() },
} satisfies Meta<typeof ERAPostingRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const PostingQueue: Story = {
  render: () => (
    <div className="co-dt">
      <ERAPostingRow row={balanced} />
      <ERAPostingRow row={outOfBalance} />
    </div>
  ),
};

export const OutOfBalance: Story = { args: { row: outOfBalance } };
