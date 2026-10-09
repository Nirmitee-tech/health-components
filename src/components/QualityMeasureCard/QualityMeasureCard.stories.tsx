import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { QualityMeasureCard } from './QualityMeasureCard';

const meta = {
  title: 'Complex/Quality and care programs/QualityMeasureCard',
  component: QualityMeasureCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'QualityMeasureCard shows one quality measure: rate, target (including inverse measures), numerator and denominator, and the gap list link. Inverse measures (lower is better, such as CMS122) meet the target at or below it.',
      },
    },
  },
  argTypes: {
    measure: { control: 'object' },
  },
  args: {
    measure: {
      name: 'Controlling High Blood Pressure',
      id: 'CMS165v12',
      period: 'Jan to Sep 2026',
      numerator: 412,
      denominator: 560,
      exclusions: 18,
      target: 70,
    },
    onViewGaps: fn(),
  },
} satisfies Meta<typeof QualityMeasureCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Dashboard: Story = {
  render: (args) => (
    <div className="pv-grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))' }}>
      <QualityMeasureCard measure={args.measure} onViewGaps={args.onViewGaps} />
      <QualityMeasureCard
        measure={{
          name: 'Diabetes: A1c Poor Control (>9%)',
          id: 'CMS122v12',
          period: 'Jan to Sep 2026',
          numerator: 31,
          denominator: 240,
          target: 15,
          inverse: true,
        }}
        onViewGaps={args.onViewGaps}
      />
    </div>
  ),
};

export const BelowTarget: Story = {
  args: {
    measure: {
      name: 'Colorectal Cancer Screening',
      id: 'CMS130v12',
      period: 'Jan to Sep 2026',
      numerator: 298,
      denominator: 512,
      exclusions: 9,
      target: 72,
      source: 'Payer gap file, Blue Cross IL, 09/30',
    },
  },
};
