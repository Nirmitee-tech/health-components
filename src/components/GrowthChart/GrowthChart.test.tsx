import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { GROWTH_CURVES, GrowthChart, growthBand } from './GrowthChart';

const who = GROWTH_CURVES['who-weight-male']!;
const cdc = GROWTH_CURVES['cdc-bmi-male']!;

describe('growthBand', () => {
  it('names the band between the drawn lines, interpolating between ages', () => {
    expect(growthBand(who, 0, 3.42)).toEqual({ text: 'Between the 50th and 85th percentile', high: false });
    expect(growthBand(who, 0, 2.4)).toEqual({ text: 'Below the 3rd percentile', low: true });
    expect(growthBand(who, 24, 15)).toEqual({ text: 'Above the 97th percentile', high: true });
    // At 1 month the 15th is halfway between 2.9 and 4.9 = 3.9 and the 50th 4.45.
    expect(growthBand(who, 1, 4.4).text).toBe('Between the 15th and 50th percentile');
    expect(growthBand(cdc, 12, 22)).toEqual({ text: 'Between the 85th and 95th percentile', high: true });
    expect(growthBand(cdc, 12, 24.8)).toEqual({ text: 'Above the 95th percentile', high: true });
  });
});

describe('GrowthChart', () => {
  it('plots WHO weight by default with the latest band and a table of points', () => {
    render(<GrowthChart points={[[0, 3.42, '10/02/2024'], [24, 12.36, '10/02/2026']]} />);
    expect(screen.getByRole('heading', { name: 'Weight-for-age, boys, WHO 0 to 24 months' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Patient points: 0 mo 3.42 kg, 24 mo 12.36 kg/ })).toBeInTheDocument();
    expect(screen.getByText('Latest', { exact: false })).toHaveTextContent('12.36 kg');
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(3);
    expect(rows[2]).toHaveTextContent('24 months');
  });

  it('switches standard (uncontrolled) and reports it', async () => {
    const onStandardChange = vi.fn();
    render(<GrowthChart measure="bmi" points={[[12, 24.8]]} onStandardChange={onStandardChange} />);
    await userEvent.click(screen.getByRole('radio', { name: 'CDC 2-20' }));
    expect(onStandardChange).toHaveBeenCalledWith('cdc');
    expect(screen.getByRole('heading', { name: 'BMI-for-age, boys, CDC 2 to 20 years' })).toBeInTheDocument();
    expect(screen.getAllByText('Above the 95th percentile').length).toBeGreaterThan(0);
  });

  it('follows a controlled standard', () => {
    render(<GrowthChart standard="cdc" measure="bmi" points={[]} />);
    expect(screen.getByRole('radio', { name: 'CDC 2-20' })).toHaveAttribute('aria-checked', 'true');
  });

  it('flags values against the shared range for the range context', () => {
    // BMI 26 is above the registry's outpatient sample range (18.5-24.9).
    render(<GrowthChart standard="cdc" measure="bmi" points={[[14, 26]]} rangeContext="outpatient" />);
    expect(within(screen.getAllByRole('row')[1]!).getByText('26.0 kg/m², High')).toBeInTheDocument();
  });

  it('keeps the earlier percentiles API', () => {
    render(
      <GrowthChart
        title="Length-for-age, boys (cm), WHO 0 to 24 months"
        unit="cm"
        ages={[0, 6, 12, 18, 24]}
        min={44}
        max={96}
        percentiles={{ '3': [46.3, 63.6, 71.3, 77.2, 82.1], '50': [49.9, 67.6, 75.7, 82.3, 87.8], '97': [53.4, 71.6, 80.2, 87.3, 93.6] }}
        points={[[0, 50.5], [6, 68.0]]}
        note="Tracking the 50th."
      />
    );
    expect(screen.getByRole('heading', { name: 'Length-for-age, boys (cm), WHO 0 to 24 months' })).toBeInTheDocument();
    expect(screen.queryByRole('radiogroup', { name: 'Chart standard' })).toBeNull();
    expect(screen.getByText('Latest', { exact: false })).toHaveTextContent('68.0 cm');
    expect(screen.getByText('Tracking the 50th.')).toBeInTheDocument();
  });
});
