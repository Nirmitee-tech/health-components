import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { StatCard } from './StatCard';

describe('StatCard', () => {
  it('is static without onClick', () => {
    render(<StatCard label="Clean Claim Rate" value="94%" trend="2 pts" trendGood sub="last 30 days" />);
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByText('↑ 2 pts')).toHaveClass('co-trend', 'is-good');
  });

  it('is a toggle button with onClick', async () => {
    const onClick = vi.fn();
    render(<StatCard label="Claims to Work" value="42" selected onClick={onClick} />);
    const btn = screen.getByRole('button', { name: /Claims to Work/ });
    expect(btn).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('shows a skeleton while loading and a meter', () => {
    render(<StatCard label="PA Units" value="12 of 20" loading meter={{ value: 12, max: 20 }} />);
    expect(screen.getByRole('status', { name: 'Loading PA Units' })).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'PA Units' })).toHaveAttribute('aria-valuenow', '12');
  });
});
