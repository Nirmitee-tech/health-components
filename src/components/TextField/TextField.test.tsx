import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { formatMask, masks, TextField } from './TextField';

describe('formatMask', () => {
  it('arranges digits into each pattern', () => {
    expect(formatMask('3125550142', 'phone')).toBe('(312) 555-0142');
    expect(formatMask('123456789', 'ssn')).toBe('123-45-6789');
    expect(formatMask('60614', 'zip')).toBe('60614');
    expect(formatMask('606141234', 'zip')).toBe('60614-1234');
    expect(formatMask('361234567', 'ein')).toBe('36-1234567');
    expect(formatMask('10092026', 'date')).toBe('10/09/2026');
    expect(formatMask('abc', undefined)).toBe('abc');
    expect(masks.npi.pattern).toBe('##########');
  });
});

describe('TextField', () => {
  it('labels the input, formats the default value and shows the mask hint', () => {
    render(<TextField label="Mobile Phone" mask="phone" required defaultValue="3125550142" />);
    const input = screen.getByRole('textbox', { name: /Mobile Phone/ });
    expect(input).toHaveValue('(312) 555-0142');
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(input).toHaveAttribute('inputmode', 'tel');
    expect(input).toHaveAccessibleDescription('US phone, 10 digits');
  });

  it('masks typed input and calls onChange with the value', async () => {
    const onChange = vi.fn();
    render(<TextField label="EIN" mask="ein" onChange={onChange} />);
    const input = screen.getByRole('textbox', { name: 'EIN' });
    await userEvent.type(input, '361234567');
    expect(input).toHaveValue('36-1234567');
    expect(onChange).toHaveBeenLastCalledWith('36-1234567', expect.anything());
  });

  it('shows errors with role alert and aria-invalid', () => {
    render(<TextField label="NPI" mask="npi" error="NPI must be 10 digits." />);
    const input = screen.getByRole('textbox', { name: 'NPI' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveClass('is-bad');
    expect(screen.getByRole('alert')).toHaveTextContent('NPI must be 10 digits.');
    expect(input).toHaveAccessibleDescription('NPI must be 10 digits.');
  });

  it('renders the read-only lock state', () => {
    render(<TextField label="Member ID" defaultValue="W123" readOnly />);
    const input = screen.getByRole('textbox', { name: 'Member ID' });
    expect(input).toHaveAttribute('readonly');
    expect(input).toHaveClass('is-ro');
    expect(input).toHaveAccessibleDescription('Your role can view but not edit');
  });

  it('works controlled', async () => {
    function Controlled() {
      const [v, setV] = useState('');
      return <TextField label="Phone" mask="phone" value={v} onChange={setV} />;
    }
    render(<Controlled />);
    await userEvent.type(screen.getByRole('textbox'), '312555');
    expect(screen.getByRole('textbox')).toHaveValue('(312) 555');
  });

  it('forwards refs, className and native attributes', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(
      <TextField ref={ref} label="Units" className="x" name="units" suffix="units" size="sm" />
    );
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toHaveAttribute('name', 'units');
    expect(ref.current).toHaveClass('co-inp-sm');
    expect(container.firstChild).toHaveClass('co-field', 'x');
    expect(screen.getByText('units')).toHaveClass('co-inp-suf');
  });
});
