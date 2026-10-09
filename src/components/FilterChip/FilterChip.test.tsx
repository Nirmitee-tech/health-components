import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FilterChip } from './FilterChip';

describe('FilterChip', () => {
  it('toggles aria-pressed and shows the check when on', async () => {
    const onChange = vi.fn();
    const { container } = render(
      <FilterChip count={12} onChange={onChange}>
        Rejected
      </FilterChip>
    );
    const chip = screen.getByRole('button', { name: /Rejected/ });
    expect(chip).toHaveAttribute('aria-pressed', 'false');
    expect(container.querySelector('.co-icon')).toBeNull();
    await userEvent.click(chip);
    expect(chip).toHaveAttribute('aria-pressed', 'true');
    expect(chip).toHaveClass('is-on');
    expect(container.querySelector('.co-icon')).not.toBeNull();
    expect(onChange).toHaveBeenCalledWith(true);
    expect(chip).toHaveTextContent('12');
  });

  it('hides the check with check={false}', () => {
    const { container } = render(
      <FilterChip defaultSelected check={false}>
        Aetna
      </FilterChip>
    );
    expect(container.querySelector('.co-icon')).toBeNull();
  });

  it('renders a removable chip', async () => {
    const onRemove = vi.fn();
    render(<FilterChip onRemove={onRemove}>Payer: BCBS IL</FilterChip>);
    await userEvent.click(screen.getByRole('button', { name: 'Remove filter Payer: BCBS IL' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('stays on the controlled value', async () => {
    render(
      <FilterChip selected={false} onChange={() => {}}>
        Aetna
      </FilterChip>
    );
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });
});
