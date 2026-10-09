import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TelehealthCallFrame } from './TelehealthCallFrame';

describe('TelehealthCallFrame', () => {
  it('shows a live call with timer and End Visit', async () => {
    const onEnd = vi.fn();
    render(<TelehealthCallFrame remote="Nora Scott" elapsed="12:41" onEnd={onEnd} />);
    expect(screen.getByRole('group', { name: 'Video of Nora Scott' })).toBeInTheDocument();
    expect(screen.getByText('12:41')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'End Visit' }));
    expect(onEnd).toHaveBeenCalled();
  });

  it('shows the waiting room with Admit Patient', async () => {
    const onAdmit = vi.fn();
    render(<TelehealthCallFrame remote="Jacob Jones" state="waiting" onAdmit={onAdmit} />);
    expect(screen.getByText('Jacob Jones is in the waiting room')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Admit Patient' }));
    expect(onAdmit).toHaveBeenCalled();
  });

  it('warns on a weak connection', () => {
    render(<TelehealthCallFrame remote="Nora Scott" state="poor" />);
    expect(screen.getByText(/Video paused to save bandwidth/)).toBeInTheDocument();
    expect(screen.getByText('Nora Scott . Weak connection')).toBeInTheDocument();
  });

  it('toggles mute and camera', async () => {
    const onMutedChange = vi.fn();
    render(<TelehealthCallFrame remote="Nora Scott" onMutedChange={onMutedChange} />);
    const mute = screen.getByRole('button', { name: 'Mute' });
    expect(mute).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(mute);
    expect(mute).toHaveAttribute('aria-pressed', 'true');
    expect(onMutedChange).toHaveBeenCalledWith(true);
    const cam = screen.getByRole('button', { name: 'Turn camera off' });
    await userEvent.click(cam);
    expect(cam).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows the consent and billing note', () => {
    render(<TelehealthCallFrame remote="Nora Scott" consent location="Home, Chicago IL" pos="02" />);
    expect(
      screen.getByText('Consent recorded. Patient location: Home, Chicago IL. Bill with POS 02 and modifier 95.')
    ).toBeInTheDocument();
  });
});
