import type { Meta, StoryObj } from '@storybook/react-vite';
import { RANGE_CONTEXTS } from '../../clinical';
import { PartogramChart } from './PartogramChart';

const meta = {
  title: 'Complex/ED & periop/PartogramChart',
  component: PartogramChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'PartogramChart plots cervical dilation and head descent against hours of active labor, with the WHO alert line (1 cm per hour) and action line 4 hours to its right, and an hourly row of fetal heart rate and contractions. The chart is a plain SVG whose accessible name lists every exam; crossing the action line raises an alert.',
      },
    },
  },
  argTypes: { rangeContext: { control: 'select', options: [undefined, ...RANGE_CONTEXTS] } },
  args: {
    subtitle: 'Keisha Moore . G2P1 . 39w 4d . active labor from 08:00',
    dilation: [[0, 4], [2, 5], [4, 7], [5, 8]],
    descent: [[0, 4], [2, 3], [4, 2], [5, 2]],
    fhr: [[0, 140], [1, 144], [2, 138], [3, 142], [4, 146], [5, 142]],
    contractions: [[0, 3], [1, 3], [2, 4], [3, 4], [4, 4], [5, 5]],
  },
} satisfies Meta<typeof PartogramChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: (args) => (
    <div className="pv-stack">
      <PartogramChart {...args} />
      <PartogramChart
        subtitle="Ana Souza . G1P0 . slow progress"
        dilation={[[0, 4], [3, 5], [6, 6], [8, 6]]}
        descent={[[0, 5], [4, 4], [8, 4]]}
        fhr={[[0, 150], [2, 158], [4, 166], [6, 172], [8, 184]]}
        contractions={[[0, 2], [2, 3], [4, 3], [6, 4], [8, 7]]}
      />
      <PartogramChart subtitle="Maria Lopez . not yet in active labor" dilation={[]} />
    </div>
  ),
};

export const ActionLineCrossed: Story = {
  args: {
    subtitle: 'Ana Souza . G1P0 . slow progress',
    dilation: [[0, 4], [3, 5], [6, 6], [8, 6]],
    descent: [[0, 5], [4, 4], [8, 4]],
    fhr: [[0, 150], [2, 158], [4, 166], [6, 172], [8, 184]],
    contractions: [[0, 2], [2, 3], [4, 3], [6, 4], [8, 7]],
  },
};

export const Empty: Story = {
  args: { subtitle: 'Maria Lopez . not yet in active labor', dilation: [], descent: [], fhr: [], contractions: [] },
};
