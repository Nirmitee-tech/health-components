import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from './Spinner';

const meta = {
  title: 'Basic/Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Short loading indicator with role status. Use it for waits under a few seconds (an eligibility check); use Skeleton while a page or card loads.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'lg'] },
    tone: { control: 'inline-radio', options: ['primary', 'ai'] },
  },
  args: { label: 'Loading' },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { size: 'lg' } };

export const Overview: Story = {
  render: () => (
    <div className="co-row">
      <Spinner />
      <span className="co-muted">Checking coverage with Aetna</span>
      <Spinner size="lg" />
      <Spinner size="lg" tone="ai" label="AI Scribe is drafting" />
      <span className="co-muted">AI Scribe is drafting the note</span>
    </div>
  ),
};
