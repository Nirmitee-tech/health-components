import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ClaimStatusTag } from './ClaimStatusTag';

describe('ClaimStatusTag', () => {
  it('lists the eleven X12 statuses', () => {
    expect(ClaimStatusTag.statuses).toHaveLength(11);
    expect(ClaimStatusTag.statuses).toContain('Paid (835)');
  });

  it('renders tone, words and meaning', () => {
    render(<ClaimStatusTag status="Rejected (277CA)" />);
    const tag = screen.getByText('Rejected (277CA)');
    expect(tag).toHaveAttribute('title', 'Payer front end rejected the claim');
    expect(tag.className).toMatch(/danger|dng/);
  });

  it('falls back to neutral for unknown statuses', () => {
    render(<ClaimStatusTag status="On Hold" />);
    expect(screen.getByText('On Hold')).not.toHaveAttribute('title');
  });
});
