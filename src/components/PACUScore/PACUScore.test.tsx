import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { aldrete, PACUScore } from './PACUScore';

describe('aldrete', () => {
  it('totals the five items and applies the discharge rule', () => {
    expect(aldrete({})).toEqual({ total: null, complete: false, ready: false });
    expect(aldrete({ activity: 1, respiration: 2 })).toEqual({ total: 3, complete: false, ready: false });
    expect(aldrete({ activity: 2, respiration: 2, circulation: 2, consciousness: 2, spo2: 1 })).toEqual({ total: 9, complete: true, ready: true });
    expect(aldrete({ activity: 0, respiration: 2, circulation: 2, consciousness: 2, spo2: 2 }).ready).toBe(false);
    expect(aldrete({ activity: 1, respiration: 2, circulation: 2, consciousness: 1, spo2: 1 })).toEqual({ total: 7, complete: true, ready: false });
    expect(aldrete({ activity: 0, respiration: 0, circulation: 0, consciousness: 0, spo2: 0 }).total).toBe(0);
  });
});

describe('PACUScore', () => {
  it('says Not scored until an item is chosen', () => {
    render(<PACUScore />);
    expect(screen.getByRole('status')).toHaveTextContent('Not scored');
  });

  it('updates the total and readiness as items are scored', async () => {
    const onChange = vi.fn();
    render(<PACUScore onChange={onChange} />);
    const pick = (legend: string, score: number) =>
      userEvent.click(within(screen.getByRole('group', { name: legend })).getAllByRole('radio')[score]!);
    await pick('Activity', 2);
    expect(screen.getByRole('status')).toHaveTextContent('2');
    expect(screen.getByText('Incomplete')).toBeInTheDocument();
    await pick('Respiration', 2);
    await pick('Circulation', 2);
    await pick('Consciousness', 1);
    await pick('Oxygen saturation', 1);
    expect(screen.getByRole('status')).toHaveTextContent('Total8');
    expect(screen.getByText('Not ready')).toBeInTheDocument();
    await pick('Consciousness', 2);
    expect(screen.getByRole('status')).toHaveTextContent('Total9');
    expect(screen.getByText('Meets discharge criteria')).toBeInTheDocument();
    expect(onChange).toHaveBeenLastCalledWith({ activity: 2, respiration: 2, circulation: 2, consciousness: 2, spo2: 1 });
  });

  it('is not ready at 9 when an item is 0', () => {
    render(<PACUScore defaultValues={{ activity: 0, respiration: 2, circulation: 2, consciousness: 2, spo2: 2 }} />);
    expect(screen.getByText('Not ready')).toBeInTheDocument();
  });

  it('flags a total under 9 against the target', () => {
    render(<PACUScore defaultValues={{ activity: 1, respiration: 1, circulation: 1, consciousness: 1, spo2: 1 }} />);
    expect(within(screen.getByRole('status')).getByRole('img', { name: 'Low' })).toBeInTheDocument();
  });

  it('supports controlled values', async () => {
    const onChange = vi.fn();
    render(<PACUScore values={{ activity: 1 }} onChange={onChange} />);
    const radios = within(screen.getByRole('group', { name: 'Activity' })).getAllByRole('radio');
    await userEvent.click(radios[2]!);
    expect(onChange).toHaveBeenCalledWith({ activity: 2 });
    expect(radios[1]).toBeChecked();
  });

  it('keeps radio groups apart when several are on a page', () => {
    render(
      <>
        <PACUScore />
        <PACUScore />
      </>
    );
    const names = screen.getAllByRole('group', { name: 'Activity' }).map((g) => within(g).getAllByRole('radio')[0]!.getAttribute('name'));
    expect(names[0]).not.toBe(names[1]);
  });

  it('shows the history with totals and locks when readOnly', () => {
    render(
      <PACUScore
        readOnly
        defaultValues={{ activity: 2 }}
        history={[{ time: '09:34', activity: 0, respiration: 1, circulation: 1, consciousness: 1, spo2: 1 }]}
      />
    );
    const table = screen.getByRole('table', { name: 'Earlier PACU scores' });
    expect(within(table).getByText('09:34')).toBeInTheDocument();
    expect(within(table).getByText('4')).toBeInTheDocument();
    screen.getAllByRole('radio').forEach((r) => expect(r).toBeDisabled());
  });
});
