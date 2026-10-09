import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Flowsheet, type FlowsheetColumn, type FlowsheetRow } from './Flowsheet';

const cols: FlowsheetColumn[] = [
  { id: 'c1', label: '08:00' },
  { id: 'c2', label: '09:00' },
];
const rows: FlowsheetRow[] = [
  { id: 'hr', group: 'Vitals', label: 'Heart rate', measure: 'hr', values: { c1: 88, c2: 121 } },
  { id: 'bp', group: 'Vitals', label: 'Blood pressure', measure: 'bp', values: { c1: '124/78', c2: '88/52' } },
  { id: 'gcs', group: 'Neuro', label: 'GCS', measure: 'gcs', values: { c1: 15 } },
  { id: 'loc', group: 'Neuro', label: 'Level of consciousness', values: { c1: 'Alert' } },
];

describe('Flowsheet', () => {
  it('shades abnormal cells and counts them (inpatient ranges by default)', () => {
    render(<Flowsheet columns={cols} rows={rows} />);
    expect(screen.getByText('2 abnormal')).toBeInTheDocument();
    const hrCell = screen.getByRole('button', { name: 'Edit Heart rate at 09:00, now 121 bpm' }).closest('td');
    expect(hrCell).toHaveClass('is-abn');
    expect(screen.getByRole('button', { name: 'Edit Blood pressure at 09:00, now 88/52 mmHg' }).closest('td')).toHaveClass('is-abn');
    expect(screen.getByRole('rowheader', { name: 'Heart rate (bpm)' })).toBeInTheDocument();
  });

  it('a row range wins over the registry', () => {
    render(<Flowsheet columns={cols} rows={[{ id: 'hr', label: 'HR', measure: 'hr', range: { low: 80, high: 140 }, values: { c2: 121 } }]} />);
    expect(screen.getByText('All in range')).toBeInTheDocument();
  });

  it('edits a cell in place and saves on Enter', async () => {
    const onChange = vi.fn();
    render(<Flowsheet columns={cols} rows={rows} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /Edit Heart rate at 08:00/ }));
    const input = screen.getByRole('textbox', { name: 'Heart rate at 08:00' });
    expect(input).toHaveFocus();
    await userEvent.clear(input);
    await userEvent.type(input, '160{Enter}');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('hr', 'c1', '160');
    expect(screen.getByRole('button', { name: 'Edit Heart rate at 08:00, now 160 bpm' }).closest('td')).toHaveClass('is-crit');
  });

  it('Escape cancels an edit without saving', async () => {
    const onChange = vi.fn();
    render(<Flowsheet columns={cols} rows={rows} onChange={onChange} defaultEditing="hr|c1" />);
    const input = screen.getByRole('textbox', { name: 'Heart rate at 08:00' });
    expect(input).toHaveValue('88');
    await userEvent.type(input, '0{Escape}');
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Edit Heart rate at 08:00, now 88 bpm' })).toBeInTheDocument();
  });

  it('adds a column', async () => {
    const onAddColumn = vi.fn();
    render(<Flowsheet columns={cols} rows={rows} nextTime={() => '10:00'} onAddColumn={onAddColumn} />);
    await userEvent.click(screen.getByRole('button', { name: 'Add column' }));
    expect(onAddColumn).toHaveBeenCalledWith(expect.objectContaining({ label: '10:00', isNew: true }));
    expect(screen.getByRole('columnheader', { name: '10:00 new column' })).toBeInTheDocument();
  });

  it('collapses a group and shows its abnormal count', async () => {
    render(<Flowsheet columns={cols} rows={rows} />);
    const toggle = screen.getByRole('button', { name: /Vitals/ });
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(within(toggle).getByText('2 abnormal')).toBeInTheDocument();
    expect(screen.queryByRole('rowheader', { name: /Heart rate/ })).not.toBeInTheDocument();
  });

  it('switches to the graph view', async () => {
    render(<Flowsheet columns={cols} rows={rows} />);
    await userEvent.click(screen.getByRole('radio', { name: 'Graph' }));
    expect(screen.getByRole('img', { name: 'Heart rate: 88, 121 bpm' })).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('read only has no edit buttons', () => {
    render(<Flowsheet columns={cols} rows={rows} readOnly />);
    expect(screen.getByText('View only')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Edit/ })).not.toBeInTheDocument();
  });
});
