import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ProviderDayColumns } from './ProviderDayColumns';

describe('ProviderDayColumns', () => {
  it('renders a column per provider with chips, blocks and free slots', async () => {
    const onBook = vi.fn();
    render(
      <ProviderDayColumns
        times={['8:00 AM', '8:20 AM', '8:40 AM']}
        providers={[
          { name: 'James Bell MD', appts: { '8:00 AM': { time: '8:00', patient: 'Henna West', type: 'Follow-Up' } }, blocks: { '8:40 AM': 'Lunch' } },
          { name: 'Tom Reyes DPT' },
        ]}
        onBook={onBook}
      />
    );
    expect(screen.getByRole('region', { name: 'Schedule by provider' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'James Bell MD' })).toBeInTheDocument();
    expect(screen.getByText('Lunch').closest('.co-blk')).not.toBeNull();
    expect(screen.getByRole('button', { name: /Henna West/ })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^\+ Book/ })).toHaveLength(4);
    await userEvent.click(screen.getByRole('button', { name: '+ Book 8:20 AM with Tom Reyes DPT' }));
    expect(onBook).toHaveBeenCalledWith('Tom Reyes DPT', '8:20 AM');
  });
});
