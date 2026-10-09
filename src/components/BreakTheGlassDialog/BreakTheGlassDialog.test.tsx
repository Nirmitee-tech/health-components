import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { BreakTheGlassDialog } from './BreakTheGlassDialog';

const base = { patient: 'Nora Scott', dob: '06/11/1999', careTeam: 'Mandy Harley LCSW' };

describe('BreakTheGlassDialog', () => {
  it('is an alertdialog with the patient details and no reason pre-selected', () => {
    render(<BreakTheGlassDialog {...base} inline />);
    expect(screen.getByRole('alertdialog', { name: 'Break the glass to open this chart' })).toBeInTheDocument();
    expect(screen.getByText('Nora Scott')).toBeInTheDocument();
    expect(screen.getAllByRole('radio').every((r) => !(r as HTMLInputElement).checked)).toBe(true);
    expect(screen.getByRole('button', { name: 'Open Chart and Log Access' })).toBeDisabled();
  });

  it('enables confirm after a reason and passes it to onConfirm', async () => {
    const onConfirm = vi.fn();
    render(<BreakTheGlassDialog {...base} inline onConfirm={onConfirm} />);
    await userEvent.click(screen.getByRole('radio', { name: 'Emergency treatment' }));
    await userEvent.click(screen.getByRole('button', { name: 'Open Chart and Log Access' }));
    expect(onConfirm).toHaveBeenCalledWith({ reason: 'Emergency treatment', note: '' });
  });

  it('needs an explanation for Other', async () => {
    const onConfirm = vi.fn();
    render(<BreakTheGlassDialog {...base} inline onConfirm={onConfirm} />);
    await userEvent.click(screen.getByRole('radio', { name: 'Other' }));
    const confirm = screen.getByRole('button', { name: 'Open Chart and Log Access' });
    expect(confirm).toBeDisabled();
    await userEvent.type(screen.getByRole('textbox', { name: /Explain/ }), 'Court order');
    expect(confirm).toBeEnabled();
    await userEvent.click(confirm);
    expect(onConfirm).toHaveBeenCalledWith({ reason: 'Other', note: 'Court order' });
  });

  it('portals, traps focus and closes on Escape', async () => {
    const onClose = vi.fn();
    render(<BreakTheGlassDialog {...base} onClose={onClose} />);
    const dialog = await screen.findByRole('alertdialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog.contains(document.activeElement)).toBe(true);
    expect(document.body.style.overflow).toBe('hidden');
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('renders nothing when closed and calls onClose from Cancel', async () => {
    const onClose = vi.fn();
    const { rerender } = render(<BreakTheGlassDialog {...base} inline open={false} />);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    rerender(<BreakTheGlassDialog {...base} inline onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
