import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SidebarNav, type SidebarNavGroup } from './SidebarNav';

const groups: SidebarNavGroup[] = [
  { label: 'Clinical', items: [{ label: 'Schedule', icon: 'calendar' }, { label: 'Inbox', icon: 'inbox', badge: 7 }] },
  { label: 'Insights', items: [{ label: 'Reports', icon: 'chart', locked: true, href: '/reports' }] },
];

describe('SidebarNav', () => {
  it('renders groups, the active item, badges and locks', () => {
    render(<SidebarNav groups={groups} active="Schedule" />);
    expect(screen.getByRole('navigation', { name: 'Main' })).toHaveClass('co-side');
    expect(screen.getByText('Clinical')).toHaveClass('co-gl');
    expect(screen.getByRole('link', { name: 'Schedule' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('7')).toHaveClass('co-ni-b');
    expect(screen.getByRole('img', { name: 'View only' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Reports/ })).toHaveAttribute('href', '/reports');
  });

  it('collapses and expands', async () => {
    const onCollapse = vi.fn();
    render(<SidebarNav groups={groups} onCollapse={onCollapse} />);
    const btn = screen.getByRole('button', { name: 'Collapse sidebar' });
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(btn);
    expect(onCollapse).toHaveBeenCalledWith(true);
    expect(screen.getByRole('navigation')).toHaveClass('is-col');
    expect(screen.queryByText('Clinical')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Schedule' })).toHaveAttribute('title', 'Schedule');
    await userEvent.click(screen.getByRole('button', { name: 'Expand sidebar' }));
    expect(onCollapse).toHaveBeenLastCalledWith(false);
  });

  it('calls onNavigate and prevents navigation for items without href', async () => {
    const onNavigate = vi.fn();
    render(<SidebarNav groups={groups} onNavigate={onNavigate} />);
    await userEvent.click(screen.getByRole('link', { name: 'Schedule' }));
    expect(onNavigate).toHaveBeenCalledWith(groups[0]!.items[0], expect.anything());
    expect(onNavigate.mock.calls[0]![1].defaultPrevented).toBe(true);
  });
});
