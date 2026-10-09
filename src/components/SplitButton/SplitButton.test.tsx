import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SplitButton } from './SplitButton';

describe('SplitButton', () => {
  it('runs the main action and opens the menu from the arrow', async () => {
    const onClick = vi.fn();
    const onSelect = vi.fn();
    render(<SplitButton label="Submit Claim" onClick={onClick} items={[{ label: 'Save as Draft', onSelect }]} />);
    await userEvent.click(screen.getByRole('button', { name: 'Submit Claim' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    const arrow = screen.getByRole('button', { name: 'More options' });
    expect(arrow).toHaveClass('co-btn', 'co-btn-pri', 'co-split-t');
    expect(arrow).toHaveAttribute('aria-haspopup', 'menu');
    await userEvent.click(arrow);
    expect(arrow).toHaveAttribute('aria-expanded', 'true');
    const item = screen.getByRole('menuitem', { name: 'Save as Draft' });
    expect(item).toHaveFocus();
    await userEvent.click(item);
    expect(onSelect).toHaveBeenCalled();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('closes on Escape and disables both halves', async () => {
    const { rerender } = render(
      <SplitButton label="Export" variant="secondary" defaultOpen items={[{ label: 'CSV' }]} />
    );
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    rerender(<SplitButton label="Export" disabled items={[{ label: 'CSV' }]} />);
    for (const b of screen.getAllByRole('button')) expect(b).toBeDisabled();
  });
});
