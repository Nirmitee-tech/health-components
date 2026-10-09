import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SegmentedControl } from './SegmentedControl';

describe('SegmentedControl', () => {
  it('is a radiogroup that defaults to the first option', () => {
    render(<SegmentedControl label="Calendar view" options={['Day', 'Week', 'Month']} />);
    expect(screen.getByRole('radiogroup', { name: 'Calendar view' })).toHaveClass('co-seg');
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('radio', { name: 'Week' })).toHaveAttribute('tabindex', '-1');
  });

  it('selects on click and calls onChange', async () => {
    const onChange = vi.fn();
    render(<SegmentedControl label="View" options={['Day', 'Week']} onChange={onChange} />);
    await userEvent.click(screen.getByRole('radio', { name: 'Week' }));
    expect(screen.getByRole('radio', { name: 'Week' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'Week' })).toHaveClass('is-on');
    expect(onChange).toHaveBeenCalledWith('Week');
  });

  it('moves with arrow keys, skipping disabled and wrapping', async () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl
        label="Queue"
        defaultValue="open"
        onChange={onChange}
        options={[
          { value: 'open', label: 'Open', count: 14 },
          { value: 'arch', label: 'Archived', disabled: true },
          { value: 'denied', label: 'Denied' },
        ]}
      />
    );
    screen.getByRole('radio', { name: /Open/ }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Denied' })).toHaveFocus();
    expect(onChange).toHaveBeenLastCalledWith('denied');
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: /Open/ })).toHaveAttribute('aria-checked', 'true');
    await userEvent.keyboard('{End}');
    expect(onChange).toHaveBeenLastCalledWith('denied');
  });

  it('stays on the controlled value', async () => {
    render(<SegmentedControl label="View" value="Day" options={['Day', 'Week']} onChange={() => {}} />);
    await userEvent.click(screen.getByRole('radio', { name: 'Week' }));
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute('aria-checked', 'true');
  });
});
