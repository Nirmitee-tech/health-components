import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Modal } from './Modal';

describe('Modal', () => {
  it('renders a labelled dialog with the default footer', () => {
    render(
      <Modal inline title="Add Appointment Type">
        Body
      </Modal>
    );
    const dlg = screen.getByRole('dialog', { name: 'Add Appointment Type' });
    expect(dlg).toHaveClass('co-modal', 'co-modal-form');
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toHaveClass('co-btn-pri');
  });

  it('uses alertdialog and a solid red primary for destructive', () => {
    render(
      <Modal inline kind="destructive" size="sm" title="Void this claim?" primaryLabel="Void Claim">
        CLM-20871
      </Modal>
    );
    expect(screen.getByRole('alertdialog', { name: 'Void this claim?' })).toHaveClass('co-modal-sm');
    expect(screen.getByRole('button', { name: 'Void Claim' })).toHaveClass('co-btn-dngs');
  });

  it('calls onPrimary and onClose; footer null removes the footer; open false renders nothing', async () => {
    const onPrimary = vi.fn();
    const onClose = vi.fn();
    const { rerender } = render(
      <Modal inline title="T" onPrimary={onPrimary} onClose={onClose}>
        B
      </Modal>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onPrimary).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(2);
    rerender(
      <Modal inline title="T" footer={null}>
        B
      </Modal>
    );
    expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument();
    rerender(
      <Modal inline open={false} title="T">
        B
      </Modal>
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('portals, traps focus, locks scroll, closes on Escape and returns focus', async () => {
    function Demo() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>Open</button>
          <Modal open={open} title="Discard changes?" kind="confirm" onClose={() => setOpen(false)}>
            <input aria-label="Reason" />
          </Modal>
        </>
      );
    }
    const { container } = render(<Demo />);
    const trigger = screen.getByRole('button', { name: 'Open' });
    await userEvent.click(trigger);
    const dlg = await screen.findByRole('alertdialog', { name: 'Discard changes?' });
    expect(container.contains(dlg)).toBe(false);
    expect(dlg).toHaveAttribute('aria-modal', 'true');
    expect(document.body.style.overflow).toBe('hidden');
    expect(dlg.contains(document.activeElement)).toBe(true);
    // Tab cycles inside the dialog
    for (let i = 0; i < 5; i++) {
      await userEvent.tab();
      expect(dlg.contains(document.activeElement)).toBe(true);
    }
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe('');
    expect(trigger).toHaveFocus();
  });

  it('closes on a scrim press unless closeOnScrim is false', async () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <Modal title="T" onClose={onClose}>
        B
      </Modal>
    );
    const scrim = (await screen.findByRole('dialog')).parentElement!;
    await userEvent.pointer({ keys: '[MouseLeft]', target: scrim });
    expect(onClose).toHaveBeenCalledTimes(1);
    rerender(
      <Modal title="T" onClose={onClose} closeOnScrim={false}>
        B
      </Modal>
    );
    await userEvent.pointer({ keys: '[MouseLeft]', target: screen.getByRole('dialog').parentElement! });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
