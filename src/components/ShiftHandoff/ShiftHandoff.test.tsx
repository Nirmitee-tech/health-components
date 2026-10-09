import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ShiftHandoff } from './ShiftHandoff';

describe('ShiftHandoff', () => {
  it('renders SBAR with formatted, flagged values and accepts the handoff', async () => {
    const onAcknowledge = vi.fn();
    render(
      <ShiftHandoff
        from="L. Chen RN"
        to="J. Ortiz RN"
        situation={{ text: 'POD 1, meets SIRS criteria.' }}
        assessment={{ values: [{ label: 'HR', measure: 'hr', value: 121 }, { label: 'BP', measure: 'bp', value: '92/54' }] }}
        onAcknowledge={onAcknowledge}
      />
    );
    expect(screen.getByText('POD 1, meets SIRS criteria.')).toBeInTheDocument();
    expect(screen.getAllByText('Not filled in')).toHaveLength(2);
    expect(screen.getByText(/HR 121 bpm, High/)).toBeInTheDocument();
    expect(screen.getByText('92/54')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Accept handoff' }));
    expect(onAcknowledge).toHaveBeenCalled();
    expect(screen.getByText('Received by J. Ortiz RN')).toBeInTheDocument();
  });

  it('shows the accepted state', () => {
    render(<ShiftHandoff to="M. Green RN" acknowledged ackTime="19:12" />);
    expect(screen.getByText('Received by M. Green RN at 19:12')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
