import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { InpatientOrderEntry, orderSentence, type InpatientOrder } from './InpatientOrderEntry';

const oxy: InpatientOrder = {
  name: 'Oxycodone',
  dose: 2.5,
  unit: 'mg',
  route: 'PO',
  freq: 'q4h',
  prn: true,
  maxDaily: 15,
  duration: '3 days',
};

describe('InpatientOrderEntry', () => {
  it('builds the order sentence as the prescriber edits', async () => {
    render(<InpatientOrderEntry order={oxy} patient="Ruiz, Carmen" />);
    const sentence = screen.getByText(/^Oxycodone 2.5 mg PO/);
    expect(sentence).toHaveTextContent('Oxycodone 2.5 mg PO q4h PRN (reason needed) for 3 days');
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /PRN reason/ }), 'Pain, moderate (4 to 6)');
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /Frequency/ }), 'q6h');
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /Duration/ }), 'Until discontinued');
    expect(sentence).toHaveTextContent('Oxycodone 2.5 mg PO q6h PRN Pain, moderate (4 to 6) until discontinued');
    await userEvent.click(screen.getByRole('switch', { name: 'As needed (PRN)' }));
    expect(screen.queryByRole('combobox', { name: /PRN reason/ })).not.toBeInTheDocument();
    expect(sentence).toHaveTextContent('Oxycodone 2.5 mg PO q6h until discontinued');
  });

  it('needs a PRN reason before it can be signed', async () => {
    const onSign = vi.fn();
    render(<InpatientOrderEntry order={oxy} showErrors onSign={onSign} />);
    const sign = screen.getByRole('button', { name: 'Sign Order' });
    expect(sign).toBeDisabled();
    expect(screen.getByText('A PRN order needs a reason')).toBeInTheDocument();
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /PRN reason/ }), 'Pain, severe (7 to 10)');
    expect(sign).toBeEnabled();
    await userEvent.click(sign);
    expect(onSign).toHaveBeenCalledWith(
      {
        freq: 'q4h',
        prn: true,
        prnReason: 'Pain, severe (7 to 10)',
        priority: 'routine',
        duration: '3 days',
      },
      'Oxycodone 2.5 mg PO q4h PRN Pain, severe (7 to 10) for 3 days'
    );
  });

  it('STAT priority warns and relabels the sign button', async () => {
    render(<InpatientOrderEntry order={{ ...oxy, prn: false }} />);
    await userEvent.click(screen.getByRole('radio', { name: 'STAT' }));
    expect(
      screen.getByText('Pharmacy and the nurse are paged. Expect the first dose within 30 minutes.')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign STAT Order' })).toBeEnabled();
    expect(screen.getByText(/for 3 days STAT$/)).toBeInTheDocument();
  });

  it('shows the maximum daily dose without trailing zeros', () => {
    render(<InpatientOrderEntry order={{ ...oxy, maxDaily: 15.0 }} />);
    expect(screen.getByText('Maximum in 24 hours')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('gives the pharmacist Verify and Return when pending', async () => {
    const onVerify = vi.fn();
    const onReturn = vi.fn();
    render(
      <InpatientOrderEntry order={oxy} status="pending" role="pharmacist" onVerify={onVerify} onReturn={onReturn} />
    );
    expect(screen.getByText('Pending pharmacist verification')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Verify' }));
    await userEvent.click(screen.getByRole('button', { name: 'Return to Prescriber' }));
    expect(onVerify).toHaveBeenCalledTimes(1);
    expect(onReturn).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('button', { name: 'Sign Order' })).not.toBeInTheDocument();
  });

  it('shows the pharmacist note when returned and the verifier when verified', () => {
    const { rerender } = render(
      <InpatientOrderEntry
        order={oxy}
        status="rejected"
        pharmacist="S. Ahmed, PharmD"
        pharmacistNote="Duplicate therapy."
      />
    );
    expect(screen.getByText('Returned by S. Ahmed, PharmD')).toBeInTheDocument();
    rerender(
      <InpatientOrderEntry order={oxy} status="verified" verifiedBy="S. Ahmed, PharmD" verifiedAt="10/09 09:14" />
    );
    expect(screen.getByText('Verified by S. Ahmed, PharmD at 10/09 09:14')).toBeInTheDocument();
  });

  it('orderSentence normalizes dose and units', () => {
    expect(
      orderSentence(
        { name: 'Insulin glargine', dose: 20.0, unit: 'U', route: 'SubQ' },
        {
          freq: 'At bedtime',
          prn: false,
          prnReason: '',
          priority: 'now',
          duration: 'Once',
        }
      )
    ).toBe('Insulin glargine 20 units SubQ At bedtime NOW');
  });
});
