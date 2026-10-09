import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { TextArea } from './TextArea';

describe('TextArea', () => {
  it('renders a labelled textarea with default rows', () => {
    render(<TextArea label="Reason for Visit" required />);
    const ta = screen.getByRole('textbox', { name: /Reason for Visit/ });
    expect(ta).toHaveAttribute('rows', '3');
    expect(ta).toHaveClass('co-inp', 'co-ta');
    expect(ta).toHaveAttribute('aria-required', 'true');
  });

  it('counts characters and calls onChange', async () => {
    const onChange = vi.fn();
    render(<TextArea label="Message" maxLength={20} defaultValue="Hi" onChange={onChange} />);
    expect(screen.getByText('2 / 20')).toHaveAttribute('aria-live', 'polite');
    await userEvent.type(screen.getByRole('textbox'), ' there');
    expect(screen.getByText('8 / 20')).toBeInTheDocument();
    expect(onChange).toHaveBeenLastCalledWith('Hi there', expect.anything());
  });

  it('shows error and read-only lock', () => {
    const { rerender } = render(<TextArea label="Appeal" error="Reason is required" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Reason is required');
    rerender(<TextArea label="Appeal" readOnly lockMessage="Signed notes are locked" />);
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Signed notes are locked');
  });

  it('forwards refs and className', () => {
    const ref = createRef<HTMLTextAreaElement>();
    const { container } = render(<TextArea ref={ref} label="Note" className="x" />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    expect(container.firstChild).toHaveClass('co-field', 'x');
  });
});
