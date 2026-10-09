import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { StructuredDataGrid, type StructuredDataGridColumn } from './StructuredDataGrid';

const cols: StructuredDataGridColumn[] = [
  { key: 'time', label: 'Time', type: 'text', readOnly: true },
  { key: 'hr', label: 'HR', code: 'HR', min: 20, max: 250, required: true },
  { key: 'spo2', label: 'SpO2', code: 'SpO2', min: 50, max: 100 },
  { key: 'rhythm', label: 'Rhythm', type: 'select', options: ['Sinus', 'A-fib'] },
];

describe('StructuredDataGrid', () => {
  it('blocks impossible values, warns on out-of-range ones', async () => {
    const onSave = vi.fn();
    render(
      <StructuredDataGrid
        title="ICU hourly vitals"
        columns={cols}
        rows={[
          { time: '08:00', hr: '88', spo2: '96', rhythm: 'Sinus' },
          { time: '09:00', hr: '7o', spo2: '104', rhythm: '' },
        ]}
        onSave={onSave}
      />
    );
    expect(screen.getByRole('grid', { name: 'ICU hourly vitals' })).toBeInTheDocument();
    const hr = screen.getByRole('textbox', { name: 'HR, 09:00 in bpm' });
    expect(hr).toHaveAttribute('aria-invalid', 'true');
    expect(hr).toHaveAccessibleDescription('Numbers only');
    expect(screen.getByRole('textbox', { name: 'SpO2, 09:00 in %' })).toHaveAccessibleDescription('Outside 50 to 100. Check entry.');
    expect(screen.getByText('2 to fix')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Save Flowsheet' }));
    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByText('Fix 2 cells before saving')).toBeInTheDocument();

    await userEvent.clear(hr);
    await userEvent.type(hr, '130');
    await userEvent.clear(screen.getByRole('textbox', { name: 'SpO2, 09:00 in %' }));
    await userEvent.type(screen.getByRole('textbox', { name: 'SpO2, 09:00 in %' }), '93');
    expect(hr).not.toHaveAttribute('aria-invalid');
    expect(hr).toHaveAccessibleDescription('High (ref 60–100 bpm)');
    expect(screen.getByText('2 out of range')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Save Flowsheet' }));
    expect(onSave).toHaveBeenCalledWith([
      { time: '08:00', hr: '88', spo2: '96', rhythm: 'Sinus' },
      { time: '09:00', hr: '130', spo2: '93', rhythm: '' },
    ]);
  });

  it('flags a missing required value only after a save attempt or for a new blank', async () => {
    render(<StructuredDataGrid title="Vitals" columns={cols} rows={[{ time: '08:00', hr: '', spo2: '', rhythm: '' }]} />);
    expect(screen.queryByText('Required')).not.toBeInTheDocument();
    expect(screen.getByText('1 to fix')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Save Flowsheet' }));
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('adds a row and moves between cells with Enter, Down and Up', async () => {
    const onRowsChange = vi.fn();
    render(<StructuredDataGrid title="Vitals" columns={cols} rows={[{ time: '08:00', hr: '88', spo2: '96', rhythm: 'Sinus' }]} onRowsChange={onRowsChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Add Row' }));
    expect(onRowsChange).toHaveBeenLastCalledWith([
      { time: '08:00', hr: '88', spo2: '96', rhythm: 'Sinus' },
      { time: '', hr: '', spo2: '', rhythm: '' },
    ]);
    const first = screen.getByRole('textbox', { name: 'HR, 08:00 in bpm' });
    const second = screen.getByRole('textbox', { name: 'HR, row 2 in bpm' });
    first.focus();
    await userEvent.keyboard('{Enter}');
    expect(second).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}');
    expect(first).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(second).toHaveFocus();
  });

  it('moves to the next cell with Right at the end of a value', async () => {
    render(<StructuredDataGrid title="Vitals" columns={cols} rows={[{ time: '08:00', hr: '88', spo2: '96', rhythm: 'Sinus' }]} />);
    const hr = screen.getByRole('textbox', { name: 'HR, 08:00 in bpm' });
    await userEvent.click(hr);
    hr.setSelectionRange(1, 1);
    await userEvent.keyboard('{ArrowRight}');
    expect(hr).toHaveFocus();
    hr.setSelectionRange(2, 2);
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('textbox', { name: 'SpO2, 08:00 in %' })).toHaveFocus();
    await userEvent.keyboard('{End}{ArrowRight}');
    expect(screen.getByRole('combobox', { name: 'Rhythm, 08:00' })).toHaveFocus();
  });

  it('renders read-only cells as formatted values', () => {
    render(
      <StructuredDataGrid
        title="Dialysis runs"
        readOnly
        columns={[
          { key: 'run', label: 'Run', type: 'text', readOnly: true },
          { key: 'k', label: 'Pre K', code: 'K', readOnly: true },
        ]}
        rows={[{ run: '10/07/2026', k: '5.9' }]}
      />
    );
    expect(screen.getByText('Read only')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Save Flowsheet' })).not.toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'Dialysis runs' })).toHaveTextContent('5.9');
  });
});
