import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { OrderReconciliation, type TransferOrder } from './OrderReconciliation';

const orders: TransferOrder[] = [
  {
    type: 'Medications',
    name: 'Heparin',
    dose: 18,
    unit: 'units/kg/h',
    detail: 'IV continuous',
    notAllowedOn: ['medsurg'],
  },
  {
    type: 'Medications',
    name: 'Ceftriaxone',
    dose: 2,
    unit: 'g',
    detail: 'IV q24h',
    action: 'continue',
  },
  {
    type: 'Nursing',
    name: 'Neuro checks',
    detail: 'q1h',
    notAllowedOn: ['medsurg', 'tele'],
    action: 'continue',
  },
];

describe('OrderReconciliation', () => {
  it('groups orders by type and flags orders not allowed on the new unit', () => {
    render(<OrderReconciliation from="icu" to="medsurg" orders={orders} />);
    expect(screen.getByRole('list', { name: 'Medications' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Nursing' })).toBeInTheDocument();
    expect(screen.getAllByText('Not allowed on Med-Surg. Stop it or change it.')).toHaveLength(2);
    const heparin = screen.getByRole('radiogroup', {
      name: 'Action for Heparin',
    });
    expect(
      within(heparin)
        .getAllByRole('radio')
        .map((r) => r.textContent)
    ).toEqual(['Modify', 'Stop']);
  });

  it('counts a not-allowed order left on continue as still needing review', async () => {
    const onRelease = vi.fn();
    render(<OrderReconciliation from="icu" to="medsurg" orders={orders} onRelease={onRelease} />);
    expect(screen.getByRole('button', { name: 'Review 2 more' })).toBeDisabled();
    await userEvent.click(
      within(screen.getByRole('radiogroup', { name: 'Action for Heparin' })).getByRole('radio', { name: 'Modify' })
    );
    await userEvent.click(
      within(screen.getByRole('radiogroup', { name: 'Action for Neuro checks' })).getByRole('radio', { name: 'Stop' })
    );
    const release = screen.getByRole('button', {
      name: 'Release Orders to Med-Surg',
    });
    expect(release).toBeEnabled();
    await userEvent.click(release);
    expect(onRelease.mock.calls[0]![0].map((o: TransferOrder) => o.action)).toEqual([
      'modify',
      'continue',
      'discontinue',
    ]);
  });

  it('stopping an order strikes it through and maps to discontinue', async () => {
    const onOrdersChange = vi.fn();
    render(<OrderReconciliation from="icu" to="tele" orders={orders} onOrdersChange={onOrdersChange} />);
    await userEvent.click(
      within(screen.getByRole('radiogroup', { name: 'Action for Ceftriaxone' })).getByRole('radio', { name: 'Stop' })
    );
    expect(onOrdersChange.mock.calls[0]![0][1].action).toBe('discontinue');
    expect(screen.getByText('Ceftriaxone').closest('div')).toHaveClass('ip-strike');
  });

  it('disables decisions when read only', () => {
    render(<OrderReconciliation from="medsurg" to="icu" orders={orders.slice(1, 2)} readOnly />);
    screen.getAllByRole('radio').forEach((r) => expect(r).toBeDisabled());
    expect(screen.getByRole('button', { name: 'Release Orders to ICU' })).toBeDisabled();
  });
});
