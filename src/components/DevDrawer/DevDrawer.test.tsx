import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DevDrawer } from './DevDrawer';

describe('DevDrawer', () => {
  it('shows only the passed sections in fixed order', () => {
    render(<DevDrawer inline screen="Eligibility" purpose="Sends a 270." states="Waiting, Active" api="POST /eligibility/270" />);
    expect(screen.getByRole('dialog', { name: 'For developers: Eligibility' })).toBeInTheDocument();
    const headings = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);
    expect(headings).toEqual(['Purpose and roles', 'API', 'States']);
    expect(screen.getByText('POST /eligibility/270').tagName).toBe('PRE');
  });

  it('closes with the close button and Escape when portalled', async () => {
    const onClose = vi.fn();
    render(<DevDrawer screen="Claims" purpose="Claims list." onClose={onClose} />);
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    await userEvent.click(screen.getByRole('button', { name: 'Close developer panel' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('renders nothing when closed', () => {
    render(<DevDrawer inline open={false} screen="Claims" purpose="Claims list." />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
