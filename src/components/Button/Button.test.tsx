import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders a secondary button by default', () => {
    render(<Button>Save Claim</Button>);
    const btn = screen.getByRole('button', { name: 'Save Claim' });
    expect(btn).toHaveClass('co-btn', 'co-btn-sec');
    expect(btn).toHaveAttribute('type', 'button');
  });

  it('applies variant and size classes', () => {
    render(
      <Button variant="primary" size="lg">
        Check In
      </Button>
    );
    expect(screen.getByRole('button')).toHaveClass('co-btn-pri', 'co-btn-lg');
  });

  it('calls onClick', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Submit</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled and busy while loading, keeping its label', async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Checking Coverage
      </Button>
    );
    const btn = screen.getByRole('button', { name: /Checking Coverage/ });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status', { name: 'Working' })).toBeInTheDocument();
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('sets aria-pressed only for toggles', () => {
    const { rerender } = render(<Button>Day</Button>);
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-pressed');
    rerender(<Button pressed>Day</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders a link when href is set', () => {
    render(
      <Button href="/claims" target="_blank">
        Open Claims
      </Button>
    );
    const link = screen.getByRole('link', { name: 'Open Claims' });
    expect(link).toHaveAttribute('href', '/claims');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('forwards refs and native attributes', () => {
    const ref = createRef<HTMLButtonElement | HTMLAnchorElement>();
    render(
      <Button ref={ref} data-testid="b" type="submit">
        Save
      </Button>
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(screen.getByTestId('b')).toHaveAttribute('type', 'submit');
  });
});
