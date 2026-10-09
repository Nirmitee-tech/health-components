import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Stepper } from './Stepper';

describe('Stepper', () => {
  it('renders an ordered list with states in screen-reader text', () => {
    render(<Stepper label="Add patient" steps={['Demographics', 'Contact', { label: 'Insurance', error: true }, 'Review']} current={1} />);
    const list = screen.getByRole('list', { name: 'Add patient' });
    expect(list).toHaveClass('co-stp');
    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveClass('is-done');
    expect(items[0]).toHaveTextContent('Demographics (done)');
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(items[1]).toHaveTextContent('Contact (current)');
    expect(items[2]).toHaveClass('is-error');
    expect(items[2]).toHaveTextContent('Insurance (has errors)');
    expect(items[3]).toHaveClass('is-todo');
  });

  it('renders the vertical variant', () => {
    render(<Stepper variant="vertical" steps={['Patient', 'Service']} />);
    expect(screen.getByRole('list', { name: 'Steps' })).toHaveClass('co-stp', 'co-stp-v');
  });

  it('renders segments as a progressbar', () => {
    const { container } = render(<Stepper variant="segments" count={5} current={1} label="Check-in progress" />);
    const bar = screen.getByRole('progressbar', { name: 'Check-in progress' });
    expect(bar).toHaveAttribute('aria-valuenow', '2');
    expect(bar).toHaveAttribute('aria-valuemax', '5');
    expect(bar).toHaveAttribute('aria-valuetext', 'Step 2 of 5');
    expect(container.querySelectorAll('.co-steps .is-on')).toHaveLength(2);
  });
});
