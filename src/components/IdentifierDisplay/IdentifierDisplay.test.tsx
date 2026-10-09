import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { IdentifierDisplay } from './IdentifierDisplay';

describe('IdentifierDisplay', () => {
  it('masks an SSN by default and announces the last four', () => {
    render(<IdentifierDisplay type="ssn" value="123456789" />);
    expect(screen.getByText('•••-••-6789')).toBeInTheDocument();
    expect(screen.getByText('SSN ending 6789')).toHaveClass('co-cv-sr');
    expect(screen.queryByText('123-45-6789')).not.toBeInTheDocument();
  });

  it('reveals and hides, calling onReveal only when revealing', async () => {
    const onReveal = vi.fn();
    render(<IdentifierDisplay type="ssn" value="123456789" revealable onReveal={onReveal} />);
    await userEvent.click(screen.getByRole('button', { name: 'Show SSN' }));
    expect(screen.getByText('123-45-6789')).toBeInTheDocument();
    expect(onReveal).toHaveBeenCalledTimes(1);
    await userEvent.click(screen.getByRole('button', { name: 'Hide SSN' }));
    expect(screen.getByText('•••-••-6789')).toBeInTheDocument();
    expect(onReveal).toHaveBeenCalledTimes(1);
  });

  it('warns when a check digit fails', () => {
    const { rerender } = render(<IdentifierDisplay type="npi" value="1234567890" />);
    expect(screen.getByText('Check digit fails')).toBeInTheDocument();
    rerender(<IdentifierDisplay type="npi" value="1234567893" />);
    expect(screen.queryByText('Check digit fails')).not.toBeInTheDocument();
  });

  it('copies the full value without spaces', async () => {
    const writeText = vi.fn(() => Promise.resolve());
    const user = userEvent.setup();
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<IdentifierDisplay type="member" value="XQK 1234 56789" />);
    await user.click(screen.getByRole('button', { name: 'Copy Member ID' }));
    expect(writeText).toHaveBeenCalledWith('XQK123456789');
    await act(async () => {});
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
  });

  it('hides label and copy button on request', () => {
    render(<IdentifierDisplay type="mrn" value="MRN-0048213" showLabel={false} copyable={false} />);
    expect(screen.queryByText('MRN')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('MRN-0048213')).toBeInTheDocument();
  });
});
