import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { WaitlistRow, type WaitlistItem } from './WaitlistRow';

const item: WaitlistItem = {
  patient: 'Kristin Watson',
  type: 'Annual Wellness',
  provider: 'Any provider',
  window: 'mornings this week',
  since: '09/30',
  match: 'Thu 10/09 9:40 AM',
};

describe('WaitlistRow', () => {
  it('offers a matched slot', async () => {
    const onOffer = vi.fn();
    render(<WaitlistRow item={item} onOffer={onOffer} />);
    expect(screen.getByText('Opening: Thu 10/09 9:40 AM')).toBeInTheDocument();
    expect(screen.getByText('Annual Wellness . Any provider . Wants mornings this week . On list 09/30')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Offer Slot to Kristin Watson' }));
    expect(onOffer).toHaveBeenCalledWith(item);
  });

  it('disables Offer Slot without a match', () => {
    render(<WaitlistRow item={{ ...item, match: undefined, priority: 'Same day' }} />);
    expect(screen.getByText('No match yet')).toBeInTheDocument();
    expect(screen.getByText('Same day')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Offer Slot/ })).toBeDisabled();
  });

  it('runs row menu actions', async () => {
    const onRemove = vi.fn();
    render(<WaitlistRow item={item} onRemove={onRemove} />);
    await userEvent.click(screen.getByRole('button', { name: 'Actions for Kristin Watson' }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Remove from Waitlist' }));
    expect(onRemove).toHaveBeenCalledWith(item);
  });
});
