import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from './ProgressBar';

const meta = {
  title: 'Basic/Data display/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'ProgressBar shows progress of a task or how much of an allowance is used, such as PA units used 12 of 20. The number is always shown as text too.',
      },
    },
  },
  argTypes: {
    tone: { control: 'select', options: [undefined, 'primary', 'success', 'warning', 'danger', 'ai'] },
    size: { control: 'inline-radio', options: ['md', 'lg'] },
    value: { control: { type: 'range', min: 0, max: 20 } },
  },
  args: { label: 'PA units used', value: 12, max: 20, unit: 'visits', meter: true, thresholds: [75, 90] },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { helper: 'PA-2026-11873 . Expires 12/31/2026' } };

export const Showcase: Story = {
  render: () => (
    <div className="pv-grid">
      <ProgressBar
        label="PA units used"
        value={12}
        max={20}
        unit="visits"
        meter
        thresholds={[75, 90]}
        helper="PA-2026-11873 . Expires 12/31/2026"
      />
      <ProgressBar label="PA units used" value={17} max={20} unit="visits" meter thresholds={[75, 90]} />
      <ProgressBar
        label="PA units used"
        value={19}
        max={20}
        unit="visits"
        meter
        thresholds={[75, 90]}
        helper="1 visit left. Request an extension now."
      />
      <ProgressBar label="Chart import" value={64} size="lg" />
      <ProgressBar label="Intake forms complete" value={3} max={4} tone="success" valueText="3 of 4 forms" />
    </div>
  ),
};

export const Thresholds: Story = {
  render: () => (
    <div className="pv-stack">
      <ProgressBar label="Visits used, PA-2026-11873" value={12} max={20} unit="visits" meter thresholds={[75, 90]} />
      <ProgressBar label="Visits used, PA-2026-11902" value={16} max={20} unit="visits" meter thresholds={[75, 90]} />
      <ProgressBar label="Visits used, PA-2026-11954" value={19} max={20} unit="visits" meter thresholds={[75, 90]} />
    </div>
  ),
};

export const Compact: Story = { args: { compact: true, label: 'PA units used' } };

export const Large: Story = { args: { label: 'Chart import', value: 64, max: 100, unit: undefined, meter: false, size: 'lg' } };
