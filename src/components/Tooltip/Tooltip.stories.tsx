import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { Tooltip } from './Tooltip';

const meta = {
  title: 'Basic/Overlays/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Tooltip shows a short label on hover and on focus, linked to its trigger with aria-describedby. Escape hides it. Use it to name icon-only buttons or explain a code (POS 11).',
      },
    },
  },
  argTypes: {
    placement: { control: 'inline-radio', options: ['top', 'bottom', 'right'] },
    open: { control: 'boolean' },
    children: { control: false },
  },
  args: {
    label: 'Print chart',
    open: true,
    children: <IconButton icon="file" label="Print chart" variant="secondary" />,
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '40px 24px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: () => (
    <div className="co-row" style={{ paddingTop: 34, gap: 48 }}>
      <Tooltip label="Print chart" open>
        <IconButton icon="file" label="Print chart" variant="secondary" />
      </Tooltip>
      <Tooltip label="Place of service: where care was given" placement="right" open>
        <Button size="sm">POS 11</Button>
      </Tooltip>
    </div>
  ),
};

export const Placements: Story = {
  render: () => (
    <div className="co-row" style={{ padding: '34px 0', gap: 120 }}>
      <Tooltip label="Above" open>
        <Button size="sm">Top</Button>
      </Tooltip>
      <Tooltip label="Below" placement="bottom" open>
        <Button size="sm">Bottom</Button>
      </Tooltip>
      <Tooltip label="Beside" placement="right" open>
        <Button size="sm">Right</Button>
      </Tooltip>
    </div>
  ),
};

export const OnHoverAndFocus: Story = {
  args: { open: false, label: 'Copy MRN-100231', children: <IconButton icon="file" label="Copy MRN" /> },
};
