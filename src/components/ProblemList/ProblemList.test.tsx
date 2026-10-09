import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ProblemList, type ProblemItem } from './ProblemList';

const items: ProblemItem[] = [
  { code: 'E11.9', label: 'Type 2 diabetes mellitus without complications', onset: '2019', chronic: true, hcc: '38' },
  { code: 'S93.401A', label: 'Sprain of right ankle', onset: '2025', status: 'resolved' },
];

describe('ProblemList', () => {
  it('shows active problems with their tags by default', () => {
    render(<ProblemList items={items} readOnly />);
    expect(screen.getByRole('region', { name: 'Problems' })).toBeInTheDocument();
    expect(screen.getByText('Type 2 diabetes mellitus without complications')).toBeInTheDocument();
    expect(screen.queryByText('Sprain of right ankle')).not.toBeInTheDocument();
    expect(screen.getByText('Chronic')).toBeInTheDocument();
    expect(screen.getByText('HCC 38')).toBeInTheDocument();
    expect(screen.getByText('Onset 2019')).toBeInTheDocument();
  });

  it('filters by status and reports the change', async () => {
    const onFilterChange = vi.fn();
    render(<ProblemList items={items} readOnly onFilterChange={onFilterChange} />);
    await userEvent.click(screen.getByRole('radio', { name: 'Resolved' }));
    expect(onFilterChange).toHaveBeenCalledWith('resolved');
    expect(screen.getByText('Sprain of right ankle')).toBeInTheDocument();
    expect(screen.queryByText('Type 2 diabetes mellitus without complications')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('radio', { name: 'All' }));
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('honours a controlled filter', () => {
    render(<ProblemList items={items} readOnly filter="all" />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('shows an empty state when nothing matches', () => {
    render(<ProblemList items={[]} readOnly />);
    expect(screen.getByRole('heading', { name: 'No active problems' })).toBeInTheDocument();
  });

  it('offers the Add problem picker unless read-only', () => {
    const { rerender } = render(<ProblemList items={items} icdOptions={[{ code: 'E78.5', label: 'Hyperlipidemia' }]} />);
    expect(screen.getByRole('combobox', { name: /Add problem/ })).toBeInTheDocument();
    rerender(<ProblemList items={items} readOnly />);
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });
});
