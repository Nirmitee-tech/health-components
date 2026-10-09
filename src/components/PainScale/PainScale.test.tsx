import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PainScale } from './PainScale';

describe('PainScale', () => {
  it('picks a numeric score with band and goal check', async () => {
    const onChange = vi.fn();
    render(<PainScale goal={3} reassess="30 min" onChange={onChange} />);
    expect(screen.getByRole('status')).toHaveTextContent('Not scored');
    await userEvent.click(screen.getByRole('radio', { name: '7' }));
    expect(onChange).toHaveBeenCalledWith({ mode: 'numeric', score: 7 });
    const s = screen.getByRole('status');
    expect(s).toHaveTextContent('7 /10');
    expect(s).toHaveTextContent('Severe');
    expect(s).toHaveTextContent('Above the patient goal of 3. Intervene and reassess within 30 min.');
  });

  it('faces score in steps of 2', async () => {
    render(<PainScale defaultMode="faces" goal={4} />);
    await userEvent.click(screen.getByRole('radio', { name: /4 Hurts a little more/ }));
    expect(screen.getByRole('status')).toHaveTextContent('4 /10');
    expect(screen.getByRole('status')).toHaveTextContent('Moderate');
    expect(screen.getByRole('status')).toHaveTextContent('At or below the patient goal of 4.');
  });

  it('totals FLACC once all five categories are scored', async () => {
    const onChange = vi.fn();
    render(<PainScale defaultMode="flacc" defaultFlacc={{ face: 1, legs: 1, activity: 0, cry: 1 }} onChange={onChange} />);
    expect(screen.getByRole('status')).toHaveTextContent('4 of 5 categories scored');
    await userEvent.click(within(screen.getByRole('radiogroup', { name: 'Consolability' })).getByRole('radio', { name: /Hard to console/ }));
    expect(screen.getByRole('status')).toHaveTextContent('5 /10');
    expect(onChange).toHaveBeenCalledWith({ mode: 'flacc', score: 5 });
  });

  it('switches scales and hides the switch with one mode', async () => {
    const { rerender } = render(<PainScale />);
    await userEvent.click(screen.getByRole('radio', { name: 'FLACC (nonverbal)' }));
    expect(screen.getByRole('radiogroup', { name: 'Face' })).toBeInTheDocument();
    rerender(<PainScale modes={['numeric']} defaultValue={0} readOnly />);
    expect(screen.queryByRole('radiogroup', { name: 'Pain scale' })).not.toBeInTheDocument();
  });

  it('read only', async () => {
    render(<PainScale modes={['numeric']} defaultValue={0} readOnly />);
    expect(screen.getByRole('status')).toHaveTextContent('No pain');
    await userEvent.click(screen.getByRole('radio', { name: '5' }));
    expect(screen.getByRole('radio', { name: '0' })).toHaveAttribute('aria-checked', 'true');
  });
});
