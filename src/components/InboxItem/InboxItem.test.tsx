import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { InboxItem, type InboxItemData } from './InboxItem';

const item: InboxItemData = {
  kind: 'result',
  patient: 'Ralph Edwards',
  title: 'Potassium 6.1 mmol/L (critical)',
  from: 'Quest . BMP',
  received: '08:42',
  priority: 'Critical',
  unread: true,
  actions: ['Acknowledge', 'Open Chart'],
};

describe('InboxItem', () => {
  it('renders kind, priority in words and unread/critical classes', () => {
    const { container } = render(<InboxItem item={item} className="x" />);
    expect(container.firstChild).toHaveClass('co-inbox', 'is-unread', 'is-crit', 'x');
    expect(screen.getByText('Result')).toBeInTheDocument();
    expect(screen.getByText('Critical')).toBeInTheDocument();
  });

  it('makes the first action primary and reports the chosen action', async () => {
    const onAction = vi.fn();
    render(<InboxItem item={item} onAction={onAction} />);
    const ack = screen.getByRole('button', { name: /^Acknowledge/ });
    expect(ack).toHaveClass('co-btn-pri');
    await userEvent.click(screen.getByRole('button', { name: /^Open Chart/ }));
    expect(onAction).toHaveBeenCalledWith('Open Chart', item);
  });

  it('defaults to one Open action and no priority badge', () => {
    render(<InboxItem item={{ kind: 'message', patient: 'Nora Scott', title: 'Question', from: 'Portal', received: 'Mon' }} />);
    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(screen.getByRole('button', { name: /^Open/ })).toBeInTheDocument();
    expect(screen.queryByText('Normal')).not.toBeInTheDocument();
  });
});
