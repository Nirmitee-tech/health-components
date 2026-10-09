import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PharmacyVerificationQueue, type PharmacyOrder } from './PharmacyVerificationQueue';

const base = { sig: 'IV every 12 hours', unit: '4 West 12', age: '74 y', prescriber: 'Ana Ruiz MD', ordered: '10/09 08:10' };
const orders: PharmacyOrder[] = [
  {
    ...base,
    id: 'o1',
    drug: 'Vancomycin 1,500 mg IV',
    patient: 'Ralph Edwards',
    status: 'pending',
    weight: 86.1,
    dosePerKg: { amount: 1500, unit: 'mg', min: 15, max: 20, hardMax: 30 },
  },
  {
    ...base,
    id: 'o2',
    drug: 'Acetaminophen 480 mg PO',
    patient: 'Maya Ortiz',
    status: 'pending',
    weight: 16.2,
    dosePerKg: { amount: 480, unit: 'mg', min: 10, max: 15, hardMax: 20 },
  },
  { ...base, id: 'o3', drug: 'Morphine 4 mg IV', patient: 'Henna West', status: 'pending', schedule: 'C-II' },
  { ...base, id: 'o5', drug: 'Ceftriaxone 1 g IV', patient: 'Maria Gomez', status: 'verified', by: 'R. Patel PharmD' },
];

const listbox = () => screen.getByRole('listbox', { name: 'Orders to verify' });

describe('PharmacyVerificationQueue', () => {
  it('lists pending orders in a listbox with the first selected', () => {
    render(<PharmacyVerificationQueue orders={orders} />);
    const opts = within(listbox()).getAllByRole('option');
    expect(opts).toHaveLength(3);
    expect(opts[0]).toHaveAttribute('aria-selected', 'true');
    expect(opts[0]).toHaveAttribute('tabindex', '0');
    expect(opts[1]).toHaveAttribute('tabindex', '-1');
    expect(screen.getByText('3 pending . oldest now')).toBeInTheDocument();
  });

  it('checks the weight-based dose: within range verifies', async () => {
    const onStatusChange = vi.fn();
    render(<PharmacyVerificationQueue orders={orders} user="R. Patel PharmD" onStatusChange={onStatusChange} />);
    expect(screen.getByText('Weight-based dose').closest('.co-alert')).toHaveClass('co-alert-success');
    const verify = screen.getByRole('button', { name: 'Verify' });
    expect(verify).toBeEnabled();
    await userEvent.click(verify);
    expect(onStatusChange).toHaveBeenCalledWith('o1', 'verified', expect.objectContaining({ id: 'o1', status: 'verified', by: 'R. Patel PharmD' }));
    expect(screen.getByText('Verified by R. Patel PharmD.')).toBeInTheDocument();
    expect(within(listbox()).getAllByRole('option')).toHaveLength(2);
    expect(screen.getByText('2 pending . oldest now')).toBeInTheDocument();
  });

  it('blocks Verify above the hard dose limit but allows Reject', async () => {
    const onStatusChange = vi.fn();
    render(<PharmacyVerificationQueue orders={orders} defaultSelected="o2" onStatusChange={onStatusChange} />);
    const verify = screen.getByRole('button', { name: 'Verify' });
    expect(verify).toBeDisabled();
    expect(verify).toHaveAccessibleDescription('Verify is blocked above the hard dose limit.');
    expect(screen.getByRole('alert')).toHaveTextContent('Weight-based dose');
    await userEvent.click(screen.getByRole('button', { name: 'Reject' }));
    expect(onStatusChange).toHaveBeenCalledWith('o2', 'rejected', expect.objectContaining({ status: 'rejected' }));
    expect(screen.getByText('Rejected.')).toBeInTheDocument();
  });

  it('asks the prescriber to clarify', async () => {
    render(<PharmacyVerificationQueue orders={orders} defaultSelected="o3" />);
    await userEvent.click(screen.getByRole('button', { name: 'Clarify with Prescriber' }));
    await userEvent.click(screen.getByRole('radio', { name: 'Clarify' }));
    const opts = within(listbox()).getAllByRole('option');
    expect(opts).toHaveLength(1);
    expect(opts[0]).toHaveTextContent('Morphine 4 mg IV');
  });

  it('moves the selection with the arrow keys, Home and End', async () => {
    const onSelectedChange = vi.fn();
    render(<PharmacyVerificationQueue orders={orders} onSelectedChange={onSelectedChange} />);
    const opts = within(listbox()).getAllByRole('option');
    opts[0]!.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(onSelectedChange).toHaveBeenLastCalledWith('o2');
    expect(opts[1]).toHaveFocus();
    expect(opts[1]).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{End}');
    expect(opts[2]).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(opts[0]).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}');
    expect(opts[0]).toHaveFocus();
  });

  it('shows the empty state without a listbox', () => {
    render(<PharmacyVerificationQueue orders={[]} />);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByText('Queue is clear')).toBeInTheDocument();
  });
});
