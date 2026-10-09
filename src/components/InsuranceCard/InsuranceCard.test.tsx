import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { InsuranceCard } from './InsuranceCard';

describe('InsuranceCard', () => {
  it('shows the front by default and flips to the back', async () => {
    const onSideChange = vi.fn();
    render(<InsuranceCard payer="Aetna" memberId="W123456789" payerId="60054" onSideChange={onSideChange} />);
    expect(screen.getByRole('group', { name: 'Aetna card, front' })).toBeInTheDocument();
    expect(screen.getByText('W123456789')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('radio', { name: 'Back' }));
    expect(onSideChange).toHaveBeenCalledWith('back');
    const card = screen.getByRole('group', { name: 'Aetna card, back' });
    expect(card).toHaveClass('co-inscard', 'is-back');
    expect(screen.getByText('60054')).toBeInTheDocument();
  });

  it('is controllable', async () => {
    const { rerender } = render(<InsuranceCard payer="Medicare" side="back" />);
    await userEvent.click(screen.getByRole('radio', { name: 'Front' }));
    expect(screen.getByRole('group', { name: 'Medicare card, back' })).toBeInTheDocument();
    rerender(<InsuranceCard payer="Medicare" side="front" />);
    expect(screen.getByRole('group', { name: 'Medicare card, front' })).toBeInTheDocument();
  });

  it('shows Scan Card until scanned', async () => {
    const onScan = vi.fn();
    const { rerender } = render(<InsuranceCard payer="Aetna" onScan={onScan} />);
    await userEvent.click(screen.getByRole('button', { name: 'Scan Card' }));
    expect(onScan).toHaveBeenCalled();
    rerender(<InsuranceCard payer="Aetna" scanned="10/09/2026" />);
    expect(screen.queryByRole('button', { name: 'Scan Card' })).toBeNull();
    expect(screen.getByText('Scanned 10/09/2026')).toBeInTheDocument();
  });

  it('forwards ref and className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<InsuranceCard ref={ref} className="x" payer="Aetna" />);
    expect(ref.current).toHaveClass('co-inscard-wrap', 'x');
  });
});
