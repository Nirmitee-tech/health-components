import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EPCSApproval } from './EPCSApproval';

const base = {
  drug: 'Oxycodone 5 mg tablet',
  schedule: 'C-II',
  sig: '1 tablet every 6 hours as needed, 5 days',
  qty: 20,
  prescriber: 'Ana Ortiz MD',
  dea: 'BO1234563',
};

describe('EPCSApproval', () => {
  it('summarises the prescription', () => {
    render(<EPCSApproval {...base} />);
    expect(screen.getByText('20 (no refills for C-II)')).toBeInTheDocument();
    expect(screen.getByText('Ana Ortiz MD . DEA BO1234563')).toBeInTheDocument();
    expect(screen.getByText('Checked today 10:02 AM, no concerns')).toBeInTheDocument();
  });

  it('only notes no refills for C-II', () => {
    render(<EPCSApproval {...base} schedule="C-IV" qty={15} />);
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('signs once both factors are complete', async () => {
    const onSign = vi.fn();
    render(<EPCSApproval {...base} onSign={onSign} />);
    const sign = screen.getByRole('button', { name: 'Sign and Send' });
    expect(sign).toBeDisabled();
    for (const d of '482913') await userEvent.click(screen.getByRole('button', { name: d }));
    expect(screen.getByRole('status', { name: '6 of 6 digits entered' })).toBeInTheDocument();
    await userEvent.type(screen.getByRole('textbox', { name: /One-time code/ }), '12a3456');
    expect(screen.getByRole('textbox', { name: /One-time code/ })).toHaveValue('123456');
    expect(sign).toBeEnabled();
    await userEvent.click(sign);
    expect(onSign).toHaveBeenCalledWith({ pin: '482913', code: '123456' });
  });

  it('shows the done and locked states', () => {
    const { rerender } = render(<EPCSApproval {...base} state="done" pharmacy="CVS #4412" audit="004518" />);
    expect(screen.getByText('Signed and sent to CVS #4412')).toBeInTheDocument();
    expect(screen.getByText('Audit record EPCS-004518 written.')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    rerender(<EPCSApproval {...base} state="locked" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Signing locked');
  });
});
