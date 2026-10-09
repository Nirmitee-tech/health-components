import type { Meta, StoryObj } from '@storybook/react-vite';
import { ClaimStatusTag } from './ClaimStatusTag';

const meta = {
  title: 'Complex/Revenue/ClaimStatusTag',
  component: ClaimStatusTag,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'ClaimStatusTag names where a claim is in the X12 cycle: 837 sent, 999 accepted or rejected, 277CA, 277 pending and 835 paid, partial or denied. Every status has an icon and words, and the title explains the step.',
      },
    },
  },
  argTypes: {
    status: { control: 'select', options: ClaimStatusTag.statuses },
  },
  args: { status: 'Rejected (277CA)' },
} satisfies Meta<typeof ClaimStatusTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllStatuses: Story = {
  render: () => (
    <div className="co-row co-gap-6">
      {ClaimStatusTag.statuses.map((s) => (
        <ClaimStatusTag key={s} status={s} />
      ))}
    </div>
  ),
};

export const Paid: Story = { args: { status: 'Paid (835)' } };
export const Denied: Story = { args: { status: 'Denied (835)' } };
export const Appealed: Story = { args: { status: 'Appealed' } };
