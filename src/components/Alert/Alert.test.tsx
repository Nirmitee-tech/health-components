import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Alert } from './Alert';

describe('Alert', () => {
  it('uses role status for info and role alert for error, denied and btg', () => {
    const { rerender } = render(<Alert title="Eligibility checked">Aetna PPO active.</Alert>);
    expect(screen.getByRole('status')).toHaveClass('co-alert', 'co-alert-info');
    for (const tone of ['error', 'denied', 'btg'] as const) {
      rerender(<Alert tone={tone}>x</Alert>);
      expect(screen.getByRole('alert')).toHaveClass(`co-alert-${tone}`);
    }
  });

  it('renders title, body, actions and dismiss', async () => {
    const onDismiss = vi.fn();
    render(
      <Alert tone="warning" title="Prior authorization expires in 6 days" actions={<button>Request Extension</button>} onDismiss={onDismiss}>
        PA-2026-11873
      </Alert>
    );
    expect(screen.getByText('Prior authorization expires in 6 days').tagName).toBe('B');
    expect(screen.getByRole('button', { name: 'Request Extension' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
