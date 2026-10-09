import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CPTPicker } from './CPTPicker';

const options = [
  { code: '99214', label: 'Office visit, moderate' },
  { code: '90837', label: 'Psychotherapy, 60 min' },
];

describe('CPTPicker', () => {
  it('adds a line from the search and clears the query', async () => {
    const onChange = vi.fn();
    render(<CPTPicker options={options} onChange={onChange} />);
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    const input = screen.getByRole('combobox', { name: 'Procedure (CPT / HCPCS)' });
    await userEvent.type(input, '9921');
    await userEvent.keyboard('{Enter}');
    expect(onChange).toHaveBeenLastCalledWith([{ code: '99214', label: 'Office visit, moderate', mods: '', units: 1 }]);
    expect(input).toHaveValue('');
    const row = screen.getByRole('row', { name: /99214/ });
    expect(within(row).getByRole('textbox', { name: 'Units for 99214' })).toHaveValue('1');
    expect(within(row).getByRole('textbox', { name: 'Diagnosis pointer for 99214' })).toHaveValue('A');
  });

  it('edits modifiers and units and removes lines', async () => {
    const onChange = vi.fn();
    render(<CPTPicker options={options} lines={[{ code: '90837', label: 'Psychotherapy, 60 min', units: 1 }]} onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox', { name: 'Modifiers for 90837' }), '95');
    expect(onChange).toHaveBeenLastCalledWith([{ code: '90837', label: 'Psychotherapy, 60 min', units: 1, mods: '95' }]);
    const units = screen.getByRole('textbox', { name: 'Units for 90837' });
    await userEvent.clear(units);
    await userEvent.type(units, '2x');
    expect(units).toHaveValue('2');
    await userEvent.click(screen.getByRole('button', { name: 'Remove 90837' }));
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it('shows the telehealth reminder', () => {
    render(<CPTPicker options={options} telehealth />);
    expect(screen.getByText('Telehealth: add modifier 95 to each E/M or psychotherapy line.')).toBeInTheDocument();
  });
});
