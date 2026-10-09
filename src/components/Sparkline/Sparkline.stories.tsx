import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sparkline } from './Sparkline';

const meta = {
  title: 'Basic/Charts/Sparkline',
  component: Sparkline,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Sparkline is a tiny trend line for a vital sign or lab value, with the last point marked. `role="img"` named with every value; pass `color="var(--co-danger)"` for a flagged value.',
      },
    },
  },
  argTypes: { color: { control: 'select', options: ['var(--co-primary)', 'var(--co-danger)', 'var(--co-success)', 'var(--co-ai)'] } },
  args: { values: [7.9, 7.4, 7.1, 6.8] },
} satisfies Meta<typeof Sparkline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: () => (
    <div className="co-row">
      <Sparkline values={[7.9, 7.4, 7.1, 6.8]} label="A1c trend" />
      <Sparkline values={[128, 134, 151, 139, 146]} color="var(--co-danger)" width={120} height={30} label="Systolic BP trend" />
    </div>
  ),
};

export const Flagged: Story = { args: { values: [128, 134, 151, 139, 146], color: 'var(--co-danger)', width: 120, height: 30 } };
