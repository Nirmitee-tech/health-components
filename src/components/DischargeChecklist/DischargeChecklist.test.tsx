import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DischargeChecklist, type DischargeItem } from './DischargeChecklist';

const items: DischargeItem[] = [
  {
    label: 'Medication reconciliation signed',
    required: true,
    done: true,
    auto: true,
    by: 'Dr. Raman',
  },
  {
    label: 'Home oxygen delivered',
    detail: '2 L/min by nasal cannula, Apria',
    required: true,
    owner: 'Case management',
  },
  { label: 'Teach-back on daily weights', required: true, owner: 'Primary RN' },
  { label: 'Flu vaccine offered' },
];

describe('DischargeChecklist', () => {
  it('enables Ready for Discharge only when every required task is done', async () => {
    const onReady = vi.fn();
    render(
      <DischargeChecklist
        patient="Okafor, Grace"
        edd="Today 14:00"
        items={items}
        user="J. Patel, RN"
        onReady={onReady}
      />
    );
    expect(screen.getByRole('button', { name: '2 required left' })).toBeDisabled();
    expect(screen.getByRole('progressbar', { name: /Discharge tasks/ })).toHaveAttribute('aria-valuenow', '1');

    await userEvent.click(
      screen.getByRole('checkbox', {
        name: /Home oxygen delivered \(required\)/,
      })
    );
    expect(screen.getByRole('button', { name: '1 required left' })).toBeDisabled();
    await userEvent.click(
      screen.getByRole('checkbox', {
        name: /Teach-back on daily weights \(required\)/,
      })
    );

    const ready = screen.getByRole('button', { name: 'Ready for Discharge' });
    expect(ready).toBeEnabled();
    await userEvent.click(ready);
    expect(onReady).toHaveBeenCalledTimes(1);
    expect(screen.getAllByText('Done by J. Patel, RN')).toHaveLength(2);
    expect(screen.getByText('3 of 4 done')).toBeInTheDocument();
  });

  it('unticking clears the stamp and shows the owner again', async () => {
    const onItemsChange = vi.fn();
    render(<DischargeChecklist items={items} onItemsChange={onItemsChange} />);
    const oxygen = screen.getByRole('checkbox', {
      name: /Home oxygen delivered/,
    });
    await userEvent.click(oxygen);
    expect(onItemsChange.mock.calls[0]![0][1]).toMatchObject({
      done: true,
      by: 'You',
    });
    await userEvent.click(oxygen);
    expect(onItemsChange.mock.calls[1]![0][1]).toMatchObject({
      done: false,
      by: null,
    });
    expect(screen.getByText('Owner: Case management')).toBeInTheDocument();
  });

  it('does not let chart-filled items be ticked by hand', () => {
    render(<DischargeChecklist items={items} />);
    expect(
      screen.getByRole('checkbox', {
        name: /Medication reconciliation signed/,
      })
    ).toBeDisabled();
    expect(screen.getByText('From chart by Dr. Raman')).toBeInTheDocument();
  });

  it('is view only when readOnly', () => {
    render(<DischargeChecklist items={items.map((i) => ({ ...i, done: true }))} readOnly />);
    screen.getAllByRole('checkbox').forEach((c) => expect(c).toBeDisabled());
    expect(screen.getByRole('button', { name: 'Ready for Discharge' })).toBeDisabled();
  });
});
