import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { KPIGrid } from './KPIGrid';

const items = [
  { label: 'Needs Submission', value: '9' },
  { label: 'Pended', value: '6' },
];

describe('KPIGrid', () => {
  it('renders plain cards without filter', () => {
    render(<KPIGrid items={items} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('group')).not.toBeInTheDocument();
  });

  it('acts as a single-select filter that clears on second press', async () => {
    const onSelect = vi.fn();
    render(<KPIGrid items={items} filter label="Filter" onSelect={onSelect} />);
    expect(screen.getByRole('group', { name: 'Filter' })).toBeInTheDocument();
    const pended = screen.getByRole('button', { name: /Pended/ });
    await userEvent.click(pended);
    expect(pended).toHaveAttribute('aria-pressed', 'true');
    expect(onSelect).toHaveBeenLastCalledWith('Pended');
    await userEvent.click(screen.getByRole('button', { name: /Needs Submission/ }));
    expect(pended).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(screen.getByRole('button', { name: /Needs Submission/ }));
    expect(onSelect).toHaveBeenLastCalledWith(null);
  });

  it('is controllable', async () => {
    const onSelect = vi.fn();
    render(<KPIGrid items={items} filter selected="Pended" onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('button', { name: /Needs Submission/ }));
    expect(onSelect).toHaveBeenCalledWith('Needs Submission');
    expect(screen.getByRole('button', { name: /Pended/ })).toHaveAttribute('aria-pressed', 'true');
  });
});
