import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { QualityMeasureCard, measureRate } from './QualityMeasureCard';

const bp = { name: 'Controlling High Blood Pressure', id: 'CMS165v12', period: 'Jan to Sep 2026', numerator: 412, denominator: 560, exclusions: 18, target: 70 };

describe('QualityMeasureCard', () => {
  it('computes the rate and compares it with the target', () => {
    expect(measureRate(bp)).toBe(73.6);
    expect(measureRate({ numerator: 1, denominator: 0 })).toBe(0);
    render(<QualityMeasureCard measure={bp} />);
    expect(screen.getByText('73.6%')).toBeInTheDocument();
    expect(screen.getByText('Meets target 70%')).toBeInTheDocument();
    expect(screen.getByText(/412 of 560 patients, 18 excluded/)).toBeInTheDocument();
  });

  it('treats inverse measures as lower is better and counts their numerator as gaps', async () => {
    const onViewGaps = vi.fn();
    const m = { name: 'A1c Poor Control', id: 'CMS122v12', period: '2026', numerator: 31, denominator: 240, target: 15, inverse: true };
    render(<QualityMeasureCard measure={m} onViewGaps={onViewGaps} />);
    expect(screen.getByText('Meets target 15% (lower is better)')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'View 31 patients with gaps' }));
    expect(onViewGaps).toHaveBeenCalledWith(m);
  });
});
