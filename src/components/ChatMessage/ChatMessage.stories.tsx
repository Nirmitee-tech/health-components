import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChatMessage } from './ChatMessage';

const meta = {
  title: 'Basic/Mobile/ChatMessage',
  component: ChatMessage,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'ChatMessage is one bubble in a secure message thread: incoming, outgoing, AI or system. Incoming messages show the author with an avatar; outgoing messages show a delivery status after the time.',
      },
    },
  },
  argTypes: {
    direction: { control: 'inline-radio', options: ['in', 'out'] },
    children: { control: 'text' },
  },
  args: { author: 'Henna West', time: '9:02 AM', children: 'Can I get my metformin refilled before Friday?' },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 430 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChatMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Thread: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <ChatMessage system time="Today 9:02 AM">
        Henna West started a conversation
      </ChatMessage>
      <ChatMessage author="Henna West" time="9:02 AM">
        Can I get my metformin refilled before Friday?
      </ChatMessage>
      <ChatMessage author="AI Receptionist" ai time="9:02 AM">
        I sent your refill request to Dr. Bell. You will get a message when it is approved.
      </ChatMessage>
      <ChatMessage direction="out" time="9:40 AM" status="Read">
        Approved and sent to Walgreens on Clark St. Ready after 2 PM.
      </ChatMessage>
    </div>
  ),
};

export const Outgoing: Story = {
  args: { direction: 'out', author: undefined, status: 'Sent', time: '9:40 AM', children: 'Approved and sent to Walgreens on Clark St.' },
};

export const AI: Story = {
  args: { author: 'AI Receptionist', ai: true, children: 'I sent your refill request to Dr. Bell.' },
};

export const System: Story = { args: { author: undefined, system: true, time: 'Today 9:02 AM', children: 'Henna West started a conversation' } };
