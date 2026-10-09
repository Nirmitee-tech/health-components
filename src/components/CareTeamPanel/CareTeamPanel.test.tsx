import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CareTeamPanel, type CareTeamMember } from './CareTeamPanel';

const team: CareTeamMember[] = [
  { name: 'James Bell MD', role: 'Primary care', specialty: 'Family medicine', npi: '1457382910', primary: true },
  { name: 'Omar Haddad MD', role: 'Specialist', external: true, phone: '(555) 830-1200' },
  { name: 'Tom Reyes DPT', role: 'Physical therapy', status: 'inactive', ended: '06/2026' },
];

describe('CareTeamPanel', () => {
  it('lists members with their roles and actions', async () => {
    const onCall = vi.fn();
    const onMessage = vi.fn();
    const onMemberAction = vi.fn();
    render(<CareTeamPanel members={team} updated="10/09/2026" onCall={onCall} onMessage={onMessage} onMemberAction={onMemberAction} />);
    expect(screen.getByText('3 members . updated 10/09/2026')).toBeInTheDocument();
    expect(screen.getByText('Primary care . Family medicine . NPI 1457382910')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Message Omar Haddad MD' })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Call Omar Haddad MD (555) 830-1200' }));
    expect(onCall).toHaveBeenCalledWith(team[1]);
    await userEvent.click(screen.getByRole('button', { name: 'Message James Bell MD' }));
    expect(onMessage).toHaveBeenCalledWith(team[0]);
    await userEvent.click(screen.getByRole('button', { name: 'Actions for Tom Reyes DPT' }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'End relationship' }));
    expect(onMemberAction).toHaveBeenCalledWith('end', team[2]);
    expect(screen.getByText('Ended 06/2026').closest('li')).toHaveClass('is-dim');
  });

  it('hides edit actions when read only and shows the empty state', () => {
    const { unmount } = render(<CareTeamPanel members={team} readOnly />);
    expect(screen.queryByRole('button', { name: 'Add Member' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Actions for/ })).not.toBeInTheDocument();
    unmount();
    render(<CareTeamPanel members={[]} />);
    expect(screen.getByText('No care team recorded')).toBeInTheDocument();
  });
});
