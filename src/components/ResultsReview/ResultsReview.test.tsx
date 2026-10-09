import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ResultsReview, type ResultReviewResult } from './ResultsReview';

const crit: ResultReviewResult = {
  title: 'Basic metabolic panel',
  patient: 'Ralph Edwards . 74 y',
  orderedBy: 'Priya Shah MD',
  collected: '10/09/2026 07:40',
  resulted: '10/09/2026 09:05',
  calledTo: 'Priya Shah MD at 09:08',
  rows: [
    { code: 'Na', value: 131, prior: 133 },
    { code: 'K', value: 6.8, prior: 5.6 },
  ],
};
const routine: ResultReviewResult = {
  title: 'Thyroid stimulating hormone',
  orderedBy: 'James Bell MD',
  collected: '10/08/2026',
  resulted: '10/09/2026',
  rows: [{ code: 'TSH', value: 5.82, prior: 4.1 }],
};

describe('ResultsReview', () => {
  it('formats rows with the shared rules and marks a critical row', () => {
    render(<ResultsReview result={crit} />);
    const table = screen.getByRole('table', { name: 'Basic metabolic panel' });
    const rows = within(table).getAllByRole('row');
    expect(rows[2]).toHaveClass('is-crit');
    expect(rows[2]).toHaveTextContent('Potassium');
    expect(rows[2]).toHaveTextContent('6.8');
    expect(rows[2]).toHaveTextContent('3.5–5.1 mmol/L');
    expect(screen.getByText('Critical, not acknowledged')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Called to Priya Shah MD at 09:08');
  });

  it('needs the read-back before a critical value can be acknowledged', async () => {
    const onAcknowledge = vi.fn();
    const onStatusChange = vi.fn();
    render(<ResultsReview result={crit} user="Priya Shah MD" onAcknowledge={onAcknowledge} onStatusChange={onStatusChange} />);
    const ack = screen.getByRole('button', { name: 'Acknowledge' });
    expect(ack).toBeDisabled();
    await userEvent.click(screen.getByRole('checkbox', { name: /Read-back done with the lab/ }));
    expect(ack).toBeEnabled();
    await userEvent.click(ack);
    expect(onAcknowledge).toHaveBeenCalledTimes(1);
    expect(onStatusChange).toHaveBeenCalledWith('acknowledged');
    expect(screen.getByText('Acknowledged')).toBeInTheDocument();
    expect(screen.getByText('Acknowledged by Priya Shah MD.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Acknowledge' })).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('acknowledges a routine result straight away', async () => {
    render(<ResultsReview result={routine} />);
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Acknowledge' }));
    expect(screen.getByText('Acknowledged by you.')).toBeInTheDocument();
  });

  it('adds a comment', async () => {
    const onComment = vi.fn();
    render(<ResultsReview result={routine} user="James Bell MD" onComment={onComment} />);
    await userEvent.click(screen.getByRole('button', { name: 'Comment' }));
    const add = screen.getByRole('button', { name: 'Add Comment' });
    expect(add).toBeDisabled();
    await userEvent.type(screen.getByLabelText('Comment for the chart'), 'Repeat with free T4');
    await userEvent.click(add);
    expect(onComment).toHaveBeenCalledWith({ by: 'James Bell MD', text: 'Repeat with free T4', at: 'Just now' });
    expect(screen.getByRole('list')).toHaveTextContent('Repeat with free T4');
    expect(screen.queryByLabelText('Comment for the chart')).not.toBeInTheDocument();
  });

  it('routes to a person or pool', async () => {
    const onRoute = vi.fn();
    render(<ResultsReview result={routine} routeOptions={['Lisa Chen RN', 'Front desk pool']} onRoute={onRoute} />);
    await userEvent.click(screen.getByRole('button', { name: 'Route' }));
    /* The form's Route button comes before the action row. */
    const route = screen.getAllByRole('button', { name: 'Route' })[0]!;
    expect(route).toBeDisabled();
    await userEvent.selectOptions(screen.getByLabelText('Route to'), 'Lisa Chen RN');
    await userEvent.click(route);
    expect(onRoute).toHaveBeenCalledWith('Lisa Chen RN');
    expect(screen.getByText('Routed to Lisa Chen RN')).toBeInTheDocument();
  });

  it('shows a lock message in read-only mode', () => {
    render(<ResultsReview result={routine} readOnly />);
    expect(screen.getByText('Your role can view results but not acknowledge them.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Acknowledge' })).not.toBeInTheDocument();
  });

  it('uses the lab range sent with the row over the registry', () => {
    render(<ResultsReview result={{ ...routine, rows: [{ code: 'TSH', value: 5.82, over: { low: 0.5, high: 6 } }] }} />);
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByRole('table')).toHaveTextContent('0.50–6.00 mIU/L');
  });
});
