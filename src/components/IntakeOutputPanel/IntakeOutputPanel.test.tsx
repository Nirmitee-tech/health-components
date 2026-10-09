import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { IntakeOutputPanel, intakeOutputTotals, type IntakeOutputEntry } from './IntakeOutputPanel';

const entries: IntakeOutputEntry[] = [
  { time: '07:30', kind: 'in', category: 'PO', amount: 240 },
  { time: '08:00', kind: 'in', category: 'IV', amount: 125 },
  { time: '09:15', kind: 'out', category: 'Urine', amount: 180 },
  { time: '11:40', kind: 'out', category: 'Emesis', amount: 150 },
  { time: '12:00', kind: 'out', category: 'Urine', amount: 90 },
];

describe('IntakeOutputPanel', () => {
  it('computes totals, net and running balance', () => {
    const t = intakeOutputTotals(entries);
    expect(t).toEqual({ intake: 365, output: 420, net: -55, urine: 270, running: [240, 365, 185, 35, -55] });
  });

  it('shows totals, signed net balance and the running balance column', () => {
    render(<IntakeOutputPanel entries={entries} />);
    expect(screen.getByText('Intake', { selector: '.l' }).nextElementSibling).toHaveTextContent('365mL');
    expect(screen.getByText('Output', { selector: '.l' }).nextElementSibling).toHaveTextContent('420mL');
    expect(screen.getByText('Net balance', { selector: '.l' }).nextElementSibling).toHaveTextContent('−55mL');
    const rows = screen.getAllByRole('row').slice(1);
    expect(rows[0]).toHaveTextContent('+240');
    expect(rows[4]).toHaveTextContent('−55');
    expect(within(rows[4]!).getByText('−55', { selector: '.co-cv-v' }).closest('.nu-bal')).toHaveClass('neg');
  });

  it('computes urine output in mL/kg/h against the target', () => {
    render(<IntakeOutputPanel entries={entries} weightKg={82} hours={5} />);
    // 270 mL / 82 kg / 5 h = 0.66 mL/kg/h, at or above 0.5
    const alert = screen.getByText(/At or above the target/).closest('.co-alert')!;
    expect(alert).toHaveClass('co-alert-info');
    expect(alert).toHaveTextContent('Urine output 0.66mL/kg/h');
    expect(alert).toHaveTextContent('over 5 h');
    expect(alert).toHaveTextContent('Uses weight 82.0kg');
  });

  it('flags urine output below a custom target', () => {
    render(<IntakeOutputPanel entries={entries} weightKg={82} hours={5} uoTarget={1} />);
    expect(screen.getByText(/Below the target/).closest('.co-alert')).toHaveClass('co-alert-warning');
  });

  it('adds an entry and updates the totals', async () => {
    const onAdd = vi.fn();
    render(<IntakeOutputPanel entries={entries} now="13:00" onAdd={onAdd} />);
    await userEvent.click(screen.getByRole('button', { name: 'Add entry' }));
    await userEvent.selectOptions(screen.getByLabelText('Type'), 'out');
    expect(screen.getByLabelText('Source')).toHaveValue('Urine');
    await userEvent.type(screen.getByLabelText('Amount (mL)'), '100');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onAdd).toHaveBeenCalledWith({ time: '13:00', kind: 'out', category: 'Urine', amount: 100 });
    expect(screen.getByText('Output', { selector: '.l' }).nextElementSibling).toHaveTextContent('520mL');
    expect(screen.getByText('Net balance', { selector: '.l' }).nextElementSibling).toHaveTextContent('−155mL');
    expect(screen.queryByLabelText('Amount (mL)')).not.toBeInTheDocument();
  });

  it('does not save a non-numeric amount', async () => {
    const onAdd = vi.fn();
    render(<IntakeOutputPanel defaultAdding onAdd={onAdd} />);
    await userEvent.type(screen.getByLabelText('Amount (mL)'), 'abc');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onAdd).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Amount (mL)')).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows the empty and read-only states', () => {
    render(<IntakeOutputPanel readOnly entries={[]} />);
    expect(screen.getByText('No intake or output charted this shift.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Add entry' })).not.toBeInTheDocument();
  });
});
