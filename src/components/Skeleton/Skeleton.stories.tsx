import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './Skeleton';

const meta = {
  title: 'Basic/Data display/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Skeleton shows grey placeholder shapes while content loads. It is aria-busy with a label; the pulse stops under prefers-reduced-motion.',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['text', 'row', 'card', 'avatar'] },
    width: { control: 'text' },
    label: { control: 'text' },
  },
  args: { lines: 3 },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: () => (
    <div className="pv-grid">
      <div className="co-card">
        <Skeleton lines={3} label="Loading visit note" />
      </div>
      <div className="co-card">
        <Skeleton variant="row" rows={3} label="Loading patients" />
      </div>
      <Skeleton variant="card" label="Loading coverage" />
    </div>
  ),
};

export const Rows: Story = { args: { variant: 'row', rows: 5 } };

export const CardPlaceholder: Story = { args: { variant: 'card' } };

export const Avatar: Story = { args: { variant: 'avatar' } };
