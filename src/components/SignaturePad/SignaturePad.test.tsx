import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SignaturePad } from './SignaturePad';

describe('SignaturePad', () => {
  it('signs on tap and clears', async () => {
    const onSign = vi.fn();
    const onClear = vi.fn();
    render(<SignaturePad label="Patient Signature" name="Henna West" onSign={onSign} onClear={onClear} />);
    const pad = screen.getByRole('button', { name: 'Patient Signature: Tap to sign as Henna West' });
    expect(pad).toHaveAccessibleDescription('By signing you agree to the consent above.');
    await userEvent.click(pad);
    expect(onSign).toHaveBeenCalledTimes(1);
    expect(pad).toHaveClass('is-signed');
    expect(pad).toHaveAccessibleName('Patient Signature: Signed by Henna West. Clear to sign again');
    expect(screen.getByText(/^Signed \d{2}\/\d{2}\/\d{4}/)).toBeInTheDocument();
    await userEvent.click(pad);
    expect(onSign).toHaveBeenCalledTimes(1);
    await userEvent.click(screen.getByRole('button', { name: 'Clear patient signature' }));
    expect(onClear).toHaveBeenCalled();
    expect(pad).not.toHaveClass('is-signed');
  });

  it('shows the signed stamp and errors', () => {
    render(<SignaturePad name="Henna West" defaultSigned when="10/09/2026 10:42 AM" error="Required" compact />);
    expect(screen.getByText('Signed 10/09/2026 10:42 AM')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
    expect(screen.getByRole('button', { name: /Signature: Signed by Henna West/ })).toHaveClass(
      'co-sigpad-sm',
      'is-bad'
    );
  });

  it('can be controlled', async () => {
    const onSignedChange = vi.fn();
    render(<SignaturePad signed={false} onSignedChange={onSignedChange} />);
    await userEvent.click(screen.getByRole('button', { name: /Tap to sign as patient/ }));
    expect(onSignedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('button')).not.toHaveClass('is-signed');
  });
});
