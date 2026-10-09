import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BarChart } from '../BarChart/BarChart';
import { DonutChart } from '../DonutChart/DonutChart';
import { Sparkline } from '../Sparkline/Sparkline';
import { LineChart } from './LineChart';

describe('charts', () => {
  it('LineChart is a responsive svg image with a hidden data table', () => {
    const { container } = render(
      <LineChart title="A1c (%)" labels={['Jan', 'Apr']} series={[{ name: 'A1c', values: [7.9, 7.4] }]} band={[4, 7]} min={4} max={10} />
    );
    const img = screen.getByRole('img', { name: 'A1c (%). A1c: Jan 7.9, Apr 7.4' });
    expect(img).toHaveAttribute('viewBox', '0 0 520 180');
    expect(img).toHaveAttribute('width', '100%');
    expect(screen.getByRole('table', { name: 'A1c (%)' })).toHaveClass('co-sr');
    expect(screen.getByRole('cell', { name: '7.4' })).toBeInTheDocument();
    expect(container.querySelector('polyline')).toHaveAttribute('stroke', 'var(--co-primary)');
  });

  it('LineChart survives a flat scale', () => {
    const { container } = render(<LineChart labels={['a', 'b']} series={[{ name: 'x', values: [0, 0] }]} max={0} />);
    expect(container.querySelector('polyline')?.getAttribute('points')).not.toMatch(/NaN|Infinity/);
  });

  it('BarChart names its plot and lists tones in the table', () => {
    render(
      <BarChart
        title="Systolic BP"
        unit=" mmHg"
        threshold={140}
        data={[
          { label: 'Mon', value: 128, tone: 'ok' },
          { label: 'Tue', value: 151, tone: 'hi' },
        ]}
        legend={[
          { label: 'In range', tone: 'ok' },
          { label: 'High', tone: 'hi' },
        ]}
      />
    );
    expect(screen.getByRole('img', { name: 'Systolic BP: Mon 128 mmHg, Tue 151 mmHg' })).toHaveClass('co-bars');
    expect(screen.getByText('Goal 140')).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'High' })).toBeInTheDocument();
  });

  it('DonutChart shows the total and percentages', () => {
    render(
      <DonutChart
        title="Claims"
        data={[
          { label: 'Paid', value: 3 },
          { label: 'Denied', value: 1 },
        ]}
      />
    );
    expect(screen.getByRole('img', { name: 'Claims: Paid 3, Denied 1' })).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('Sparkline needs two values', () => {
    const { container, rerender } = render(<Sparkline values={[1]} />);
    expect(container.firstChild).toBeNull();
    rerender(<Sparkline values={[1, 2, 3]} />);
    expect(screen.getByRole('img', { name: 'Trend: 1, 2, 3' })).toHaveClass('co-spark');
  });
});
