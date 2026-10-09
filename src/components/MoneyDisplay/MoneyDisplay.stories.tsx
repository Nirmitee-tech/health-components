import type { Meta, StoryObj } from '@storybook/react-vite';
import { MoneyDisplay } from './MoneyDisplay';

const meta = {
  title: 'Basic/Clinical values/MoneyDisplay',
  component: MoneyDisplay,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'MoneyDisplay shows US dollar amounts with two decimals, grouping and tabular figures, and negative adjustments in parentheses, spoken as "minus". Right-align money columns with `align="end"`.',
      },
    },
  },
  argTypes: { align: { control: 'inline-radio', options: ['start', 'end'] }, value: { control: 'number' } },
  args: { value: -45, label: 'contractual adjustment' },
} satisfies Meta<typeof MoneyDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const lines: Array<[string, number]> = [
  ['99214 Office visit, cardiology', 245],
  ['93000 ECG, 12 lead', 62.5],
  ['Contractual adjustment (CO-45)', -118.25],
  ['Aetna payment', -151.2],
  ['Patient copay (paid)', -30],
  ['Balance due', 8.05],
];

export const Statement: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      {lines.map(([l, v], i) => (
        <div key={l} className="co-row" style={{ justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--co-line-soft)' }}>
          <span>{l}</span>
          <MoneyDisplay value={v} align="end" emphasis={i === lines.length - 1} />
        </div>
      ))}
      <div className="co-row" style={{ justifyContent: 'space-between', padding: '6px 0' }}>
        <span>Estimate not available</span>
        <MoneyDisplay value={null} align="end" />
      </div>
    </div>
  ),
};

export const BalanceDue: Story = { args: { value: 1234.5, emphasis: true, label: 'balance due' } };
