import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { PickCard } from './PickCard';

describe('PickCard', () => {
  it('is a toggle button showing selection', async () => {
    const onClick = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    render(<PickCard ref={ref} title="Thu 9:20 AM" meta="Follow-Up" selected onClick={onClick} />);
    const card = screen.getByRole('button', { name: /Thu 9:20 AM/ });
    expect(card).toHaveAttribute('aria-pressed', 'true');
    expect(card).toHaveClass('co-pcard', 'is-on');
    await userEvent.click(card);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(ref.current).toBe(card);
  });

  it('cannot be chosen when disabled', async () => {
    const onClick = vi.fn();
    render(<PickCard title="Fri 10/10" meta="Fully booked" disabled onClick={onClick} />);
    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(card);
    expect(onClick).not.toHaveBeenCalled();
  });
});
