import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Combobox, type ComboboxOption } from './Combobox';

const patients: ComboboxOption[] = [
  { value: '1', label: 'Henna West', meta: 'MRN-100231' },
  { value: '2', label: 'Ralph Edwards', meta: 'MRN-100118', flag: 'DNR' },
  { value: '3', label: 'Nora Scott', meta: 'MRN-100377' },
];

describe('Combobox', () => {
  it('opens on focus and filters by label and meta', async () => {
    render(<Combobox label="Patient" kind="patient" options={patients} />);
    const input = screen.getByRole('combobox', { name: 'Patient' });
    expect(input).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(input);
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('option')).toHaveLength(3);
    await userEvent.type(input, '100118');
    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.getByRole('listbox', { name: 'Patient' })).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-controls', screen.getByRole('listbox').id);
  });

  it('moves the active option with arrows and picks with Enter', async () => {
    const onSelect = vi.fn();
    render(<Combobox label="Patient" options={patients} onSelect={onSelect} />);
    const input = screen.getByRole('combobox');
    await userEvent.click(input);
    const opts = screen.getAllByRole('option');
    expect(input).toHaveAttribute('aria-activedescendant', opts[0]!.id);
    await userEvent.keyboard('{ArrowDown}');
    expect(input).toHaveAttribute('aria-activedescendant', opts[1]!.id);
    expect(opts[1]).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowUp}{ArrowUp}');
    expect(input).toHaveAttribute('aria-activedescendant', screen.getAllByRole('option')[2]!.id);
    await userEvent.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith(patients[2]);
    expect(input).toHaveValue('Nora Scott');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('formats code picks and supports mouse choice', async () => {
    const onSelect = vi.fn();
    render(
      <Combobox
        label="Diagnosis"
        kind="code"
        options={[{ code: 'I10', label: 'Essential hypertension' }]}
        onSelect={onSelect}
      />
    );
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByText('I10')).toHaveClass('co-code');
    await userEvent.click(screen.getByRole('option'));
    expect(screen.getByRole('combobox')).toHaveValue('I10 Essential hypertension');
  });

  it('closes on Escape, then clears on a second Escape', async () => {
    render(<Combobox label="Patient" options={patients} defaultQuery="Hen" />);
    const input = screen.getByRole('combobox');
    await userEvent.click(input);
    await userEvent.keyboard('{Escape}');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    await userEvent.keyboard('{Escape}');
    expect(input).toHaveValue('');
  });

  it('shows the empty text and the footer', () => {
    render(
      <Combobox
        label="Payer"
        options={[{ label: 'Aetna' }]}
        defaultQuery="zz"
        defaultOpen
        emptyText="No payer matches."
        footer="Add a payer"
      />
    );
    expect(screen.getByRole('status')).toHaveTextContent('No payer matches.');
    expect(screen.getByText('Add a payer')).toHaveClass('co-menu-foot');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes on outside click', async () => {
    render(
      <div>
        <Combobox label="Patient" options={patients} defaultOpen />
        <p>outside</p>
      </div>
    );
    await userEvent.click(screen.getByText('outside'));
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
  });
});
