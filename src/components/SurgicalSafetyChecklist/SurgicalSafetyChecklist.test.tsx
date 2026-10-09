import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SURGICAL_SAFETY_PHASES, SurgicalSafetyChecklist } from './SurgicalSafetyChecklist';

const phase = (name: string) => screen.getByRole('region', { name });

async function checkAll(name: string) {
  for (const box of within(phase(name)).getAllByRole('checkbox')) await userEvent.click(box);
}

describe('SurgicalSafetyChecklist', () => {
  it('opens Sign In and locks the later phases', () => {
    render(<SurgicalSafetyChecklist />);
    expect(within(phase('Sign In')).getByText('0 of 7')).toBeInTheDocument();
    expect(within(phase('Time Out')).getByText('Locked')).toBeInTheDocument();
    expect(within(phase('Sign Out')).getByText('Locked')).toBeInTheDocument();
    within(phase('Time Out'))
      .getAllByRole('checkbox')
      .forEach((c) => expect(c).toBeDisabled());
  });

  it('enables Confirm only when every item is checked', async () => {
    render(<SurgicalSafetyChecklist />);
    const btn = within(phase('Sign In')).getByRole('button', { name: 'Confirm Sign In' });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAccessibleDescription('Check every item to confirm.');
    await checkAll('Sign In');
    expect(within(phase('Sign In')).getByText('7 of 7')).toBeInTheDocument();
    expect(btn).toBeEnabled();
  });

  it('runs Sign In, Time Out and Sign Out in order with the clock time', async () => {
    const onConfirm = vi.fn();
    render(<SurgicalSafetyChecklist clock="08:12" onConfirm={onConfirm} />);
    for (const k of ['signin', 'timeout', 'signout'] as const) {
      const title = SURGICAL_SAFETY_PHASES[k].title;
      await checkAll(title);
      await userEvent.click(within(phase(title)).getByRole('button', { name: 'Confirm ' + title }));
      expect(within(phase(title)).getByText('Confirmed 08:12')).toBeInTheDocument();
      expect(onConfirm).toHaveBeenLastCalledWith(k, '08:12');
    }
    expect(onConfirm).toHaveBeenCalledTimes(3);
    expect(screen.queryByRole('button', { name: /Confirm/ })).not.toBeInTheDocument();
  });

  it('starts from confirmed phases and checked items', () => {
    render(<SurgicalSafetyChecklist confirmed={{ signin: '07:52' }} defaultChecked={{ timeout0: true, timeout1: true }} />);
    expect(within(phase('Sign In')).getByText('Confirmed 07:52')).toBeInTheDocument();
    expect(within(phase('Time Out')).getByText('2 of 7')).toBeInTheDocument();
    expect(within(phase('Sign Out')).getByText('Locked')).toBeInTheDocument();
  });

  it('supports controlled checked items', async () => {
    const onCheckedChange = vi.fn();
    render(<SurgicalSafetyChecklist checked={{}} onCheckedChange={onCheckedChange} />);
    const first = within(phase('Sign In')).getAllByRole('checkbox')[0]!;
    await userEvent.click(first);
    expect(onCheckedChange).toHaveBeenCalledWith({ signin0: true });
    expect(first).not.toBeChecked();
  });

  it('shows the stop alert and has no actions when readOnly', () => {
    render(<SurgicalSafetyChecklist readOnly mismatch="Consent says RIGHT knee." />);
    expect(screen.getByText('Stop: site mismatch')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
