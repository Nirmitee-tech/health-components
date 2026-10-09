import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CensusList, type CensusRow } from './CensusList';

const rows: CensusRow[] = [
  {
    bed: '401A',
    name: 'Okafor, Grace',
    mrn: '1',
    age: 67,
    sex: 'F',
    dx: 'CHF',
    level: 'medsurg',
    los: 3,
    gmlos: 3.6,
    vitals: [{ measure: 'spo2', value: 93 }],
    isolation: 'contact',
    dischargeToday: true,
    edd: '14:00',
  },
  {
    bed: '402A',
    name: 'Nguyen, Bao',
    mrn: '2',
    age: 54,
    sex: 'M',
    dx: 'Cellulitis',
    level: 'medsurg',
    los: 6,
    gmlos: 3.9,
    vitals: [{ measure: 'temp', value: 38.6 }],
  },
  {
    bed: '403A',
    name: 'Kowalski, Anna',
    mrn: '3',
    age: 34,
    sex: 'F',
    dx: 'Rule out TB',
    level: 'obs',
    los: 0,
    vitals: [{ measure: 'spo2', value: 86 }],
  },
];

describe('CensusList', () => {
  it('filters the census and counts each filter', async () => {
    const onFilterChange = vi.fn();
    render(<CensusList rows={rows} onFilterChange={onFilterChange} />);
    expect(screen.getByRole('radio', { name: /Critical vitals/ })).toHaveTextContent('1');
    await userEvent.click(screen.getByRole('radio', { name: /Critical vitals/ }));
    expect(onFilterChange).toHaveBeenCalledWith('flag');
    expect(screen.getByText('Kowalski, Anna')).toBeInTheDocument();
    expect(screen.queryByText('Okafor, Grace')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('radio', { name: /Discharge today/ }));
    expect(screen.getByText('Okafor, Grace')).toBeInTheDocument();
    expect(screen.getByText('Today 14:00')).toBeInTheDocument();
  });

  it('flags vitals with the inpatient ranges and a long stay against GMLOS', () => {
    render(<CensusList rows={rows} />);
    expect(screen.getByText('SpO2 86 %, Critical low, Reference 92–100 %')).toBeInTheDocument();
    expect(screen.getByText('SpO2 93 %, Reference 92–100 %')).toBeInTheDocument();
    expect(screen.getByText('Temp 38.6 °C, High, Reference 36.1–37.9 °C')).toBeInTheDocument();
    expect(screen.getByText('Length of stay 6 d, High')).toBeInTheDocument();
  });

  it('shows an empty state when nothing matches and a skeleton while loading', () => {
    const { rerender } = render(<CensusList rows={rows.slice(1, 2)} defaultFilter="iso" />);
    expect(screen.getByText('No patients match')).toBeInTheDocument();
    rerender(<CensusList rows={[]} loading />);
    expect(screen.getByLabelText('Loading census')).toBeInTheDocument();
  });
});
