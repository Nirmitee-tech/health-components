import { act, fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CCMTimer, formatClock, parseClock } from './CCMTimer';

describe('CCMTimer', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('parses and formats the clock', () => {
    expect(parseClock('07:12')).toBe(432);
    expect(parseClock('1:00:05')).toBe(3605);
    expect(parseClock('abc')).toBe(0);
    expect(formatClock(432)).toBe('07:12');
    expect(formatClock(3605)).toBe('1:00:05');
  });

  it('ticks while running and stops on pause', () => {
    const onRunningChange = vi.fn();
    render(<CCMTimer patient="Ralph Edwards" month="October 2026" clock="07:12" defaultRunning onRunningChange={onRunningChange} />);
    const timer = screen.getByRole('timer');
    expect(timer).toHaveTextContent('07:12');
    expect(timer).toHaveAttribute('aria-live', 'off');
    expect(screen.getByText('Timing')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(3000));
    expect(timer).toHaveTextContent('07:15');
    fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
    expect(onRunningChange).toHaveBeenCalledWith(false);
    expect(screen.getByText('Paused')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(5000));
    expect(timer).toHaveTextContent('07:15');
  });

  it('clears its interval on unmount', () => {
    const clear = vi.spyOn(globalThis, 'clearInterval');
    const { unmount } = render(<CCMTimer patient="A" month="October 2026" defaultRunning />);
    unmount();
    expect(clear).toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('starts from paused and logs activity with elapsed seconds', () => {
    const onLog = vi.fn();
    render(<CCMTimer patient="Mary Collins" month="October 2026" minutes={8} onLogActivity={onLog} />);
    expect(screen.getByText('12 minutes to go. Counts only clinical staff time with consent on file.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    act(() => vi.advanceTimersByTime(2000));
    fireEvent.click(screen.getByRole('button', { name: 'Log Activity' }));
    expect(onLog).toHaveBeenCalledWith(2);
  });

  it('names earned codes', () => {
    render(<CCMTimer patient="A" month="October 2026" minutes={44} />);
    expect(screen.getByText('99490 + 99439 earned.')).toBeInTheDocument();
  });

  it('renders on the server without starting a timer', () => {
    expect(renderToString(<CCMTimer patient="A" month="October 2026" defaultRunning clock="01:00" />)).toContain('01:00');
    expect(vi.getTimerCount()).toBe(0);
  });
});
