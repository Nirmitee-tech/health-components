import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TopBar } from './TopBar';

describe('TopBar', () => {
  it('renders the classic bar with module links by default', async () => {
    const onNavigate = vi.fn();
    render(<TopBar active="Billing" role="Biller" notifications={3} onNavigate={onNavigate} />);
    expect(screen.getByRole('banner')).toHaveClass('co-top', 'co-top-classic');
    expect(screen.getByRole('link', { name: 'Billing' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Change the role you are viewing as' })).toHaveTextContent('Biller');
    expect(screen.getByRole('button', { name: 'Notifications, 3 unread' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Account menu' })).toHaveTextContent('JL');
    await userEvent.click(screen.getByRole('link', { name: 'Reports' }));
    expect(onNavigate).toHaveBeenCalledWith('Reports', expect.anything());
  });

  it('renders the sidebar search and quick add', async () => {
    const onSearchChange = vi.fn();
    render(<TopBar variant="sidebar" quickAdd="New Patient" onSearchChange={onSearchChange} />);
    await userEvent.type(screen.getByRole('textbox', { name: 'Search patients by name, MRN or DOB' }), 'Hen');
    expect(onSearchChange).toHaveBeenLastCalledWith('Hen');
    expect(screen.getByRole('button', { name: 'New Patient' })).toBeInTheDocument();
  });

  it('renders the command bar that opens the palette', async () => {
    const onOpenPalette = vi.fn();
    render(<TopBar variant="command" module="Revenue" onOpenPalette={onOpenPalette} />);
    expect(screen.getByRole('button', { name: /Revenue/ })).toHaveAttribute('aria-haspopup', 'menu');
    await userEvent.click(screen.getByRole('button', { name: /Jump to anything/ }));
    expect(onOpenPalette).toHaveBeenCalledTimes(1);
  });

  it('renders rail tabs', () => {
    render(<TopBar variant="rail" tabs={<div data-testid="tabs" />} />);
    expect(screen.getByTestId('tabs')).toBeInTheDocument();
  });
});
