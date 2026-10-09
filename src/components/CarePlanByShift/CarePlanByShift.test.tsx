import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CarePlanByShift, type CarePlanProblem } from './CarePlanByShift';

const problems: CarePlanProblem[] = [
  {
    problem: 'Risk for falls',
    goalStatus: 'met',
    goal: 'No falls.',
    interventions: [{ text: 'Hourly rounding', status: ['done'] }],
  },
];

describe('CarePlanByShift', () => {
  it('only the current shift is editable and cycles the statuses', async () => {
    const onStatusChange = vi.fn();
    render(<CarePlanByShift problems={problems} currentShift={1} onStatusChange={onStatusChange} />);
    expect(screen.getByRole('region', { name: 'Risk for falls' })).toHaveTextContent('Goal met');
    expect(screen.getAllByRole('button')).toHaveLength(1);
    const btn = screen.getByRole('button', { name: 'Hourly rounding, Evening 15-23: not charted. Select to change.' });
    await userEvent.click(btn);
    expect(onStatusChange).toHaveBeenCalledWith({ problem: 0, intervention: 0, shift: 1, status: 'done' });
    await userEvent.click(screen.getByRole('button', { name: /Evening 15-23: Done/ }));
    expect(screen.getByRole('button', { name: /Evening 15-23: Partly/ })).toBeInTheDocument();
    expect(screen.getByText('Upcoming')).toBeInTheDocument();
  });

  it('read only has no buttons', () => {
    render(<CarePlanByShift problems={problems} currentShift={0} readOnly />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
