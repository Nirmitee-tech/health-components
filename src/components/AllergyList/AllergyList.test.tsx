import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AllergyList, type AllergyItem } from './AllergyList';

const items: AllergyItem[] = [
  { substance: 'Penicillin', type: 'Drug', reaction: 'Anaphylaxis', severity: 'severe', onset: '2004' },
  { substance: 'Codeine', type: 'Drug', reaction: 'Nausea', severity: 'mild', status: 'inactive' },
];

describe('AllergyList', () => {
  it('lists allergies with details, severity and status', () => {
    render(<AllergyList items={items} reviewed="10/09/2026 by Lisa Chen RN" />);
    expect(screen.getByRole('region', { name: 'Allergies' })).toBeInTheDocument();
    expect(screen.getByText('Reviewed 10/09/2026 by Lisa Chen RN')).toBeInTheDocument();
    expect(screen.getByText('Drug . Anaphylaxis . since 2004')).toBeInTheDocument();
    expect(screen.getByText('Severe')).toHaveClass('co-tag-danger');
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('shows NKA for an empty list and a warning when not reviewed', () => {
    const { rerender } = render(<AllergyList items={[]} />);
    expect(screen.getByText('No Known Allergies (NKA)')).toBeInTheDocument();
    rerender(<AllergyList />);
    expect(screen.getByText('Allergies not reviewed')).toBeInTheDocument();
    expect(screen.getByText('Not reviewed this visit')).toBeInTheDocument();
  });

  it('runs header and row actions', async () => {
    const onAdd = vi.fn();
    const onMarkReviewed = vi.fn();
    const onItemAction = vi.fn();
    render(<AllergyList items={items} onAdd={onAdd} onMarkReviewed={onMarkReviewed} onItemAction={onItemAction} />);
    await userEvent.click(screen.getByRole('button', { name: 'Add Allergy' }));
    await userEvent.click(screen.getByRole('button', { name: 'Mark Reviewed' }));
    await userEvent.click(screen.getByRole('button', { name: 'Actions for Penicillin' }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Entered in Error' }));
    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onMarkReviewed).toHaveBeenCalledTimes(1);
    expect(onItemAction).toHaveBeenCalledWith('entered-in-error', items[0]);
  });

  it('hides actions when read-only', () => {
    render(<AllergyList items={items} readOnly />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
