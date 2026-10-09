import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { InboxList, type InboxListItem } from './InboxList';

const items: InboxListItem[] = [
  { id: 1, type: 'Lab Results', patient: 'Ralph Edwards', item: 'Potassium 6.1 mmol/L (H)', received: '08:42', priority: 'Critical', status: 'New' },
  { id: 2, type: 'Imaging', patient: 'Nora Scott', item: 'X-ray knee', received: 'Yesterday', priority: 'Abnormal', status: 'Routed' },
];
const categories = [
  { id: 'Lab Results', count: 1 },
  { id: 'Imaging', count: 1 },
];

describe('InboxList', () => {
  it('shows the critical alert with its actions', async () => {
    const onAcknowledge = vi.fn();
    render(<InboxList items={items} critical={{ title: '1 critical value waiting.', body: 'Ralph Edwards' }} onAcknowledge={onAcknowledge} />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('1 critical value waiting.');
    await userEvent.click(within(alert).getByRole('button', { name: 'Acknowledge and Call Patient' }));
    expect(onAcknowledge).toHaveBeenCalledTimes(1);
  });

  it('filters rows by type tab', async () => {
    const onCategoryChange = vi.fn();
    render(<InboxList items={items} categories={categories} onCategoryChange={onCategoryChange} />);
    expect(screen.getByRole('tab', { name: /All/ })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Nora Scott')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('tab', { name: /Lab Results/ }));
    expect(onCategoryChange).toHaveBeenCalledWith('Lab Results');
    expect(screen.queryByText('Nora Scott')).not.toBeInTheDocument();
    expect(screen.getByText('Ralph Edwards')).toBeInTheDocument();
  });

  it('disables Sign Selected when the role cannot sign and shows the lock text', async () => {
    const onMarkReviewed = vi.fn();
    render(<InboxList items={items} canSign={false} lockText="Signing needs a provider." onMarkReviewed={onMarkReviewed} />);
    expect(screen.getByText('Signing needs a provider.')).toBeInTheDocument();
    const boxes = screen.getAllByRole('checkbox');
    await userEvent.click(boxes[boxes.length - 1]!);
    expect(screen.getByRole('button', { name: 'Sign Selected' })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'Mark Reviewed' }));
    expect(onMarkReviewed).toHaveBeenCalledWith([2]);
  });

  it('accepts className and native attributes on the root', () => {
    const { container } = render(<InboxList items={items} className="x" data-testid="inbox" />);
    expect(container.firstChild).toHaveClass('co-dt', 'x');
    expect(screen.getByTestId('inbox')).toBeInTheDocument();
  });
});
