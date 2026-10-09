import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DatePicker, formatUSDate, parseUSDate } from './DatePicker';

describe('date helpers', () => {
  it('parses only real dates', () => {
    expect(parseUSDate('02/29/2028')).not.toBeNull();
    expect(parseUSDate('02/30/1988')).toBeNull();
    expect(parseUSDate('1/2/2020')).toBeNull();
    expect(formatUSDate(new Date(2026, 9, 9))).toBe('10/09/2026');
  });
});

describe('DatePicker', () => {
  it('masks typed input and calls onChange', async () => {
    const onChange = vi.fn();
    render(<DatePicker label="Date of Birth" today="10/09/2026" onChange={onChange} />);
    const input = screen.getByRole('textbox', { name: 'Date of Birth' });
    await userEvent.type(input, '03141988');
    expect(input).toHaveValue('03/14/1988');
    expect(onChange).toHaveBeenLastCalledWith('03/14/1988');
    expect(input).toHaveAccessibleDescription('MM/DD/YYYY');
  });

  it('flags impossible dates', () => {
    render(<DatePicker label="DOB" defaultValue="02/30/1988" today="10/09/2026" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a real date as MM/DD/YYYY.');
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('opens the grid on the selected day and picks with the keyboard', async () => {
    const onChange = vi.fn();
    render(<DatePicker label="Date of Service" defaultValue="10/09/2026" today="10/09/2026" onChange={onChange} />);
    const btn = screen.getByRole('button', { name: 'Open calendar' });
    await userEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('dialog', { name: 'Choose date' })).toBeInTheDocument();
    expect(screen.getByRole('grid', { name: 'October 2026' })).toBeInTheDocument();
    const selected = screen.getByRole('gridcell', { name: 'Friday, October 9, 2026' });
    expect(selected).toHaveFocus();
    expect(selected).toHaveAttribute('aria-selected', 'true');
    expect(selected).toHaveAttribute('aria-current', 'date');
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('gridcell', { name: 'Saturday, October 10, 2026' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('gridcell', { name: 'Saturday, October 17, 2026' })).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(screen.getByRole('gridcell', { name: 'Sunday, October 11, 2026' })).toHaveFocus();
    await userEvent.keyboard('{PageDown}');
    expect(screen.getByRole('grid', { name: 'November 2026' })).toBeInTheDocument();
    expect(screen.getByRole('gridcell', { name: 'Wednesday, November 11, 2026' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(onChange).toHaveBeenLastCalledWith('11/11/2026');
    expect(screen.getByRole('textbox')).toHaveValue('11/11/2026');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(btn).toHaveFocus();
  });

  it('crosses months with arrows and closes on Escape', async () => {
    render(<DatePicker label="Date" defaultValue="10/01/2026" today="10/09/2026" />);
    await userEvent.click(screen.getByRole('button', { name: 'Open calendar' }));
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('grid', { name: 'September 2026' })).toBeInTheDocument();
    expect(screen.getByRole('gridcell', { name: 'Wednesday, September 30, 2026' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open calendar' })).toHaveFocus();
  });

  it('disables weekends, past and future days', async () => {
    const onChange = vi.fn();
    render(<DatePicker label="Date" today="10/09/2026" defaultOpen disableWeekends disablePast onChange={onChange} />);
    const sat = screen.getByRole('gridcell', { name: 'Saturday, October 10, 2026' });
    expect(sat).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('gridcell', { name: 'Thursday, October 8, 2026' })).toHaveAttribute(
      'aria-disabled',
      'true'
    );
    await userEvent.click(sat);
    expect(onChange).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('gridcell', { name: 'Monday, October 12, 2026' }));
    expect(onChange).toHaveBeenCalledWith('10/12/2026');
  });

  it('navigates months with the header buttons and picks Today', async () => {
    const onChange = vi.fn();
    render(<DatePicker label="Date" today="10/09/2026" defaultOpen onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByRole('grid', { name: 'November 2026' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Previous month' }));
    await userEvent.click(screen.getByRole('button', { name: 'Previous month' }));
    expect(screen.getByRole('grid', { name: 'September 2026' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Today' }));
    expect(onChange).toHaveBeenCalledWith('10/09/2026');
  });

  it('locks in read-only mode', () => {
    render(<DatePicker label="Coverage Start" defaultValue="01/01/2026" readOnly today="10/09/2026" />);
    expect(screen.getByRole('button', { name: 'Open calendar' })).toBeDisabled();
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('MM/DD/YYYY Your role can view but not edit');
  });

  it('closes on outside click', async () => {
    render(
      <div>
        <DatePicker label="Date" today="10/09/2026" defaultOpen />
        <p>outside</p>
      </div>
    );
    await userEvent.click(screen.getByText('outside'));
    await act(async () => {});
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
