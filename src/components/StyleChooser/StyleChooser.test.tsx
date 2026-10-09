import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { StyleChooser } from './StyleChooser';

describe('StyleChooser', () => {
  it('defaults to the five CareOS themes with Classic previewed', () => {
    const { container } = render(<StyleChooser />);
    expect(screen.getByRole('radiogroup', { name: 'App style' })).toHaveClass('co-kpis');
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(5);
    expect(screen.getByRole('radio', { name: 'Preview Classic' })).toHaveAttribute('aria-checked', 'true');
    expect(container.querySelector('[data-co-theme="rail"].co-stc-sw')).not.toBeNull();
    screen.getAllByRole('button', { name: 'Apply to practice' }).forEach((b) => expect(b).toBeDisabled());
  });

  it('previews on click and calls onChange (uncontrolled)', async () => {
    const onChange = vi.fn();
    render(<StyleChooser onChange={onChange} />);
    await userEvent.click(screen.getByRole('radio', { name: 'Preview Focus Rail' }));
    expect(onChange).toHaveBeenCalledWith('rail');
    expect(screen.getByRole('radio', { name: 'Preview Focus Rail' })).toHaveAttribute('aria-checked', 'true');
  });

  it('respects a controlled value', async () => {
    const onChange = vi.fn();
    render(<StyleChooser value="dark" onChange={onChange} />);
    await userEvent.click(screen.getByRole('radio', { name: 'Preview Classic' }));
    expect(onChange).toHaveBeenCalledWith('classic');
    expect(screen.getByRole('radio', { name: 'Preview Dark' })).toHaveAttribute('aria-checked', 'true');
  });

  it('moves with arrow keys using a roving tab stop', async () => {
    const onChange = vi.fn();
    render(<StyleChooser onChange={onChange} />);
    const classic = screen.getByRole('radio', { name: 'Preview Classic' });
    expect(classic).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('radio', { name: 'Preview Dark' })).toHaveAttribute('tabindex', '-1');
    classic.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Preview Clinical Sidebar' })).toHaveFocus();
    expect(onChange).toHaveBeenLastCalledWith('sidebar');
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('radio', { name: 'Preview Dark' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(classic).toHaveFocus();
  });

  it('applies when allowed', async () => {
    const onApply = vi.fn();
    render(<StyleChooser canApply onApply={onApply} styles={[{ id: 'sidebar', name: 'Clinical Sidebar', who: 'most teams.', current: true }]} />);
    expect(screen.getByText('Practice setting')).toBeInTheDocument();
    const apply = screen.getByRole('button', { name: 'Apply to practice' });
    expect(apply).toHaveAccessibleDescription('Clinical Sidebar');
    await userEvent.click(apply);
    expect(onApply).toHaveBeenCalledWith('sidebar');
  });
});
