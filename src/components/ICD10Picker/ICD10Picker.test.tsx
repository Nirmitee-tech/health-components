import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ICD10Picker } from './ICD10Picker';

const options = [
  { code: 'F41.1', label: 'Generalized anxiety disorder' },
  { code: 'F41.9', label: 'Anxiety disorder, unspecified' },
  { code: 'E11.9', label: 'Type 2 diabetes mellitus without complications' },
];

describe('ICD10Picker', () => {
  it('uses the default label and searches by words', async () => {
    const onSelect = vi.fn();
    render(<ICD10Picker options={options} onSelect={onSelect} />);
    const input = screen.getByRole('combobox', { name: 'Diagnosis (ICD-10-CM)' });
    await userEvent.type(input, 'diab');
    await userEvent.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith(options[2]);
    expect(input).toHaveValue('E11.9 Type 2 diabetes mellitus without complications');
  });

  it('shows the empty text when nothing matches', () => {
    render(<ICD10Picker options={options} defaultQuery="zzz" defaultOpen />);
    expect(screen.getByText('No ICD-10 code matches. Try fewer words.')).toBeInTheDocument();
  });

  it('selects a favourite chip', async () => {
    const onSelect = vi.fn();
    render(<ICD10Picker options={options} favorites={[{ code: 'F41.1', short: 'GAD' }]} onSelect={onSelect} />);
    const chip = screen.getByRole('button', { name: 'F41.1 GAD' });
    expect(chip).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(chip);
    expect(onSelect).toHaveBeenCalledWith(options[0]);
    expect(chip).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('combobox')).toHaveValue('F41.1 Generalized anxiety disorder');
    expect(screen.getByRole('group', { name: 'Favorites:' })).toBeInTheDocument();
  });
});
