import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CommandPalette, useCommandPaletteShortcut, type CommandPaletteItem } from './CommandPalette';

const items: CommandPaletteItem[] = [
  { kind: 'Patient', label: 'Henna West', meta: '03/14/1988 . MRN-100231' },
  { kind: 'Screen', label: 'Claims', meta: 'Revenue', icon: 'dollar' },
  { kind: 'Screen', label: 'Prior Auth Queue', meta: 'Revenue' },
  { kind: 'Action', label: 'New Appointment', meta: 'Schedule' },
];

describe('CommandPalette', () => {
  it('lists items as options of a combobox', () => {
    render(<CommandPalette inline items={items} />);
    const input = screen.getByRole('combobox', { name: 'Jump to a screen, patient or action' });
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('option')).toHaveLength(4);
    expect(screen.getAllByRole('option')[0]).toHaveAttribute('aria-selected', 'true');
    expect(input).toHaveAttribute('aria-activedescendant', screen.getAllByRole('option')[0]!.id);
  });

  it('filters by label and meta, and shows a hint when nothing matches', async () => {
    render(<CommandPalette inline items={items} />);
    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'revenue');
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual([
      expect.stringContaining('Claims'),
      expect.stringContaining('Prior Auth Queue'),
    ]);
    await userEvent.clear(input);
    await userEvent.type(input, 'zzz');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('status')).toHaveTextContent('Nothing matches "zzz"');
  });

  it('moves with arrows and selects with Enter or click', async () => {
    const onSelect = vi.fn();
    render(<CommandPalette inline items={items} onSelect={onSelect} />);
    const input = screen.getByRole('combobox');
    input.focus();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowUp}{Enter}');
    expect(onSelect).toHaveBeenLastCalledWith(items[1]);
    await userEvent.click(screen.getByRole('option', { name: /New Appointment/ }));
    expect(onSelect).toHaveBeenLastCalledWith(items[3]);
  });

  it('focuses the input when portalled and closes on Escape', async () => {
    const onClose = vi.fn();
    render(<CommandPalette items={items} onClose={onClose} />);
    const input = await screen.findByRole('combobox');
    expect(input).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('useCommandPaletteShortcut fires on Ctrl K and Cmd K', () => {
    const onOpen = vi.fn();
    function Demo() {
      useCommandPaletteShortcut(onOpen);
      return null;
    }
    render(<Demo />);
    fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
    fireEvent.keyDown(document, { key: 'K', metaKey: true });
    fireEvent.keyDown(document, { key: 'k' });
    expect(onOpen).toHaveBeenCalledTimes(2);
  });
});
