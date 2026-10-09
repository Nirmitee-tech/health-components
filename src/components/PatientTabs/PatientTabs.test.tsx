import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PatientTabs, type PatientTab } from './PatientTabs';

const tabs: PatientTab[] = [
  { id: 's', name: 'Schedule', icon: 'calendar', pinned: true },
  { id: 'p1', name: 'Henna West', meta: 'F 38' },
  { id: 'p2', name: 'Ralph Edwards', meta: 'M 74' },
];

describe('PatientTabs', () => {
  it('renders tabs in a tablist with the add button outside it', () => {
    render(<PatientTabs tabs={tabs} defaultActive="p1" />);
    const list = screen.getByRole('tablist', { name: 'Open patients' });
    expect(screen.getAllByRole('tab')).toHaveLength(3);
    expect(screen.getByRole('tab', { name: /Henna West/ })).toHaveAttribute('aria-selected', 'true');
    const add = screen.getByRole('button', { name: 'Open another patient' });
    expect(list.contains(add)).toBe(false);
    expect(screen.getByTitle('Close Henna West')).toBeInTheDocument();
    expect(screen.queryByTitle('Close Schedule')).not.toBeInTheDocument();
  });

  it('switches with click and arrows', async () => {
    const onChange = vi.fn();
    render(<PatientTabs tabs={tabs} onChange={onChange} />);
    await userEvent.click(screen.getByRole('tab', { name: /Henna West/ }));
    expect(onChange).toHaveBeenLastCalledWith('p1');
    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith('p2');
    expect(screen.getByRole('tab', { name: /Ralph Edwards/ })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith('s');
  });

  it('closes with the x button and Delete, moving to a neighbour', async () => {
    const onClose = vi.fn();
    render(<PatientTabs tabs={tabs} defaultActive="p1" onClose={onClose} />);
    await userEvent.click(screen.getByTitle('Close Ralph Edwards'));
    expect(onClose).toHaveBeenLastCalledWith(tabs[2]);
    expect(screen.queryByRole('tab', { name: /Ralph Edwards/ })).not.toBeInTheDocument();
    screen.getByRole('tab', { name: /Henna West/ }).focus();
    await userEvent.keyboard('{Delete}');
    expect(screen.queryByRole('tab', { name: /Henna West/ })).not.toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Schedule/ })).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{Delete}');
    expect(screen.getByRole('tab', { name: /Schedule/ })).toBeInTheDocument();
  });

  it('calls onAdd', async () => {
    const onAdd = vi.fn();
    render(<PatientTabs tabs={tabs} onAdd={onAdd} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open another patient' }));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });
});
