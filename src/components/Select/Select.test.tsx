import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Select } from './Select';

describe('Select', () => {
  it('renders string and object options with a placeholder', () => {
    render(<Select label="Place of Service" placeholder="Choose one" options={['11 Office', { value: '02', label: '02 Telehealth' }]} />);
    const sel = screen.getByRole('combobox', { name: 'Place of Service' });
    expect(sel).toHaveClass('co-inp', 'co-sel');
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['Choose one', '11 Office', '02 Telehealth']);
  });

  it('changes value natively', async () => {
    const onChange = vi.fn();
    render(<Select label="Provider" options={['All', 'James Bell MD']} onChange={onChange} />);
    await userEvent.selectOptions(screen.getByRole('combobox'), 'James Bell MD');
    expect(onChange).toHaveBeenCalled();
    expect(screen.getByRole('combobox')).toHaveValue('James Bell MD');
  });

  it('shows error and the read-only lock', () => {
    const { rerender } = render(<Select label="POS" options={['11']} error="Choose a place of service." />);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toBeInTheDocument();
    rerender(<Select label="POS" options={['11']} readOnly />);
    expect(screen.getByRole('combobox')).toBeDisabled();
    expect(screen.getByRole('combobox')).toHaveAccessibleDescription('Your role can view but not edit');
  });

  it('forwards refs', () => {
    const ref = createRef<HTMLSelectElement>();
    render(<Select ref={ref} label="Status" options={['Active']} name="status" />);
    expect(ref.current).toHaveAttribute('name', 'status');
  });
});
