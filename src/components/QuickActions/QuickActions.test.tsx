import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { QuickActions } from './QuickActions';

describe('QuickActions', () => {
  it('renders buttons and links with the badge in the name', async () => {
    const onClick = vi.fn();
    render(
      <QuickActions
        items={[
          { label: 'Book Visit', icon: 'calendar', onClick },
          { label: 'Messages', icon: 'message', href: '/messages', badge: 2 },
        ]}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Book Visit' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    const link = screen.getByRole('link', { name: /^Messages\W+2$/ });
    expect(link).toHaveAttribute('href', '/messages');
    expect(link).toHaveClass('co-qb');
  });
});
