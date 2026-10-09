import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ChatThread, SecureChatThread } from './index';

const msgs = [{ id: 1, author: 'Henna West', time: '9:02 AM', text: 'Can I get my metformin refilled?' }];

describe('ChatThread', () => {
  it('renders the header and a message log', () => {
    render(<ChatThread title="Henna West" subtitle="MRN-100231" defaultMessages={msgs} />);
    expect(screen.getByRole('log', { name: 'Messages with Henna West' })).toHaveTextContent('Can I get my metformin refilled?');
    expect(screen.getByText('MRN-100231')).toBeInTheDocument();
  });

  it('appends a sent message and calls onSend with trimmed text', async () => {
    const onSend = vi.fn();
    render(<ChatThread defaultMessages={msgs} onSend={onSend} />);
    const input = screen.getByRole('textbox', { name: 'Message' });
    await userEvent.type(input, '  Ready after 2 PM  {Enter}');
    expect(onSend).toHaveBeenCalledWith('Ready after 2 PM');
    expect(screen.getByRole('log')).toHaveTextContent('Ready after 2 PM');
    expect(input).toHaveValue('');
  });

  it('does not send empty text', async () => {
    const onSend = vi.fn();
    render(<ChatThread onSend={onSend} />);
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(onSend).not.toHaveBeenCalled();
  });

  it('is controllable', async () => {
    const onMessagesChange = vi.fn();
    render(<ChatThread messages={msgs} onMessagesChange={onMessagesChange} />);
    await userEvent.type(screen.getByRole('textbox'), 'Hi{Enter}');
    expect(onMessagesChange).toHaveBeenCalledWith([...msgs, { direction: 'out', text: 'Hi', time: 'Now', status: 'Sent' }]);
    expect(screen.getByRole('log')).not.toHaveTextContent('Hi');
  });

  it('shows the AI button only with ai and calls onSuggest', async () => {
    const onSuggest = vi.fn();
    const { rerender } = render(<ChatThread />);
    expect(screen.queryByRole('button', { name: 'Suggest a reply with AI' })).not.toBeInTheDocument();
    rerender(<ChatThread ai onSuggest={onSuggest} />);
    await userEvent.click(screen.getByRole('button', { name: 'Suggest a reply with AI' }));
    expect(onSuggest).toHaveBeenCalled();
  });

  it('replaces the composer with a lock banner when read-only', () => {
    render(<ChatThread readOnly />);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getByText('Read-only preview. Sending is blocked for staff.')).toBeInTheDocument();
  });

  it('exports the SecureChatThread alias', () => {
    expect(SecureChatThread).toBe(ChatThread);
  });
});
