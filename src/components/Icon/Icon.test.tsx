import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Spinner } from '../Spinner/Spinner';
import { Icon } from './Icon';

describe('Icon', () => {
  it('is decorative by default', () => {
    const { container } = render(<Icon name="check" />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('width', '16');
  });
  it('is announced with a label', () => {
    render(<Icon name="alert" label="Critical" size={20} />);
    expect(screen.getByRole('img', { name: 'Critical' })).toHaveAttribute('width', '20');
  });
  it('lists its names', () => {
    expect(Icon.names).toContain('pill');
    expect(Icon.names.length).toBe(53);
  });
});

describe('Spinner', () => {
  it('has role status with a label', () => {
    render(<Spinner tone="ai" size="lg" label="Drafting" />);
    expect(screen.getByRole('status', { name: 'Drafting' })).toHaveClass('co-spin-lg', 'co-spin-ai');
  });
});
