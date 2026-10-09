import type { Meta, StoryObj } from '@storybook/react-vite';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import { Switch } from '../Switch/Switch';
import { TextField } from '../TextField/TextField';
import { SettingRow } from './SettingRow';

const meta = {
  title: 'Basic/Layout/SettingRow',
  component: SettingRow,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'SettingRow is the two-column settings row: label and help on the left, control on the right. Stacks to one column under 640px. The control keeps its own accessible label.',
      },
    },
  },
  argTypes: { children: { control: false } },
  args: {
    label: 'Sidebar starts collapsed',
    help: 'Clinical Sidebar only.',
    children: <Switch label="Start collapsed" />,
  },
} satisfies Meta<typeof SettingRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: () => (
    <div>
      <SettingRow label="Density" help="Compact fits more rows on screen by tightening buttons, cards and table rows.">
        <SegmentedControl label="Density" options={['Comfortable', 'Compact']} />
      </SettingRow>
      <SettingRow label="Sidebar starts collapsed" help="Clinical Sidebar only.">
        <Switch label="Start collapsed" />
      </SettingRow>
      <SettingRow label="Practice brand colour" help="Replaces the main colour. Status colours never change.">
        <TextField label="Hex colour" defaultValue="#0F766E" />
      </SettingRow>
    </div>
  ),
};

export const WithoutHelp: Story = {
  args: { label: 'Density', help: undefined, children: <SegmentedControl label="Density" options={['Comfortable', 'Compact']} /> },
};
