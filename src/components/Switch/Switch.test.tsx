import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from './Switch';

describe('Switch', () => {
  it('is a labelled switch that toggles', async () => {
    const onChange = vi.fn();
    render(<Switch label="Allow online booking" description="Patients book from the portal." onChange={onChange} />);
    const sw = screen.getByRole('switch', { name: 'Allow online booking' });
    expect(sw).toHaveAccessibleDescription('Patients book from the portal.');
    expect(sw).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(sw);
    expect(sw).toHaveAttribute('aria-checked', 'true');
    expect(sw).toHaveClass('is-on');
    expect(onChange).toHaveBeenCalledWith(true);
    await userEvent.keyboard(' ');
    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it('stays on the controlled value', async () => {
    const onChange = vi.fn();
    render(<Switch label="Reminders" checked onChange={onChange} />);
    await userEvent.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('does not toggle when disabled and forwards refs', async () => {
    const ref = createRef<HTMLButtonElement>();
    const onChange = vi.fn();
    render(<Switch ref={ref} label="Brand colour" disabled onChange={onChange} />);
    await userEvent.click(screen.getByRole('switch'));
    expect(onChange).not.toHaveBeenCalled();
    expect(ref.current).toBe(screen.getByRole('switch'));
  });
});
