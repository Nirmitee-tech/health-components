import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('toggles uncontrolled and calls onChange with the event', async () => {
    const onChange = vi.fn();
    render(<Checkbox label="Send reminder by SMS" onChange={onChange} />);
    const box = screen.getByRole('checkbox', { name: 'Send reminder by SMS' });
    expect(box).not.toBeChecked();
    await userEvent.click(screen.getByText('Send reminder by SMS'));
    expect(box).toBeChecked();
    expect(onChange.mock.calls[0]![0].target.checked).toBe(true);
  });

  it('respects controlled checked', async () => {
    render(<Checkbox label="SMS" checked={false} onChange={() => {}} />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('sets the indeterminate property', () => {
    const { rerender } = render(<Checkbox label="Select all" indeterminate />);
    expect((screen.getByRole('checkbox') as HTMLInputElement).indeterminate).toBe(true);
    rerender(<Checkbox label="Select all" />);
    expect((screen.getByRole('checkbox') as HTMLInputElement).indeterminate).toBe(false);
  });

  it('marks disabled and invalid', () => {
    render(<Checkbox label="Override" disabled error />);
    const box = screen.getByRole('checkbox');
    expect(box).toBeDisabled();
    expect(box).toHaveAttribute('aria-invalid', 'true');
    expect(box.closest('label')).toHaveClass('is-dis');
  });

  it('forwards refs and native attributes', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox ref={ref} label="SMS" name="sms" data-testid="c" />);
    expect(ref.current).toBe(screen.getByTestId('c'));
    expect(ref.current).toHaveAttribute('name', 'sms');
  });
});
