import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { dangerZone, esiLevel, TriageForm } from './TriageForm';

describe('esiLevel', () => {
  it('follows ESI v4 decision points A to D', () => {
    expect(esiLevel({ lifeSaving: true, resources: 0 }).level).toBe(1);
    expect(esiLevel({ highRisk: true }).level).toBe(2);
    expect(esiLevel({ confused: true }).level).toBe(2);
    expect(esiLevel({ severePain: true }).level).toBe(2);
    expect(esiLevel({ resources: 0 }).level).toBe(5);
    expect(esiLevel({ resources: 1 }).level).toBe(4);
    expect(esiLevel({ resources: 2, vitals: { hr: 90, rr: 16, spo2: 98 } }).level).toBe(3);
    const d = esiLevel({ resources: 2, vitals: { hr: 112, rr: 22, spo2: 95 } });
    expect(d.level).toBe(2);
    expect(d.reason).toContain('HR above 100, RR above 20');
  });

  it('lists adult danger-zone vitals', () => {
    expect(dangerZone({ hr: 101, rr: 21, spo2: 91 })).toEqual(['HR above 100', 'RR above 20', 'SpO2 below 92%']);
    expect(dangerZone({ hr: 100, rr: 20, spo2: 92 })).toEqual([]);
    expect(dangerZone(undefined)).toEqual([]);
  });
});

describe('TriageForm', () => {
  it('shows no suggestion until A, B or C is answered', () => {
    render(<TriageForm />);
    expect(screen.getByRole('status')).toHaveTextContent('Answer A, B and C');
    expect(screen.getByRole('button', { name: 'Complete Triage' })).toBeDisabled();
  });

  it('suggests ESI 2 from danger-zone vitals and submits numbers', async () => {
    const onSubmit = vi.fn();
    render(
      <TriageForm
        onSubmit={onSubmit}
        defaultValues={{ complaint: 'Chest pressure', arrival: 'EMS ground', hr: 112, rr: 22, spo2: 95, resources: '2+' }}
      />
    );
    expect(screen.getByRole('status')).toHaveTextContent('ESI 2 Emergent');
    expect(screen.getByRole('status')).toHaveTextContent('decision point D');
    await userEvent.click(screen.getByRole('button', { name: 'Complete Triage' }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ esi: 2, complaint: 'Chest pressure', hr: 112, rr: 22, spo2: 95, sbp: null, resources: '2+' })
    );
  });

  it('recomputes as answers change and keeps the suggestion under an override', async () => {
    const onSubmit = vi.fn();
    render(<TriageForm onSubmit={onSubmit} defaultValues={{ complaint: 'Cut on forearm' }} />);
    await userEvent.selectOptions(screen.getByLabelText('C. Resources expected'), '1');
    expect(screen.getByRole('status')).toHaveTextContent('ESI 4');
    await userEvent.click(screen.getByLabelText('B. Severe pain or distress (7/10 or more)'));
    expect(screen.getByRole('status')).toHaveTextContent('ESI 2');
    await userEvent.selectOptions(screen.getByLabelText('Nurse override'), '3');
    expect(screen.getByRole('status')).toHaveTextContent('ESI 3');
    expect(screen.getByRole('status')).toHaveTextContent('Nurse override from suggested ESI 2');
    await userEvent.click(screen.getByRole('button', { name: 'Complete Triage' }));
    expect(onSubmit.mock.calls[0]![0]).toMatchObject({ esi: 3, override: '3', suggestion: { level: 2 }, severePain: true });
  });

  it('flags a typed vital against the shared range', async () => {
    render(<TriageForm />);
    await userEvent.type(screen.getByLabelText('Heart rate'), '160');
    expect(screen.getByRole('img', { name: 'Critical high' })).toBeInTheDocument();
  });

  it('requires a complaint when showErrors is set', () => {
    render(<TriageForm showErrors />);
    expect(screen.getByLabelText(/Chief complaint/)).toHaveAttribute('aria-invalid', 'true');
  });

  it('locks every field when readOnly', () => {
    render(<TriageForm readOnly defaultValues={{ complaint: 'Refill', resources: 0 }} />);
    expect(screen.queryByRole('button', { name: 'Complete Triage' })).not.toBeInTheDocument();
    expect(screen.getByLabelText(/A\. Needs an immediate life-saving intervention/)).toBeDisabled();
    expect(screen.getByText('Signed')).toBeInTheDocument();
  });
});
