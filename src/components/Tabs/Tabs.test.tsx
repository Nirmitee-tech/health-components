import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Tabs, type TabItem } from './Tabs';

const items: TabItem[] = [
  { id: 'o', label: 'Overview' },
  { id: 'l', label: 'Lines', count: 3 },
  { id: 'e', label: 'ERA', disabled: true },
  { id: 'h', label: 'History', count: 2, alert: true },
];

describe('Tabs', () => {
  it('renders a labelled tablist with the first tab selected', () => {
    render(<Tabs label="Claim" items={items} />);
    expect(screen.getByRole('tablist', { name: 'Claim' })).toHaveClass('co-tabs');
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[0]).toHaveAttribute('tabindex', '0');
    expect(tabs[1]).toHaveAttribute('tabindex', '-1');
    expect(tabs[2]).toBeDisabled();
    expect(screen.getByText('2')).toHaveClass('co-tabn', 'is-alert');
  });

  it('pill variant and defaultValue', () => {
    render(<Tabs variant="pill" defaultValue="l" items={items} />);
    expect(screen.getByRole('tablist')).toHaveClass('co-ptabs');
    expect(screen.getByRole('tab', { name: /Lines/ })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: /Lines/ })).toHaveClass('co-ptab', 'is-on');
  });

  it('selects on click and with arrows, Home and End, skipping disabled tabs', async () => {
    const onChange = vi.fn();
    render(<Tabs items={items} onChange={onChange} />);
    await userEvent.click(screen.getByRole('tab', { name: /Lines/ }));
    expect(onChange).toHaveBeenLastCalledWith('l');
    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith('h');
    expect(screen.getByRole('tab', { name: /History/ })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith('o');
    await userEvent.keyboard('{End}');
    expect(onChange).toHaveBeenLastCalledWith('h');
    await userEvent.keyboard('{Home}{ArrowLeft}');
    expect(onChange).toHaveBeenLastCalledWith('h');
  });

  it('is controlled by value', async () => {
    const onChange = vi.fn();
    render(<Tabs items={items} value="o" onChange={onChange} id="t" />);
    await userEvent.click(screen.getByRole('tab', { name: /Lines/ }));
    expect(onChange).toHaveBeenCalledWith('l');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('id', 't-o');
  });
});
