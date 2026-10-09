import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { ButtonGroup } from './ButtonGroup';

const meta = {
  title: 'Basic/Actions/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'ButtonGroup lays out related buttons with the 8px gap the screens use, or joins them into one attached control. It has role group; give it a label when the buttons only make sense together.',
      },
    },
  },
  argTypes: {
    align: { control: 'inline-radio', options: ['start', 'end'] },
    attached: { control: 'boolean' },
  },
  args: {
    label: 'Chart actions',
    children: (
      <>
        <Button>Care gaps (3 open)</Button>
        <Button>Outside records (HIE)</Button>
        <Button iconLeft="code">For developers</Button>
      </>
    ),
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: () => (
    <div className="pv-grid">
      <div>
        <div className="pv-label">Page header</div>
        <div style={{ marginTop: 12 }}>
          <ButtonGroup label="Chart actions">
            <Button>Care gaps (3 open)</Button>
            <Button>Outside records (HIE)</Button>
            <Button iconLeft="code">For developers</Button>
          </ButtonGroup>
        </div>
      </div>
      <div>
        <div className="pv-label">Attached</div>
        <div style={{ marginTop: 12 }}>
          <ButtonGroup attached label="Calendar view">
            <Button pressed>Day</Button>
            <Button pressed={false}>Week</Button>
            <Button pressed={false}>Month</Button>
          </ButtonGroup>
        </div>
      </div>
      <div>
        <div className="pv-label">Footer</div>
        <div style={{ marginTop: 12 }}>
          <ButtonGroup align="end">
            <Button>Cancel</Button>
            <Button variant="primary">Save Changes</Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  ),
};

export const Attached: Story = {
  args: {
    attached: true,
    label: 'Calendar view',
    children: (
      <>
        <Button pressed>Day</Button>
        <Button pressed={false}>Week</Button>
        <Button pressed={false}>Month</Button>
      </>
    ),
  },
};

export const FooterEnd: Story = {
  args: {
    align: 'end',
    label: undefined,
    children: (
      <>
        <Button>Cancel</Button>
        <Button variant="primary">Save Changes</Button>
      </>
    ),
  },
  parameters: { layout: 'padded' },
};
