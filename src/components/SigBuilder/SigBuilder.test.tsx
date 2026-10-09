import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SigBuilder, sigText } from './SigBuilder';

describe('SigBuilder', () => {
  it('builds the plain-language sig', () => {
    expect(
      sigText({ dose: '1 tablet', route: 'by mouth', freq: 'every 6 hours', prn: 'pain', duration: '5 days' })
    ).toBe('Take 1 tablet by mouth every 6 hours as needed for pain for 5 days');
  });

  it('seeds the fields from value and updates the preview as you edit', async () => {
    render(<SigBuilder value={{ dose: '1 tablet', route: 'by mouth', freq: 'twice daily', qty: 60, refills: 3 }} />);
    expect(screen.getByText('Take 1 tablet by mouth twice daily.')).toBeInTheDocument();
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Frequency' }), 'at bedtime');
    const dose = screen.getByRole('textbox', { name: /Dose/ });
    await userEvent.clear(dose);
    await userEvent.type(dose, '2 tablets');
    expect(screen.getByText('Take 2 tablets by mouth at bedtime.')).toBeInTheDocument();
  });

  it('is controlled with onChange', async () => {
    const onChange = vi.fn();
    render(<SigBuilder value={{ dose: '1 tablet', route: 'by mouth' }} onChange={onChange} />);
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Route' }), 'under the tongue');
    expect(onChange).toHaveBeenCalledWith({ dose: '1 tablet', route: 'under the tongue' });
    // Controlled: the parent did not update, so the preview keeps the old route.
    expect(screen.getByText('Take 1 tablet by mouth.')).toBeInTheDocument();
  });

  it('says no refills for C-II', () => {
    render(<SigBuilder value={{ schedule: 'C-II', refills: 0 }} />);
    expect(screen.getByText('C-II: no refills allowed.')).toBeInTheDocument();
  });
});
