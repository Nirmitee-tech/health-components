import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TimeSlotPicker, type TimeSlot, type TimeSlotDay } from './TimeSlotPicker';
import { SlotPicker } from './index';

const slots: TimeSlot[] = [
  { time: '8:00 AM', state: 'available' },
  { time: '8:20 AM', state: 'booked' },
  { time: '8:40 AM', state: 'held' },
  { time: '9:00 AM' },
];
const days: TimeSlotDay[] = [
  { id: 'th', weekday: 'Thu', date: 'Oct 9' },
  { id: 'fr', weekday: 'Fri', date: 'Oct 10', disabled: true },
  { id: 'mo', weekday: 'Mon', date: 'Oct 13' },
];

describe('TimeSlotPicker', () => {
  it('renders slots as a labelled radiogroup with state in each name', () => {
    render(<TimeSlotPicker slots={slots} label="Priya Shah MD . Follow-Up" />);
    const group = screen.getByRole('radiogroup', { name: 'Priya Shah MD . Follow-Up' });
    expect(group).toHaveClass('co-slotg');
    expect(screen.getByRole('radio', { name: '8:20 AM, booked' })).toBeDisabled();
    expect(screen.getByRole('radio', { name: '8:40 AM, held' })).toHaveClass('is-held');
    expect(screen.getByRole('radio', { name: '9:00 AM, available' })).toBeEnabled();
  });

  it('defaults the group name to Available times', () => {
    render(<TimeSlotPicker slots={slots} />);
    expect(screen.getByRole('radiogroup', { name: 'Available times' })).toBeInTheDocument();
  });

  it('selects on click and calls onChange (uncontrolled)', async () => {
    const onChange = vi.fn();
    render(<TimeSlotPicker slots={slots} onChange={onChange} />);
    const s = screen.getByRole('radio', { name: '9:00 AM, available' });
    await userEvent.click(s);
    expect(s).toHaveAttribute('aria-checked', 'true');
    expect(s).toHaveClass('is-on');
    expect(onChange).toHaveBeenCalledWith('9:00 AM');
  });

  it('respects a controlled value', async () => {
    const onChange = vi.fn();
    render(<TimeSlotPicker slots={slots} value="8:00 AM" onChange={onChange} />);
    await userEvent.click(screen.getByRole('radio', { name: '9:00 AM, available' }));
    expect(onChange).toHaveBeenCalledWith('9:00 AM');
    expect(screen.getByRole('radio', { name: '8:00 AM, available' })).toHaveAttribute('aria-checked', 'true');
  });

  it('uses a roving tab stop and arrow keys skip disabled slots', async () => {
    const onChange = vi.fn();
    render(<TimeSlotPicker slots={slots} defaultValue="8:00 AM" onChange={onChange} />);
    const first = screen.getByRole('radio', { name: '8:00 AM, available' });
    expect(first).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('radio', { name: '9:00 AM, available' })).toHaveAttribute('tabindex', '-1');
    await userEvent.tab();
    expect(first).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    const held = screen.getByRole('radio', { name: '8:40 AM, held' });
    expect(held).toHaveFocus();
    expect(held).toHaveAttribute('aria-checked', 'true');
    expect(onChange).toHaveBeenLastCalledWith('8:40 AM');
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('radio', { name: '9:00 AM, available' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(first).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('radio', { name: '9:00 AM, available' })).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(first).toHaveFocus();
  });

  it('renders the day strip, defaults to the first day and skips full days', async () => {
    const onDayChange = vi.fn();
    render(<TimeSlotPicker slots={slots} days={days} onDayChange={onDayChange} />);
    const strip = screen.getByRole('radiogroup', { name: 'Day' });
    expect(strip).toBeInTheDocument();
    const thu = screen.getByRole('radio', { name: /Thu/ });
    expect(thu).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: /Fri.*Full/ })).toBeDisabled();
    thu.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: /Mon/ })).toHaveFocus();
    expect(onDayChange).toHaveBeenCalledWith('mo');
  });

  it('is also exported as SlotPicker', () => {
    expect(SlotPicker).toBe(TimeSlotPicker);
  });
});
