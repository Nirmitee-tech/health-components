import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ConsentSigner } from './ConsentSigner';

const base = {
  title: 'Consent for Telehealth Services',
  version: 'Version 3',
  body: 'I agree to receive care by video.',
  signer: 'Henna West',
};

describe('ConsentSigner', () => {
  it('shows the document as a focusable, named region', () => {
    render(<ConsentSigner {...base} />);
    const doc = screen.getByRole('document', { name: base.title });
    expect(doc).toHaveTextContent('I agree to receive care by video.');
    expect(doc).toHaveAttribute('tabindex', '0');
  });

  it('enables Sign Consent once agreed and signed', async () => {
    const onSignConsent = vi.fn();
    const onAgreedChange = vi.fn();
    render(<ConsentSigner {...base} onSignConsent={onSignConsent} onAgreedChange={onAgreedChange} />);
    const sign = screen.getByRole('button', { name: 'Sign Consent' });
    expect(sign).toBeDisabled();
    await userEvent.click(screen.getByRole('checkbox', { name: 'I have read and agree to this consent.' }));
    expect(onAgreedChange).toHaveBeenCalledWith(true);
    expect(sign).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: /Tap to sign as Henna West/ }));
    expect(sign).toBeEnabled();
    await userEvent.click(sign);
    expect(onSignConsent).toHaveBeenCalledWith({ signer: 'Henna West', guardian: undefined });
  });

  it('asks a guardian for the relationship', async () => {
    const onSignConsent = vi.fn();
    render(<ConsentSigner {...base} guardian="Mother" agreed signed onSignConsent={onSignConsent} />);
    const rel = screen.getByRole('textbox', { name: /Relationship to patient/ });
    expect(rel).toHaveValue('Mother');
    await userEvent.clear(rel);
    expect(screen.getByRole('button', { name: 'Sign Consent' })).toBeDisabled();
    await userEvent.type(rel, 'Father');
    await userEvent.click(screen.getByRole('button', { name: 'Sign Consent' }));
    expect(onSignConsent).toHaveBeenCalledWith({ signer: 'Henna West', guardian: 'Father' });
  });

  it('calls onDecline', async () => {
    const onDecline = vi.fn();
    render(<ConsentSigner {...base} onDecline={onDecline} />);
    await userEvent.click(screen.getByRole('button', { name: 'Decline' }));
    expect(onDecline).toHaveBeenCalled();
  });
});
