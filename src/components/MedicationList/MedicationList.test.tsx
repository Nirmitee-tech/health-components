import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Medication } from '../MedicationRow/MedicationRow';
import { MedicationList } from './MedicationList';

const meds: Medication[] = [
  { name: 'Metformin 500 mg tablet', sig: 'Take 1 tablet by mouth twice daily with meals', qty: 180, refills: 3 },
  { name: 'Sertraline 50 mg tablet', sig: 'Take 1 tablet by mouth once daily', qty: 30, refills: 5 },
];

describe('MedicationList', () => {
  it('renders one row per medication and the reconciliation status', () => {
    render(<MedicationList items={meds} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('Not reconciled this visit')).toBeInTheDocument();
  });

  it('runs Reconcile, Prescribe and row actions', async () => {
    const onReconcile = vi.fn();
    const onPrescribe = vi.fn();
    const onItemAction = vi.fn();
    render(
      <MedicationList items={meds} reconciled="10/09/2026" onReconcile={onReconcile} onPrescribe={onPrescribe} onItemAction={onItemAction} />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Reconcile' }));
    await userEvent.click(screen.getByRole('button', { name: 'Prescribe' }));
    await userEvent.click(screen.getByRole('button', { name: 'Actions for Sertraline 50 mg tablet' }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Renew' }));
    expect(onReconcile).toHaveBeenCalledTimes(1);
    expect(onPrescribe).toHaveBeenCalledTimes(1);
    expect(onItemAction).toHaveBeenCalledWith('renew', meds[1]);
  });

  it('hides all actions when read-only', () => {
    render(<MedicationList items={meds} readOnly />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
