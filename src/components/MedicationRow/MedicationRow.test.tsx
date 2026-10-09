import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MedicationRow, type Medication } from './MedicationRow';

const oxy: Medication = {
  name: 'Oxycodone 5 mg tablet',
  sig: 'Take 1 tablet by mouth every 6 hours as needed for severe pain',
  qty: 20,
  refills: 0,
  schedule: 'C-II',
  prn: true,
  prescriber: 'Tom Reyes DPT',
};

const renderRow = (ui: React.ReactElement) => render(<ul className="co-list">{ui}</ul>);

describe('MedicationRow', () => {
  it('shows name, schedule, sig and details', () => {
    renderRow(<MedicationRow med={oxy} />);
    expect(screen.getByText('Oxycodone 5 mg tablet')).toBeInTheDocument();
    expect(screen.getByTitle('DEA Schedule C-II controlled substance')).toHaveTextContent('C-II');
    expect(screen.getByText('PRN')).toBeInTheDocument();
    expect(screen.getByText('Qty 20 . 0 refills . Tom Reyes DPT')).toBeInTheDocument();
  });

  it('dims discontinued medications', () => {
    renderRow(<MedicationRow med={{ ...oxy, status: 'discontinued' }} />);
    expect(screen.getByRole('listitem')).toHaveClass('co-med', 'is-dim');
    expect(screen.getByText('Discontinued')).toBeInTheDocument();
  });

  it('runs menu actions with the medication', async () => {
    const onAction = vi.fn();
    renderRow(<MedicationRow med={oxy} onAction={onAction} />);
    await userEvent.click(screen.getByRole('button', { name: 'Actions for Oxycodone 5 mg tablet' }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Discontinue' }));
    expect(onAction).toHaveBeenCalledWith('discontinue', oxy);
  });

  it('hides the menu when actions is false', () => {
    renderRow(<MedicationRow med={oxy} actions={false} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
