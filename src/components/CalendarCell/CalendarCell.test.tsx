import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { AppointmentChipProps } from '../AppointmentChip/AppointmentChip';
import { CalendarCell } from './CalendarCell';

const appts: AppointmentChipProps[] = ['8:00', '8:40', '9:20', '10:00'].map((time, i) => ({
  time,
  patient: `Patient ${i + 1}`,
  type: 'Follow-Up',
  status: 'Confirmed',
}));

describe('CalendarCell', () => {
  it('renders a month gridcell with small chips, count and overflow', async () => {
    const onMore = vi.fn();
    render(<CalendarCell date={9} today count={14} appointments={appts} label="Thursday October 9" onMore={onMore} />);
    const cell = screen.getByRole('gridcell', { name: 'Thursday October 9' });
    expect(cell).toHaveClass('co-cal-c', 'co-cal-month', 'is-today');
    expect(screen.getByText('14 appts')).toBeInTheDocument();
    const chips = screen.getAllByRole('button', { name: /Patient/ });
    expect(chips).toHaveLength(3);
    expect(chips[0]).toHaveClass('co-ap-sm');
    await userEvent.click(screen.getByRole('button', { name: '+1 more' }));
    expect(onMore).toHaveBeenCalledTimes(1);
  });

  it('shows up to six chips in week view', () => {
    render(<CalendarCell view="week" date="Thu 9" appointments={appts} />);
    expect(screen.getAllByRole('button', { name: /Patient/ })).toHaveLength(4);
    expect(screen.queryByRole('button', { name: /more/ })).toBeNull();
  });

  it('renders a day row with a free slot that books', async () => {
    const onBook = vi.fn();
    render(<CalendarCell view="day" time="9:40 AM" onBook={onBook} />);
    expect(screen.getByRole('row')).toHaveClass('co-cal-day');
    expect(screen.getByRole('rowheader')).toHaveTextContent('9:40 AM');
    await userEvent.click(screen.getByRole('button', { name: '+ Book 9:40 AM' }));
    expect(onBook).toHaveBeenCalledWith('9:40 AM');
  });

  it('shows blocked time instead of the free slot', () => {
    render(<CalendarCell view="day" time="12:00 PM" blocked="Lunch" />);
    expect(screen.getByText('Lunch')).toHaveClass('co-blk');
    expect(screen.getByRole('gridcell')).toHaveClass('is-blk');
    expect(screen.queryByRole('button')).toBeNull();
  });
});
