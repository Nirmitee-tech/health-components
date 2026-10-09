import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { BradenScore, bradenBand } from './BradenScore';

describe('BradenScore', () => {
  it('totals the subscales (1 to 4 points each)', () => {
    render(<BradenScore defaultValues={{ sensory: 0, moisture: 1, activity: 0, mobility: 0, nutrition: 1, friction: 0 }} />);
    const s = screen.getByRole('status');
    expect(s).toHaveTextContent('8');
    expect(s).toHaveTextContent('pts of 23');
    expect(s).toHaveTextContent('Very high risk');
    expect(s).toHaveTextContent('Total (6 to 23, lower is higher risk)');
  });

  it('updates the total when an answer changes', async () => {
    render(<BradenScore defaultValues={{ sensory: 3, moisture: 3, activity: 3, mobility: 3, nutrition: 2, friction: 2 }} />);
    expect(screen.getByRole('status')).toHaveTextContent('22');
    expect(screen.getByRole('status')).toHaveTextContent('No risk');
    await userEvent.click(within(screen.getByRole('radiogroup', { name: 'Moisture' })).getByRole('radio', { name: /Constantly moist/ }));
    expect(screen.getByRole('status')).toHaveTextContent('19');
    await userEvent.click(within(screen.getByRole('radiogroup', { name: 'Activity' })).getByRole('radio', { name: /Bedfast/ }));
    expect(screen.getByRole('status')).toHaveTextContent('16');
    expect(screen.getByRole('status')).toHaveTextContent('Mild risk');
  });

  it('is controllable', () => {
    render(<BradenScore values={{ sensory: 1, moisture: 1, activity: 1, mobility: 1, nutrition: 1, friction: 1 }} />);
    expect(screen.getByRole('status')).toHaveTextContent('12');
    expect(screen.getByRole('status')).toHaveTextContent('High risk');
  });

  it('bands', () => {
    expect(bradenBand(9).label).toBe('Very high risk');
    expect(bradenBand(12).label).toBe('High risk');
    expect(bradenBand(14).label).toBe('Moderate risk');
    expect(bradenBand(18).label).toBe('Mild risk');
    expect(bradenBand(19).label).toBe('No risk');
  });
});
