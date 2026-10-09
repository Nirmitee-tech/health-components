import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CheckInStepper } from './CheckInStepper';

describe('CheckInStepper', () => {
  it('shows six default steps with the current one', () => {
    render(<CheckInStepper patient="Henna West" appt="9:20 AM" current={2} />);
    const steps = screen.getAllByRole('listitem');
    expect(steps).toHaveLength(6);
    expect(steps[2]).toHaveAttribute('aria-current', 'step');
    expect(screen.getByRole('heading', { name: 'Check-in: Henna West' })).toBeInTheDocument();
    expect(screen.getAllByText('Arrived')).toHaveLength(2); // step label and status tag
  });

  it('marks issues, blocks completion and runs item actions', async () => {
    const onItemAction = vi.fn();
    const item = { label: 'Insurance', detail: 'Invalid member ID', ok: false, action: 'Fix Coverage' };
    render(<CheckInStepper patient="Henna West" appt="9:20 AM" current={2} issues={[2]} items={[item]} onItemAction={onItemAction} />);
    expect(screen.getAllByRole('listitem')[2]).toHaveClass('is-error');
    expect(screen.getByRole('img', { name: 'Needs attention' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Complete Check-In' })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'Fix Coverage' }));
    expect(onItemAction).toHaveBeenCalledWith(item, 0);
  });

  it('completes when there are no issues', async () => {
    const onComplete = vi.fn();
    render(<CheckInStepper patient="Henna West" appt="9:20 AM" done onComplete={onComplete} />);
    expect(screen.getByText('Checked In')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Complete Check-In' }));
    expect(onComplete).toHaveBeenCalled();
  });
});
