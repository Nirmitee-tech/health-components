import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { DrugSearch, type DrugOption } from './DrugSearch';

const drugs: DrugOption[] = [
  { label: 'Oxycodone 5 mg tablet', form: 'Tablet', rxnorm: '1049621', coverage: 'Covered, prior auth', schedule: 'C-II' },
  { label: 'Omeprazole 20 mg capsule', form: 'Capsule', coverage: 'Covered, tier 1' },
];

describe('DrugSearch', () => {
  it('labels the field and shows form, RxNorm, coverage and schedule per result', async () => {
    render(<DrugSearch options={drugs} payer="Aetna PPO" />);
    const input = screen.getByRole('combobox', { name: 'Medication' });
    await userEvent.type(input, 'oxy');
    expect(screen.getByRole('option', { name: /Oxycodone 5 mg tablet/ })).toHaveTextContent(
      'Tablet . RxNorm 1049621 . Covered, prior auth'
    );
    expect(screen.getByText('C-II')).toBeInTheDocument();
    expect(screen.getByText('Formulary from Aetna PPO via Surescripts.')).toBeInTheDocument();
  });

  it('calls onSelect with the original drug', async () => {
    const onSelect = vi.fn();
    render(<DrugSearch options={drugs} onSelect={onSelect} />);
    await userEvent.type(screen.getByRole('combobox'), 'omep');
    await userEvent.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith(drugs[1]);
    expect(screen.getByRole('combobox')).toHaveValue('Omeprazole 20 mg capsule');
  });

  it('forwards the ref to the input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<DrugSearch ref={ref} options={drugs} label="Drug" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
