import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Switch } from './Switch';

const meta = {
  title: 'Basic/Selection/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Switch turns a setting on or off immediately, such as "Sidebar starts collapsed" or "Allow online booking". The on state is green and the knob moves right, so colour is not the only cue.',
      },
    },
  },
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
  },
  args: { label: 'Sidebar starts collapsed', description: 'Clinical Sidebar only.', onChange: fn() },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { defaultChecked: true } };

export const Showcase: Story = {
  render: () => (
    <div className="pv-grid">
      <div>
        <Switch label="Sidebar starts collapsed" description="Clinical Sidebar only." defaultChecked />
        <div style={{ height: 12 }} />
        <Switch label="Allow online booking" />
        <div style={{ height: 12 }} />
        <Switch label="Use practice brand colour" disabled />
      </div>
      <div>
        <Switch row label="Appointment reminders" description="Text me 24 hours before." defaultChecked />
        <Switch row label="Lab results ready" />
      </div>
    </div>
  ),
};

export const SettingsRow: Story = { args: { row: true, label: 'Appointment reminders', description: 'Text me 24 hours before.' } };

export const Disabled: Story = { args: { label: 'Use practice brand colour', description: undefined, disabled: true } };
