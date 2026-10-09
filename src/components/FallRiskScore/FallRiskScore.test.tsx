import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FallRiskScore, morseBand } from './FallRiskScore';

describe('FallRiskScore', () => {
  it('totals the Morse items and shows the band', () => {
    render(<FallRiskScore defaultValues={{ history: 1, secondary: 1, aid: 1, iv: 1, gait: 2, mental: 0 }} previous={{ total: 35, when: 'yesterday' }} />);
    const total = screen.getByRole('status');
    expect(total).toHaveTextContent('95');
    expect(total).toHaveTextContent('pts of 125');
    expect(total).toHaveTextContent('High fall risk');
    expect(screen.getByText(/Previous:/)).toHaveTextContent('35');
  });

  it('shows progress until every item is scored, then the total', async () => {
    const onChange = vi.fn();
    render(<FallRiskScore defaultValues={{ history: 0, secondary: 1, aid: 0, iv: 1, gait: 0 }} onChange={onChange} />);
    expect(screen.getByRole('status')).toHaveTextContent('5 of 6 items scored');
    expect(screen.getByRole('status')).toHaveTextContent('--');
    const mental = screen.getByRole('radiogroup', { name: 'Mental status' });
    await userEvent.click(within(mental).getByRole('radio', { name: /Knows own limits/ }));
    expect(onChange).toHaveBeenLastCalledWith({ history: 0, secondary: 1, aid: 0, iv: 1, gait: 0, mental: 0 });
    expect(screen.getByRole('status')).toHaveTextContent('35');
    expect(screen.getByRole('status')).toHaveTextContent('Moderate fall risk');
  });

  it('moves and selects with arrow keys (radio group)', async () => {
    render(<FallRiskScore defaultValues={{ gait: 0 }} />);
    const gait = screen.getByRole('radiogroup', { name: 'Gait' });
    const [normal, weak] = within(gait).getAllByRole('radio');
    expect(normal).toHaveAttribute('tabindex', '0');
    expect(weak).toHaveAttribute('tabindex', '-1');
    normal!.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(weak).toHaveFocus();
    expect(weak).toHaveAttribute('aria-checked', 'true');
  });

  it('read only does not change', async () => {
    render(<FallRiskScore readOnly defaultValues={{ history: 0 }} />);
    const yes = within(screen.getByRole('radiogroup', { name: /History of falling/ })).getByRole('radio', { name: /Yes/ });
    expect(yes).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(yes);
    expect(yes).toHaveAttribute('aria-checked', 'false');
  });

  it('uses the common Morse cut-offs', () => {
    expect(morseBand(24).label).toBe('Low fall risk');
    expect(morseBand(25).label).toBe('Moderate fall risk');
    expect(morseBand(45).label).toBe('High fall risk');
    expect(FallRiskScore.items).toHaveLength(6);
  });
});
