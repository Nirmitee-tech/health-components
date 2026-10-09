import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PinEntry } from './PinEntry';

describe('PinEntry', () => {
  it('fills dots and completes', async () => {
    const onComplete = vi.fn();
    const onChange = vi.fn();
    render(<PinEntry label="Enter your PIN" onComplete={onComplete} onChange={onChange} />);
    expect(screen.getByRole('status')).toHaveAccessibleName('0 of 4 digits entered');
    for (const k of ['4', '8', '2']) await userEvent.click(screen.getByRole('button', { name: k }));
    expect(screen.getByRole('status')).toHaveAccessibleName('3 of 4 digits entered');
    await userEvent.click(screen.getByRole('button', { name: 'Delete last digit' }));
    expect(onChange).toHaveBeenLastCalledWith('48');
    await userEvent.click(screen.getByRole('button', { name: '2' }));
    await userEvent.click(screen.getByRole('button', { name: '1' }));
    expect(onComplete).toHaveBeenCalledWith('4821');
    await userEvent.click(screen.getByRole('button', { name: '9' }));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('accepts a hardware keyboard', async () => {
    const onComplete = vi.fn();
    render(<PinEntry length={6} onComplete={onComplete} />);
    screen.getByRole('button', { name: '1' }).focus();
    await userEvent.keyboard('12345{Backspace}56');
    expect(onComplete).toHaveBeenCalledWith('123456');
  });

  it('shows biometric, error and locked states', async () => {
    const onBiometric = vi.fn();
    const { rerender } = render(
      <PinEntry biometric onBiometric={onBiometric} error="Wrong PIN. 2 tries left." defaultValue="12" />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Face ID' }));
    expect(onBiometric).toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('Wrong PIN. 2 tries left.');
    rerender(<PinEntry locked />);
    expect(screen.getByRole('button', { name: '1' })).toBeDisabled();
    expect(screen.getByText('Too many tries. Sign in with your password.')).toBeInTheDocument();
  });
});
