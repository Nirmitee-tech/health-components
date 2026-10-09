import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ChartCard } from './ChartCard';

describe('ChartCard', () => {
  it('renders title, chart and source', () => {
    render(
      <ChartCard title="Denials by payer" source="Source: ERA 835">
        <div>chart</div>
      </ChartCard>
    );
    expect(screen.getByRole('heading', { name: 'Denials by payer' })).toBeInTheDocument();
    expect(screen.getByText('chart')).toBeInTheDocument();
    expect(screen.getByText('Source: ERA 835')).toBeInTheDocument();
  });

  it('switches period and reports it', async () => {
    const onPeriod = vi.fn();
    render(<ChartCard title="Denials" periods={['7d', '30d', '90d']} onPeriod={onPeriod} />);
    expect(screen.getByRole('radio', { name: '7d' })).toBeChecked();
    await userEvent.click(screen.getByRole('radio', { name: '90d' }));
    expect(onPeriod).toHaveBeenCalledWith('90d');
    expect(screen.getByRole('radio', { name: '90d' })).toBeChecked();
  });

  it('shows loading and empty states instead of the chart', () => {
    const { rerender } = render(
      <ChartCard title="Payer mix" loading>
        <div>chart</div>
      </ChartCard>
    );
    expect(screen.queryByText('chart')).not.toBeInTheDocument();
    expect(screen.getByRole('status', { name: 'Loading Payer mix' })).toBeInTheDocument();
    rerender(
      <ChartCard title="Payer mix" empty="No visits in this period.">
        <div>chart</div>
      </ChartCard>
    );
    expect(screen.getByText('No visits in this period.')).toBeInTheDocument();
    expect(screen.queryByText('chart')).not.toBeInTheDocument();
  });
});
