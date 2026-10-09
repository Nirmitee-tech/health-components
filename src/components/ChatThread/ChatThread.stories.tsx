import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { ChatThread, type ChatThreadMessage } from './ChatThread';

const thread: ChatThreadMessage[] = [
  { id: 1, author: 'Henna West', time: '9:02 AM', text: 'Can I get my metformin refilled before Friday?' },
  { id: 2, direction: 'out', time: '9:40 AM', status: 'Read', text: 'Approved and sent to Walgreens on Clark St. Ready after 2 PM.' },
];

const meta = {
  title: 'Complex/Messaging/ChatThread',
  component: ChatThread,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'ChatThread is a full secure-message conversation: header, message log and composer with optional AI reply suggestion. `readOnly` replaces the composer with a lock banner. Also exported as `SecureChatThread`.',
      },
    },
  },
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    placeholder: { control: 'text' },
    lockText: { control: 'text' },
  },
  args: { defaultMessages: thread, onSend: fn(), onSuggest: fn(), onMessagesChange: fn() },
} satisfies Meta<typeof ChatThread>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { title: 'Henna West', subtitle: 'MRN-100231 . replies within 1 business day', ai: true },
};

export const Showcase: Story = {
  render: () => (
    <div className="co-row" style={{ alignItems: 'flex-start' }}>
      <div style={{ flex: '1 1 360px' }}>
        <ChatThread title="Henna West" subtitle="MRN-100231 . replies within 1 business day" ai defaultMessages={thread} />
      </div>
      <div style={{ flex: '1 1 300px' }}>
        <ChatThread
          readOnly
          lockText="Your role (Front Desk) sees a read-only preview. Sending is blocked for staff."
          defaultMessages={[{ id: 1, author: 'Dr. Priya Shah', time: 'Mon', text: 'Your results are normal.' }]}
        />
      </div>
    </div>
  ),
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    lockText: 'Your role (Front Desk) sees a read-only preview. Sending is blocked for staff.',
    defaultMessages: [{ id: 1, author: 'Dr. Priya Shah', time: 'Mon', text: 'Your results are normal.' }],
  },
};

export const WithSystemAndAI: Story = {
  args: {
    title: 'Nora Scott',
    subtitle: 'MRN-100412',
    defaultMessages: [
      { id: 1, system: true, time: '8:55 AM', text: 'Nora Scott started a conversation' },
      { id: 2, author: 'Nora Scott', time: '8:56 AM', text: 'Is my knee X-ray back yet?' },
      { id: 3, author: 'CareOS Assistant', ai: true, time: '8:56 AM', text: 'Your X-ray was received this morning. Your care team will review it and reply.' },
    ],
  },
};

function ControlledDemo() {
  const [messages, setMessages] = useState<ChatThreadMessage[]>(thread);
  return <ChatThread title="Henna West" subtitle="MRN-100231" messages={messages} onMessagesChange={setMessages} />;
}

/** Controlled: the parent owns the message list. */
export const Controlled: Story = { render: () => <ControlledDemo /> };
