import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MAR, type MarRow } from './MAR';

const rows: MarRow[] = [
  { id: 'm2', med: 'cefTRIAXone', dose: '1 g', route: 'IV', type: 'scheduled', barcode: 'NDC0409-7332', slots: { '09:00': { status: 'Late' } } },
  {
    id: 'm4',
    med: 'insulin lispro',
    dose: '4 units',
    route: 'subcut',
    type: 'scheduled',
    highAlert: true,
    barcode: 'NDC0002-7510',
    slots: { '12:00': { status: 'Due', value: { measure: 'glucose', v: 212 } } },
  },
  { id: 'm5', med: 'oxyCODONE', dose: '5 mg', route: 'PO', type: 'prn', barcode: 'NDC0406-0552', prnReason: 'Pain 6/10', slots: { '12:00': { status: 'Available' } } },
  { id: 'm8', med: "lactated Ringer's", dose: '1,000 mL', route: 'IV', type: 'continuous', rateMlH: 125, slots: { '08:00': { status: 'Running' } } },
];
const base = { rows, times: ['08:00', '09:00', '12:00'], patientName: 'Marcus Hill', patientBarcode: 'MRN0048213', nurse: 'L. Chen RN', now: '12:04' };

async function scan(name: RegExp, code: string) {
  const field = screen.getByRole('textbox', { name });
  await userEvent.type(field, code + '{Enter}');
}

describe('MAR', () => {
  it('counts late and due doses and filters by order type', async () => {
    render(<MAR {...base} />);
    expect(screen.getByText('1 late')).toBeInTheDocument();
    expect(screen.getByText('1 due now')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('radio', { name: 'PRN' }));
    expect(screen.getByRole('rowheader', { name: /oxyCODONE/ })).toBeInTheDocument();
    expect(screen.queryByRole('rowheader', { name: /cefTRIAXone/ })).not.toBeInTheDocument();
  });

  it('runs the administration flow: two scans unlock Given, which records the dose', async () => {
    const onRecord = vi.fn();
    render(<MAR {...base} onRecord={onRecord} />);
    await userEvent.click(screen.getByRole('button', { name: 'Administer cefTRIAXone 09:00, Late' }));
    const panel = screen.getByRole('region', { name: 'Administer cefTRIAXone' });
    const given = within(panel).getByRole('button', { name: 'Record Given' });
    expect(given).toBeDisabled();
    expect(within(panel).getByText('Given unlocks after both scans match.')).toBeInTheDocument();

    await scan(/patient wristband/, 'MRN0048213');
    expect(given).toBeDisabled();
    await scan(/medication barcode/, 'NDC0409-7332');
    expect(given).toBeEnabled();
    const rights = within(within(panel).getByRole('list', { name: 'Five rights check' })).getAllByRole('listitem');
    expect(rights.filter((li) => li.classList.contains('ok'))).toHaveLength(5);

    await userEvent.click(given);
    expect(onRecord).toHaveBeenCalledWith({ row: 'm2', time: '09:00', status: 'Given', witness: '', reason: '' });
    expect(screen.queryByRole('region', { name: 'Administer cefTRIAXone' })).not.toBeInTheDocument();
    const cell = screen.getAllByRole('row')[1]!;
    expect(within(cell).getByText('Given')).toHaveClass('nu-st', 'nu-st-Given');
    expect(within(cell).getByText('12:04 L. Chen RN')).toBeInTheDocument();
    expect(screen.queryByText('1 late')).not.toBeInTheDocument();
  });

  it('keeps Given disabled on a scan mismatch and marks the rights failed', async () => {
    render(<MAR {...base} defaultActive={{ row: 'm2', time: '09:00' }} defaultScans={{ patient: true, med: false }} />);
    const panel = screen.getByRole('region', { name: 'Administer cefTRIAXone' });
    expect(within(panel).getByRole('button', { name: 'Record Given' })).toBeDisabled();
    const bad = within(panel).getAllByRole('listitem').filter((li) => li.classList.contains('bad'));
    expect(bad).toHaveLength(4);
  });

  it('needs a witness for a high-alert drug', async () => {
    const onRecord = vi.fn();
    render(<MAR {...base} onRecord={onRecord} defaultActive={{ row: 'm4', time: '12:00' }} defaultScans={{ patient: true, med: true }} />);
    const given = screen.getByRole('button', { name: 'Record Given' });
    expect(given).toBeDisabled();
    expect(screen.getByText('Given unlocks after the witness is entered.')).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText(/Witness \(second RN/), 'R. Patel RN');
    await userEvent.click(given);
    expect(onRecord).toHaveBeenCalledWith(expect.objectContaining({ row: 'm4', status: 'Given', witness: 'R. Patel RN' }));
    expect(screen.getByText('Witness R. Patel RN')).toBeInTheDocument();
  });

  it('records Held only with a reason', async () => {
    const onRecord = vi.fn();
    render(<MAR {...base} onRecord={onRecord} />);
    await userEvent.click(screen.getByRole('button', { name: 'Administer oxyCODONE 12:00, PRN available' }));
    expect(screen.getByText(/PRN indication: Pain 6\/10\. Reassess within 60 min\./)).toBeInTheDocument();
    const held = screen.getByRole('button', { name: 'Held' });
    expect(held).toBeDisabled();
    await userEvent.type(screen.getByLabelText('Reason (needed for Held or Refused)'), 'Patient asleep');
    await userEvent.click(held);
    expect(onRecord).toHaveBeenCalledWith(expect.objectContaining({ row: 'm5', status: 'Held', reason: 'Patient asleep' }));
    expect(screen.getByText('Patient asleep')).toBeInTheDocument();
  });

  it('cancels the panel', async () => {
    render(<MAR {...base} defaultActive={{ row: 'm2', time: '09:00' }} />);
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('region', { name: /Administer/ })).not.toBeInTheDocument();
  });

  it('read only: cells are not buttons', () => {
    render(<MAR {...base} readOnly />);
    expect(screen.getByText('View only')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Administer/ })).not.toBeInTheDocument();
  });

  it('shows the infusion rate formatted', () => {
    render(<MAR {...base} />);
    expect(screen.getByRole('rowheader', { name: /lactated Ringer's/ })).toHaveTextContent('125mL/h');
    expect(MAR.statuses).toContain('Given');
  });
});
