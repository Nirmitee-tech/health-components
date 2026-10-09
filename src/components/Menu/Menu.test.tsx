import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { KebabMenu, Menu, Popover, type MenuItem } from './Menu';

const items: MenuItem[] = [
  { heading: 'CLM-20871' },
  { label: 'Open Claim', icon: 'file' },
  { label: 'Check Status', hint: 'Last checked 2 h ago' },
  { label: 'Print', disabled: true },
  { divider: true },
  { label: 'Void Claim', danger: true },
];

describe('Menu', () => {
  it('renders items, headings, dividers and states', () => {
    render(<Menu inline label="Claim actions" items={items} />);
    const menu = screen.getByRole('menu', { name: 'Claim actions' });
    expect(menu).toHaveClass('co-menu', 'co-menu-inline');
    expect(screen.getAllByRole('menuitem')).toHaveLength(4);
    expect(screen.getByRole('separator')).toHaveClass('co-menu-sep');
    expect(screen.getByRole('menuitem', { name: 'Print' })).toBeDisabled();
    expect(screen.getByRole('menuitem', { name: 'Void Claim' })).toHaveClass('co-mi-danger');
    expect(screen.getByText('Last checked 2 h ago')).toHaveClass('co-mi-s');
  });

  it('calls onSelect then onClose', async () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    render(<Menu inline items={[{ label: 'Open Claim', onSelect }]} onClose={onClose} />);
    await userEvent.click(screen.getByRole('menuitem', { name: 'Open Claim' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('moves focus with arrows, Home, End and type-ahead, skipping disabled items', async () => {
    render(<Menu inline items={items} />);
    const [open, status, , voidItem] = screen.getAllByRole('menuitem');
    expect(open).toHaveAttribute('tabindex', '0');
    open!.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(status).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(voidItem).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(open).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(voidItem).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(open).toHaveFocus();
    await userEvent.keyboard('c');
    expect(status).toHaveFocus();
  });
});

describe('KebabMenu', () => {
  it('opens from the trigger, focuses the first item, and closes on Escape returning focus', async () => {
    render(<KebabMenu label="Actions for CLM-1" items={[{ label: 'Reschedule' }, { label: 'Mark Arrived' }]} />);
    const trigger = screen.getByRole('button', { name: 'Actions for CLM-1' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menuitem', { name: 'Reschedule' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('opens on ArrowUp with focus on the last item and closes after choosing', async () => {
    const onSelect = vi.fn();
    render(<KebabMenu items={[{ label: 'Reschedule' }, { label: 'Mark No Show', onSelect }]} />);
    const trigger = screen.getByRole('button', { name: 'Row actions' });
    trigger.focus();
    await userEvent.keyboard('{ArrowUp}');
    const last = screen.getByRole('menuitem', { name: 'Mark No Show' });
    expect(last).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalled();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('closes on outside click and supports controlled open', async () => {
    const onOpenChange = vi.fn();
    render(
      <div>
        <KebabMenu defaultOpen items={[{ label: 'Reschedule' }]} onOpenChange={onOpenChange} />
        <p>outside</p>
      </div>
    );
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await userEvent.click(screen.getByText('outside'));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

describe('Popover', () => {
  it('toggles a labelled dialog and closes on Escape', async () => {
    render(
      <Popover trigger="Filters (2)" title="Filter claims">
        <label>
          <input type="checkbox" /> Rejected
        </label>
      </Popover>
    );
    const trigger = screen.getByRole('button', { name: 'Filters (2)' });
    await userEvent.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'Filter claims' });
    expect(dialog).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
