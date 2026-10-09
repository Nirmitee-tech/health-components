import { render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { RangeContextProvider, setRangeContext } from '../../clinical';
import { PrenatalFlowsheet, prenatalSevereBP, type PrenatalVisit } from './PrenatalFlowsheet';

const base: PrenatalVisit[] = [
  { date: '06/02/2026', ga: [8, 1], wt: 68.2, sbp: 112, dbp: 70, protein: 'neg', glucose: 'neg', fh: null, fhr: null },
  { date: '09/15/2026', ga: [23, 1], wt: 71.0, sbp: 124, dbp: 78, protein: 'trace', glucose: '1+', fh: 23, fhr: 146 },
];
const visit = (v: Partial<PrenatalVisit>): PrenatalVisit => ({ date: '10/09/2026', ga: [26, 4], ...v });
const lastRow = () => {
  const rows = screen.getAllByRole('row');
  return rows[rows.length - 1]!;
};

afterEach(() => setRangeContext(null));

describe('PrenatalFlowsheet', () => {
  it('detects severe-range BP', () => {
    expect(prenatalSevereBP({ sbp: 160, dbp: 90 })).toBe(true);
    expect(prenatalSevereBP({ sbp: 150, dbp: 110 })).toBe(true);
    expect(prenatalSevereBP({ sbp: 159, dbp: 109 })).toBe(false);
    expect(prenatalSevereBP(undefined)).toBe(false);
  });

  it('shows GA in words, urine results and the not-yet states', () => {
    render(<PrenatalFlowsheet visits={base} />);
    expect(screen.getByText('8 weeks 1 days')).toBeInTheDocument();
    expect(screen.getByText('8w 1d')).toBeInTheDocument();
    expect(screen.getByText('Not yet')).toBeInTheDocument();
    expect(screen.getByText('Doppler not yet')).toBeInTheDocument();
    expect(screen.getByText('Trace')).toBeInTheDocument();
    expect(screen.getAllByText('Negative').length).toBe(2);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('warns at 140/90 after 20 weeks and flags size greater than dates', () => {
    render(<PrenatalFlowsheet visits={[...base, visit({ sbp: 144, dbp: 92, fh: 29, fhr: 142, protein: '1+' })]} />);
    expect(screen.getByText('Blood pressure 140/90 or higher after 20 weeks')).toBeInTheDocument();
    expect(within(lastRow()).getByText('Size ≠ dates')).toBeInTheDocument();
    expect(within(lastRow()).getByText('144, High')).toBeInTheDocument();
    expect(lastRow()).not.toHaveClass('is-crit');
  });

  it('turns a severe-range row critical in the pregnancy context (the default)', () => {
    render(<PrenatalFlowsheet visits={[...base, visit({ ga: [34, 2], sbp: 164, dbp: 112, fh: 31, fhr: 96, protein: '3+' })]} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Severe-range blood pressure 164/112 mmHg');
    expect(lastRow()).toHaveClass('is-crit');
    expect(within(lastRow()).getByText('164, Critical high')).toBeInTheDocument();
    expect(within(lastRow()).getByText('96 bpm, Critical low')).toBeInTheDocument();
    expect(within(lastRow()).getByText('3+')).toBeInTheDocument();
  });

  it('uses the rangeContext prop, a provider or the global context instead of pregnancy', () => {
    const v = [visit({ sbp: 164, dbp: 100, fhr: 140 })];
    const { unmount } = render(<PrenatalFlowsheet visits={v} rangeContext="outpatient" />);
    // Outpatient sample range: SBP critical above 180, so 164 is only High.
    expect(lastRow()).not.toHaveClass('is-crit');
    expect(within(lastRow()).getByText('164, High')).toBeInTheDocument();
    unmount();
    const p = render(
      <RangeContextProvider value="outpatient">
        <PrenatalFlowsheet visits={v} />
      </RangeContextProvider>
    );
    expect(within(lastRow()).getByText('164, High')).toBeInTheDocument();
    p.unmount();
    setRangeContext('outpatient');
    render(<PrenatalFlowsheet visits={v} />);
    expect(lastRow()).not.toHaveClass('is-crit');
  });
});
