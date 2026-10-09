import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { CareGapRow } from './CareGapRow';

const meta = {
  title: 'Complex/Quality and care programs/CareGapRow',
  component: CareGapRow,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'CareGapRow is one open, closed or excluded care gap with the action that closes it. Open gaps carry a SplitButton: the main action plus Record Outside Result and Mark Excluded.',
      },
    },
  },
  argTypes: {
    gap: { control: 'object' },
  },
  args: {
    gap: {
      measure: 'Colorectal cancer screening (CMS130)',
      patient: 'Ralph Edwards',
      detail: 'Last FIT 08/2023',
      due: 'Now',
      status: 'open',
      action: 'Order FIT',
    },
    onAction: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 160 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CareGapRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Statuses: Story = {
  render: (args) => (
    <div className="co-dt">
      <CareGapRow gap={args.gap} onAction={args.onAction} />
      <CareGapRow gap={{ measure: 'Diabetes: A1c poor control (CMS122)', detail: 'A1c 6.8% on 10/09', status: 'closed' }} />
      <CareGapRow gap={{ measure: 'Breast cancer screening (CMS125)', detail: 'Bilateral mastectomy', status: 'excluded' }} />
    </div>
  ),
};
