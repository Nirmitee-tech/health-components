import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { KioskStep } from './KioskStep';

describe('KioskStep', () => {
  it('renders header, heading and no Back on the first step', () => {
    render(<KioskStep step={1} total={6} stepName="Find appointment" title="Find your appointment" />);
    expect(screen.getByText('Valley Family Clinic')).toBeInTheDocument();
    expect(screen.getByText('Step 1 of 6 . Find appointment')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Find your appointment' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument();
  });

  it('calls onBack, onNext and onHelp', async () => {
    const onBack = vi.fn();
    const onNext = vi.fn();
    const onHelp = vi.fn();
    render(
      <KioskStep step={2} total={6} stepName="Confirm" title="Confirm" nextLabel="Yes, Continue" onBack={onBack} onNext={onNext} onHelp={onHelp} />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Back' }));
    await userEvent.click(screen.getByRole('button', { name: 'Yes, Continue' }));
    await userEvent.click(screen.getByRole('button', { name: 'I need help' }));
    expect(onBack).toHaveBeenCalled();
    expect(onNext).toHaveBeenCalled();
    expect(onHelp).toHaveBeenCalled();
  });

  it('disables the main button with nextDisabled', () => {
    render(<KioskStep step={1} total={6} stepName="Find" title="Find" nextDisabled />);
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
  });
});
