import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('uses label as accessible name and title', () => {
    render(<IconButton icon="x" label="Close" />);
    const btn = screen.getByRole('button', { name: 'Close' });
    expect(btn).toHaveAttribute('title', 'Close');
    expect(btn).toHaveAttribute('type', 'button');
    expect(btn).toHaveClass('co-ib', 'co-ib-ghost');
  });

  it('applies variant and size classes', () => {
    render(<IconButton icon="plus" label="New" variant="primary" size="lg" />);
    expect(screen.getByRole('button')).toHaveClass('co-ib-primary', 'co-ib-lg');
  });

  it('announces the badge count', () => {
    render(<IconButton icon="bell" label="Notifications" badge={4} />);
    expect(screen.getByRole('button', { name: 'Notifications, 4 unread' })).toBeInTheDocument();
    expect(screen.getByText('4')).toHaveClass('co-count');
  });

  it('calls onClick and respects disabled', async () => {
    const onClick = vi.fn();
    const { rerender } = render(<IconButton icon="x" label="Close" onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
    rerender(<IconButton icon="x" label="Close" onClick={onClick} disabled />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('forwards refs and native attributes', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<IconButton ref={ref} icon="x" label="Close" data-testid="ib" aria-expanded={false} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(screen.getByTestId('ib')).toHaveAttribute('aria-expanded', 'false');
  });
});
