import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { OrderSetPicker, type OrderSet } from './OrderSetPicker';

const sets: OrderSet[] = [
  {
    name: 'Diabetes follow-up',
    items: [
      { name: 'Hemoglobin A1c', type: 'Lab', detail: 'LOINC 4548-4' },
      { name: 'Diabetic eye exam referral', type: 'Referral', default: false },
      { name: 'Metformin 500 mg renew', type: 'Medication' },
    ],
  },
  { name: 'Prenatal first visit', items: [{ name: 'Prenatal panel', type: 'Lab' }] },
];

describe('OrderSetPicker', () => {
  it('ticks defaults and counts them', () => {
    render(<OrderSetPicker sets={sets} />);
    expect(screen.getByRole('checkbox', { name: /Hemoglobin A1c/ })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /Diabetic eye exam referral/ })).not.toBeChecked();
    expect(screen.getByText('2 of 3 selected')).toBeInTheDocument();
    expect(screen.getByRole('tabpanel')).toHaveAccessibleName(/Diabetes follow-up/);
  });

  it('keeps ticks per set when switching tabs and signs the ticked items', async () => {
    const onSign = vi.fn();
    render(<OrderSetPicker sets={sets} onSign={onSign} />);
    await userEvent.click(screen.getByRole('checkbox', { name: /Diabetic eye exam referral/ }));
    expect(screen.getByText('3 of 3 selected')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('tab', { name: /Prenatal first visit/ }));
    expect(screen.getByText('1 of 1 selected')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('tab', { name: /Diabetes follow-up/ }));
    expect(screen.getByRole('checkbox', { name: /Diabetic eye exam referral/ })).toBeChecked();
    await userEvent.click(screen.getByRole('button', { name: 'Sign Orders' }));
    expect(onSign).toHaveBeenCalledWith(sets[0]!.items, sets[0]);
  });

  it('disables Sign Orders when nothing is ticked', async () => {
    render(<OrderSetPicker sets={sets} defaultCurrent={1} />);
    await userEvent.click(screen.getByRole('checkbox', { name: /Prenatal panel/ }));
    expect(screen.getByRole('button', { name: 'Sign Orders' })).toBeDisabled();
  });
});
