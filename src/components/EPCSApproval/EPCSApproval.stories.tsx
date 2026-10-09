import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { EPCSApproval } from './EPCSApproval';

const meta = {
  title: 'Complex/Medications/EPCSApproval',
  component: EPCSApproval,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'EPCSApproval is the two-factor signing step for controlled-substance e-prescriptions (DEA 21 CFR 1311): summary, PDMP check, signing PIN and token code. Sign and Send enables once both factors are complete. States: `pin`, `done`, `locked`.',
      },
    },
  },
  argTypes: { state: { control: 'inline-radio', options: ['pin', 'done', 'locked'] }, error: { control: 'text' } },
  args: {
    drug: 'Oxycodone 5 mg tablet',
    schedule: 'C-II',
    sig: '1 tablet every 6 hours as needed, 5 days',
    qty: 20,
    prescriber: 'Ana Ortiz MD',
    dea: 'BO1234563',
    onSign: fn(),
  },
} satisfies Meta<typeof EPCSApproval>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const PinAndDone: Story = {
  render: () => (
    <div className="co-dt">
      <EPCSApproval
        drug="Oxycodone 5 mg tablet"
        schedule="C-II"
        sig="1 tablet every 6 hours as needed, 5 days"
        qty={20}
        prescriber="Ana Ortiz MD"
        dea="BO1234563"
        pin="123"
      />
      <EPCSApproval
        state="done"
        drug="Lorazepam 0.5 mg"
        schedule="C-IV"
        sig="1 at bedtime as needed"
        qty={15}
        prescriber="Priya Shah MD"
        dea="BS7654321"
        pharmacy="CVS #4412"
        audit="004518"
      />
    </div>
  ),
};

export const WrongPin: Story = { args: { error: 'Wrong PIN. 2 tries left.' } };

export const Locked: Story = { args: { state: 'locked' } };

export const Done: Story = { args: { state: 'done', pharmacy: 'Walgreens #10233', audit: '004519' } };
