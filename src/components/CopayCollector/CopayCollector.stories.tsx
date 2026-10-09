import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { CopayCollector } from './CopayCollector';

const meta = {
  title: 'Complex/Revenue/CopayCollector',
  component: CopayCollector,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "CopayCollector (PatientBalance) shows today's copay, prior balance and total, and collects by card, tap, cash or text link. The Collect button always shows the amount.",
      },
    },
  },
  argTypes: {
    method: { control: 'inline-radio', options: [undefined, 'card', 'tap', 'cash', 'text'] },
    defaultMethod: { control: 'inline-radio', options: ['card', 'tap', 'cash', 'text'] },
  },
  args: {
    patient: 'Henna West . Aetna PPO',
    copay: 25,
    onCollect: fn(),
    onSkip: fn(),
    onMethodChange: fn(),
    onAmountChange: fn(),
  },
} satisfies Meta<typeof CopayCollector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    prior: 40,
    priorNote: '09/12 visit, after insurance',
    cardLast4: 'Visa 4242',
    plan: 'None. Eligible for a 3-month plan over $200.',
  },
};

export const CopayOnly: Story = { args: { patient: 'Ralph Edwards . Medicare', copay: 0, due: 0, defaultMethod: 'cash' } };

export const TextToPay: Story = {
  args: { patient: 'Jacob Jones . BCBS IL', copay: 30, prior: 185.5, priorNote: '08/20 urgent care visit', due: 215.5, defaultMethod: 'text' },
};
