import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LabResultTable, type LabResultRow } from './LabResultTable';

const rows: LabResultRow[] = [
  { test: 'Potassium', loinc: '2823-3', value: '6.1', flag: 'HH', range: '3.5 to 5.1', units: 'mmol/L', trend: [4.6, 5.0, 5.4, 6.1], collected: '7:40 AM' },
  { test: 'Creatinine', value: '1.0', range: '0.7 to 1.3', units: 'mg/dL', collected: '7:40 AM' },
];

describe('LabResultTable', () => {
  it('renders a captioned table with column headers', () => {
    render(<LabResultTable title="Basic metabolic panel" rows={rows} />);
    const table = screen.getByRole('table', { name: 'Basic metabolic panel' });
    expect(within(table).getAllByRole('columnheader')).toHaveLength(7);
    expect(within(table).getAllByRole('row')).toHaveLength(3);
  });

  it('flags critical rows and marks normal ones', () => {
    render(<LabResultTable rows={rows} />);
    const [, crit, normal] = screen.getAllByRole('row');
    expect(crit).toHaveClass('is-crit');
    expect(within(crit!).getByText('HH Critical high')).toBeInTheDocument();
    expect(within(crit!).getByRole('img', { name: 'Potassium trend: 4.6, 5, 5.4, 6.1' })).toBeInTheDocument();
    expect(within(normal!).getByText('Normal')).toBeInTheDocument();
  });

  it('shows the critical alert', () => {
    render(<LabResultTable rows={rows} critical="Potassium 6.1 mmol/L." />);
    expect(screen.getByRole('alert')).toHaveTextContent('Critical value');
  });

  it('shows sign and route only with onSign', async () => {
    const onSign = vi.fn();
    const onRoute = vi.fn();
    const { rerender } = render(<LabResultTable rows={rows} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    rerender(<LabResultTable rows={rows} onSign={onSign} onRoute={onRoute} />);
    await userEvent.click(screen.getByRole('button', { name: 'Sign and Notify Patient' }));
    await userEvent.click(screen.getByRole('button', { name: 'Route to Nurse' }));
    expect(onSign).toHaveBeenCalledTimes(1);
    expect(onRoute).toHaveBeenCalledTimes(1);
  });
});
