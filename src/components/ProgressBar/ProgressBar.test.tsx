import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('shows units in words and as aria values', () => {
    render(<ProgressBar label="PA units used" value={12} max={20} unit="visits" meter />);
    const bar = screen.getByRole('meter', { name: 'PA units used' });
    expect(bar).toHaveAttribute('aria-valuenow', '12');
    expect(bar).toHaveAttribute('aria-valuemax', '20');
    expect(bar).toHaveAttribute('aria-valuetext', '12 of 20 visits');
    expect(screen.getByText('12 of 20 visits used')).toBeInTheDocument();
  });

  it('picks the tone from thresholds and clamps the value', () => {
    const { container, rerender } = render(<ProgressBar label="Used" value={16} max={20} thresholds={[75, 90]} />);
    expect(container.querySelector('.co-bar-warning')).not.toBeNull();
    rerender(<ProgressBar label="Used" value={30} max={20} thresholds={[75, 90]} />);
    expect(container.querySelector('.co-bar-danger')).toHaveStyle({ width: '100%' });
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '20');
  });

  it('compact hides the header', () => {
    render(<ProgressBar label="Import" value={50} compact />);
    expect(screen.queryByText('50%')).toBeNull();
    expect(screen.getByRole('progressbar', { name: 'Import' })).toHaveAttribute('aria-valuetext', '50%');
  });
});
