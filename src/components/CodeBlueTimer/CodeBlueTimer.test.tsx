import { act, render, screen, within } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CodeBlueTimer } from './CodeBlueTimer';

const t0 = 1760000000000;

describe('CodeBlueTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(t0);
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts the clock on mount and ticks every second', () => {
    render(<CodeBlueTimer patient="Ruiz, Carmen, 81 F" location="4 West 404B" />);
    expect(screen.getByRole('timer', { name: 'Elapsed 00:00' })).toHaveTextContent('00:00');
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByRole('timer')).toHaveTextContent('00:03');
    act(() => {
      vi.advanceTimersByTime(62000);
    });
    expect(screen.getByRole('timer')).toHaveTextContent('01:05');
  });

  it('runs from startedAt', () => {
    render(<CodeBlueTimer patient="Ruiz, Carmen" location="4 West 404B" startedAt={t0 - 90_000} />);
    expect(screen.getByRole('timer')).toHaveTextContent('01:30');
  });

  it('stops the clock when the code ends and clears the interval on unmount', () => {
    const { rerender, unmount } = render(
      <CodeBlueTimer patient="Ruiz, Carmen" location="4 West 404B" startedAt={t0} />
    );
    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    expect(screen.getByRole('timer')).toHaveTextContent('00:10');
    expect(vi.getTimerCount()).toBe(1);
    rerender(<CodeBlueTimer patient="Ruiz, Carmen" location="4 West 404B" startedAt={t0} ended="ROSC at 00:10" />);
    expect(vi.getTimerCount()).toBe(0);
    act(() => {
      vi.advanceTimersByTime(30_000);
    });
    expect(screen.getByRole('timer')).toHaveTextContent('00:10');
    expect(screen.getByText('Code Blue ended: ROSC at 00:10')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'ROSC' })).not.toBeInTheDocument();
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('does not tick when the clock is frozen with now', () => {
    render(<CodeBlueTimer patient="Ruiz, Carmen" location="4 West 404B" startedAt={t0} now={t0 + 331_000} />);
    expect(vi.getTimerCount()).toBe(0);
    expect(screen.getByRole('timer')).toHaveTextContent('05:31');
  });

  it('logs events at the elapsed time and drives the CPR and epinephrine tiles', () => {
    const onEvent = vi.fn();
    const onRosc = vi.fn();
    render(
      <CodeBlueTimer
        patient="Ruiz, Carmen"
        location="4 West 404B"
        startedAt={t0}
        rhythm="VF"
        energy={200}
        events={[{ t: 0, text: 'Code called, CPR started' }]}
        onEvent={onEvent}
        onRosc={onRosc}
      />
    );
    act(() => {
      vi.advanceTimersByTime(125_000);
    });
    expect(screen.getByText('Rhythm check due')).toBeInTheDocument();

    act(() => screen.getByRole('button', { name: 'Rhythm Check' }).click());
    expect(onEvent).toHaveBeenLastCalledWith({
      t: 125,
      text: 'Rhythm check: VF',
    });
    expect(screen.getByText('Check rhythm at 02:00')).toBeInTheDocument();

    act(() => screen.getByRole('button', { name: 'Shock Delivered' }).click());
    act(() => screen.getByRole('button', { name: 'Epinephrine 1 mg' }).click());
    act(() => screen.getByRole('button', { name: 'Amiodarone 300 mg' }).click());
    expect(screen.getByRole('button', { name: 'Amiodarone 150 mg' })).toBeInTheDocument();
    expect(screen.getByText('1 shock · 200 J biphasic')).toBeInTheDocument();
    expect(screen.getByText('1 dose · due every 03:00 to 05:00')).toBeInTheDocument();

    const log = screen.getByRole('list', { name: 'Event log, newest first' });
    const entries = within(log)
      .getAllByRole('listitem')
      .map((li) => li.textContent);
    expect(entries[0]).toBe('02:05Amiodarone 300 mg IV push');
    expect(entries[entries.length - 1]).toBe('00:00Code called, CPR started');
    expect(screen.getByText('Event log (5)')).toBeInTheDocument();

    act(() => screen.getByRole('button', { name: 'ROSC' }).click());
    expect(onRosc).toHaveBeenCalledTimes(1);
  });

  it('renders on the server without a clock', () => {
    vi.useRealTimers();
    const html = renderToString(<CodeBlueTimer patient="Ruiz, Carmen" location="4 West 404B" />);
    expect(html).toContain('00:00');
    expect(html).toContain('CODE BLUE');
  });
});
