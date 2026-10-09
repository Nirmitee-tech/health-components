import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ListRow } from './ListRow';

describe('ListRow', () => {
  it('is a button with a chevron when clickable', async () => {
    const onClick = vi.fn();
    const { container } = render(<ListRow title="Henna West" meta="9:20 AM" onClick={onClick} />);
    const row = screen.getByRole('button', { name: /Henna West/ });
    expect(row).toHaveClass('co-li', 'co-rowb');
    expect(container.querySelector('.co-icon')).not.toBeNull();
    await userEvent.click(row);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is a link when href is set', () => {
    render(<ListRow title="Visit summary" href="/visits/1" />);
    expect(screen.getByRole('link', { name: /Visit summary/ })).toHaveAttribute('href', '/visits/1');
  });

  it('is a plain row otherwise', () => {
    const { container } = render(<ListRow title="Primary care" className="x" />);
    expect(screen.queryByRole('button')).toBeNull();
    expect(container.firstChild).toHaveClass('co-li', 'x');
    expect(container.querySelector('.co-icon')).toBeNull();
  });
});
