import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EyeExam, snellenDenominator } from './EyeExam';

describe('EyeExam', () => {
  it('reads Snellen denominators', () => {
    expect(snellenDenominator('20/40')).toBe(40);
    expect(snellenDenominator('20/200-2')).toBe(200);
    expect(snellenDenominator('J1')).toBeNull();
    expect(snellenDenominator(undefined)).toBeNull();
  });

  it('shows no alert for normal symmetric pressures', () => {
    render(<EyeExam exam={{ od: { vaCc: '20/20', iop: 16 }, os: { vaCc: '20/25', iop: 17 } }} />);
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.queryByText(/IOP differs/)).toBeNull();
    expect(screen.getAllByText('Goldmann')).toHaveLength(2);
  });

  it('raises the high and asymmetric IOP alerts and flags reduced acuity', () => {
    render(<EyeExam exam={{ od: { vaCc: '20/50', iop: 24 }, os: { vaCc: '20/200', iop: 31 } }} />);
    expect(screen.getByRole('alert')).toHaveTextContent('IOP at or above 30 mmHg');
    expect(screen.getByText('IOP differs by 4 mmHg or more between eyes')).toBeInTheDocument();
    expect(screen.getByText('20/50 Snellen, reduced')).toBeInTheDocument();
    expect(screen.getByText('20/200 Snellen, legally blind range')).toBeInTheDocument();
    expect(screen.getByText('24 mmHg, High')).toBeInTheDocument();
    expect(screen.getByText('31 mmHg, Critical high')).toBeInTheDocument();
  });

  it('does not alert at 29 mmHg (critical is strictly above 29)', () => {
    render(<EyeExam exam={{ od: { iop: 29 }, os: { iop: 27 } }} />);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('says what was not tested', () => {
    render(<EyeExam exam={{ od: { vaSc: '20/30' }, os: { vaSc: '20/40', iop: null } }} />);
    expect(screen.getAllByText('Not tested').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Not recorded')).toHaveLength(2);
  });

  it('prints signed lens powers and DS for no cylinder', () => {
    render(
      <EyeExam
        exam={{}}
        refractions={[{ type: 'Manifest', od: { sph: -2.25, cyl: -0.5, axis: 180, add: 2 }, os: { sph: 0, cyl: 0 } }]}
      />
    );
    const table = screen.getByRole('table', { name: 'Refraction' });
    expect(within(table).getByText('−2.25 D')).toBeInTheDocument();
    expect(within(table).getByText('−0.50 D')).toBeInTheDocument();
    expect(within(table).getByText('+2.00 D')).toBeInTheDocument();
    expect(within(table).getByText('±0.00 D')).toBeInTheDocument();
    expect(within(table).getByText('DS')).toBeInTheDocument();
    expect(within(table).getByText('180 °')).toBeInTheDocument();
  });
});
