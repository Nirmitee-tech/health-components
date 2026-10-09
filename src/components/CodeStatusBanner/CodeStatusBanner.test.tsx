import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CodeStatusBanner, isLimitedCodeStatus } from './CodeStatusBanner';

describe('CodeStatusBanner', () => {
  it('is a red alert for DNR with directive, POLST and proxy', () => {
    render(<CodeStatusBanner status="DNR / DNI" directive="Living will on file" polst="03/02/2026" proxy="Maria Edwards (wife)" />);
    const el = screen.getByRole('alert');
    expect(el).toHaveClass('co-codestatus', 'is-dnr');
    expect(el).toHaveTextContent('Code status: DNR / DNI');
    expect(el).toHaveTextContent(
      'Advance directive: Living will on file . POLST signed 03/02/2026 . Health care proxy: Maria Edwards (wife)'
    );
  });

  it('is a green status for Full Code with no directive', async () => {
    const onViewDocuments = vi.fn();
    render(<CodeStatusBanner status="Full Code" onViewDocuments={onViewDocuments} />);
    const el = screen.getByRole('status');
    expect(el).toHaveClass('is-full');
    expect(el).toHaveTextContent('No advance directive on file');
    await userEvent.click(screen.getByRole('button', { name: 'View Documents' }));
    expect(onViewDocuments).toHaveBeenCalled();
  });

  it('detects limited statuses', () => {
    expect(isLimitedCodeStatus('Comfort care only')).toBe(true);
    expect(isLimitedCodeStatus('Full Code')).toBe(false);
  });
});
