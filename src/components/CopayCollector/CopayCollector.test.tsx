import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CopayCollector } from './CopayCollector';
import { PatientBalance } from './index';

describe('CopayCollector', () => {
  it('shows copay, prior and total and collects the amount with the method', async () => {
    const onCollect = vi.fn();
    render(<CopayCollector patient="Henna West" copay={25} prior={40} cardLast4="Visa 4242" onCollect={onCollect} />);
    expect(screen.getByText('$65.00')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Card on file (Visa 4242)' })).toBeChecked();
    await userEvent.click(screen.getByRole('radio', { name: 'Cash or check' }));
    const amount = screen.getByRole('textbox', { name: /Amount/ });
    await userEvent.clear(amount);
    await userEvent.type(amount, '65');
    const collect = screen.getByRole('button', { name: 'Collect $65.00' });
    await userEvent.click(collect);
    expect(onCollect).toHaveBeenCalledWith({ amount: 65, method: 'cash' });
  });

  it('starts the amount at due and shows the plan', () => {
    render(<CopayCollector patient="Jacob Jones" copay={30} due={215.5} plan="3 months" />);
    expect(screen.getByRole('textbox', { name: /Amount/ })).toHaveValue('215.5');
    expect(screen.getByText('Payment plan: 3 months')).toBeInTheDocument();
  });

  it('calls onSkip and is exported as PatientBalance', async () => {
    const onSkip = vi.fn();
    render(<PatientBalance patient="Henna West" copay={25} onSkip={onSkip} />);
    await userEvent.click(screen.getByRole('button', { name: 'Skip, Reason Required' }));
    expect(onSkip).toHaveBeenCalled();
  });
});
