import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('links the trigger with aria-describedby and shows on focus and hover', async () => {
    render(
      <Tooltip label="Print chart">
        <button type="button" aria-describedby="other">
          Print
        </button>
      </Tooltip>
    );
    const btn = screen.getByRole('button', { name: 'Print' });
    const tip = screen.getByRole('tooltip', { hidden: true });
    expect(btn.getAttribute('aria-describedby')).toBe(`other ${tip.id}`);
    expect(tip).not.toHaveClass('is-open');
    await userEvent.tab();
    expect(tip).toHaveClass('is-open', 'co-tip-top');
    await userEvent.keyboard('{Escape}');
    expect(tip).not.toHaveClass('is-open');
    await userEvent.tab();
    await userEvent.hover(btn);
    expect(tip).toHaveClass('is-open');
    await userEvent.unhover(btn);
    expect(tip).not.toHaveClass('is-open');
  });

  it('stays open when forced', () => {
    render(
      <Tooltip label="POS 11" placement="right" open>
        <button type="button">POS</button>
      </Tooltip>
    );
    expect(screen.getByRole('tooltip')).toHaveClass('is-open', 'co-tip-right');
  });
});
