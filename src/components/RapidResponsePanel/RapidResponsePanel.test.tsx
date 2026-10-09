import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RangeContextProvider } from '../../clinical';
import { RapidResponsePanel } from './RapidResponsePanel';

const t0 = 1760000000000;
const base = {
  patient: 'Kowalski, Anna, 34 F',
  location: '4 West 403A',
  calledBy: 'J. Patel, RN',
  reason: 'New confusion and SpO2 86% on 4 L nasal cannula',
  calledAt: t0,
  now: t0 + (8 * 60 + 12) * 1000,
};

describe('RapidResponsePanel', () => {
  afterEach(() => vi.useRealTimers());

  it('lists critical vitals as meeting criteria from the shared ranges', () => {
    render(
      <RapidResponsePanel
        {...base}
        vitals={[
          { measure: 'spo2', value: 86 },
          { measure: 'rr', value: 32 },
          { measure: 'hr', value: 104 },
        ]}
      />
    );
    expect(screen.getByRole('timer')).toHaveTextContent('08:12');
    expect(screen.getByText('Meets criteria: 86 % spo2; 32 /min resp rate')).toBeInTheDocument();
    expect(screen.getByText('SpO2 86 %, Critical low, Reference 92–100 %')).toBeInTheDocument();
    expect(screen.getByText(/Heart rate 104 bpm, High/)).toBeInTheDocument();
  });

  it('uses the inpatient glucose range by default and the context passed down otherwise', () => {
    const { rerender } = render(<RapidResponsePanel {...base} labs={[{ measure: 'glucose', value: 142 }]} />);
    expect(screen.getByText('Glucose 142 mg/dL, Reference 70–180 mg/dL')).toBeInTheDocument();
    rerender(
      <RangeContextProvider value="outpatient">
        <RapidResponsePanel {...base} labs={[{ measure: 'glucose', value: 142 }]} />
      </RangeContextProvider>
    );
    expect(screen.getByText('Glucose 142 mg/dL, High, Reference 70–99 mg/dL')).toBeInTheDocument();
    rerender(
      <RapidResponsePanel
        {...base}
        rangeContext="outpatient"
        labs={[{ measure: 'glucose', value: 142, range: [70, 200] }]}
      />
    );
    expect(screen.getByText('Glucose 142 mg/dL, Reference 70–200 mg/dL')).toBeInTheDocument();
  });

  it('closes the call once an outcome is chosen and stops the clock', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(t0 + 60_000);
    const onClose = vi.fn();
    const onEscalate = vi.fn();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<RapidResponsePanel {...base} now={undefined} onClose={onClose} onEscalate={onEscalate} />);
    expect(screen.getByText('Team at bedside')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close Call' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Escalate to Code Blue' }));
    expect(onEscalate).toHaveBeenCalledTimes(1);
    await user.selectOptions(screen.getByRole('combobox', { name: 'Outcome' }), 'Transfer to ICU');
    expect(screen.getByText('Closed')).toBeInTheDocument();
    const frozen = screen.getByRole('timer').textContent;
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByRole('timer').textContent).toBe(frozen);
    await user.click(screen.getByRole('button', { name: 'Close Call' }));
    expect(onClose).toHaveBeenCalledWith('Transfer to ICU');
  });
});
