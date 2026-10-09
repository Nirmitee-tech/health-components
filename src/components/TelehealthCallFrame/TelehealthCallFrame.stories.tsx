import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { TelehealthCallFrame } from './TelehealthCallFrame';

const meta = {
  title: 'Complex/Scheduling/TelehealthCallFrame',
  component: TelehealthCallFrame,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'TelehealthCallFrame is the video visit frame: waiting room, live call, weak connection, controls and the consent and billing note. Mute and camera are toggle buttons (aria-pressed).',
      },
    },
  },
  argTypes: {
    state: { control: 'inline-radio', options: ['waiting', 'live', 'poor'] },
  },
  args: {
    remote: 'Nora Scott',
    onMutedChange: fn(),
    onCameraOffChange: fn(),
    onChat: fn(),
    onAdmit: fn(),
    onEnd: fn(),
  },
} satisfies Meta<typeof TelehealthCallFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { state: 'live', elapsed: '12:41', consent: true, location: 'Home, Chicago IL' } };

export const LiveAndWaiting: Story = {
  render: () => (
    <div className="co-dt">
      <TelehealthCallFrame remote="Nora Scott" state="live" elapsed="12:41" consent location="Home, Chicago IL" />
      <TelehealthCallFrame remote="Jacob Jones (with mother)" state="waiting" />
    </div>
  ),
};

export const Waiting: Story = { args: { remote: 'Jacob Jones (with mother)', state: 'waiting' } };

export const WeakConnection: Story = { args: { state: 'poor', elapsed: '04:07', defaultMuted: true } };
