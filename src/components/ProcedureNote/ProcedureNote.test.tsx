import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PROCEDURE_TEMPLATES, ProcedureNote } from './ProcedureNote';

describe('ProcedureNote', () => {
  it('blocks signing without consent and time out', () => {
    render(<ProcedureNote template="lumbar puncture" values={{ performer: 'Dr. Sam Patel' }} />);
    expect(screen.getByRole('button', { name: 'Sign Note' })).toBeDisabled();
    expect(screen.getByText('Consent and time out are required to sign.')).toBeInTheDocument();
    expect(screen.getByText('Time out not recorded')).toBeInTheDocument();
    PROCEDURE_TEMPLATES['lumbar puncture'].fields.forEach((f) => expect(screen.getByLabelText(f)).toBeInTheDocument());
  });

  it('signs with the edited template fields', async () => {
    const onSign = vi.fn();
    render(
      <ProcedureNote
        onSign={onSign}
        values={{ consent: 'Verbal', timeout: '15:02', ebl: 5, duration: 25, details: { Closure: '4 simple interrupted' } }}
      />
    );
    expect(screen.getByText('Completed 15:02')).toBeInTheDocument();
    expect(screen.getByText('25 min')).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('Dressing'), 'Bacitracin');
    await userEvent.click(screen.getByRole('button', { name: 'Sign Note' }));
    expect(onSign).toHaveBeenCalledWith({ Closure: '4 simple interrupted', Dressing: 'Bacitracin' });
  });

  it('is read-only when signed and flags a high EBL', () => {
    render(
      <ProcedureNote
        template="cesarean delivery"
        status="signed"
        values={{ consent: 'Written', timeout: '14:41', ebl: 1100, signedAt: '15:50', details: { Anesthesia: 'Spinal' } }}
        addendum={{ at: '16:05', text: 'Oxytocin infusion continued.' }}
      />
    );
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getByText('Signed 15:50')).toBeInTheDocument();
    expect(screen.getByText('Spinal')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Critical high' })).toBeInTheDocument();
    expect(screen.getByText('Addendum 16:05')).toBeInTheDocument();
  });
});
