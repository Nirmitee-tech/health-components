import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { AppointmentChip } from './AppointmentChip';

describe('AppointmentChip', () => {
  it('names the button with time, patient, type, status, telehealth and copay', () => {
    render(<AppointmentChip time="9:20" patient="Nora Scott" type="Therapy 50" status="Confirmed" telehealth paid={false} />);
    const chip = screen.getByRole('button', { name: '9:20, Nora Scott, Therapy 50, Confirmed, telehealth, copay due' });
    expect(chip).toHaveClass('co-ap', 'co-ap-s-Confirmed');
    expect(chip).toHaveAttribute('type', 'button');
  });

  it('uses the first word of the status for the class', () => {
    render(<AppointmentChip time="9:20" patient="Nora Scott" type="Therapy" status="In Room" />);
    expect(screen.getByRole('button')).toHaveClass('co-ap-s-In');
  });

  it('colours by type with a token stripe', () => {
    render(<AppointmentChip time="9:20" patient="Nora Scott" type="Therapy" status="Confirmed" colorBy="type" color="teal" />);
    const chip = screen.getByRole('button');
    expect(chip).not.toHaveClass('co-ap-s-Confirmed');
    expect(chip.style.borderLeftColor).toBe('var(--co-appt-teal)');
  });

  it('hides the type line when small', () => {
    const { container } = render(<AppointmentChip size="sm" time="9:20" patient="H. West" type="Follow-Up" />);
    expect(container.querySelector('.co-ap-t')).toBeNull();
    expect(screen.getByRole('button')).toHaveClass('co-ap-sm');
  });

  it('calls onClick and forwards refs', async () => {
    const onClick = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    render(<AppointmentChip ref={ref} onClick={onClick} time="9:20" patient="Nora Scott" type="Therapy" />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('exposes the type colours', () => {
    expect(AppointmentChip.colors).toContain('blue');
  });
});
