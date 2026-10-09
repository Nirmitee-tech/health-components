import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DentalChart, toothKind, toothLabel, type DentalPlanItem } from './DentalChart';

const plan: DentalPlanItem[] = [
  { phase: 1, tooth: 3, surface: 'MO', cdt: 'D2392', desc: 'Resin composite, 2 surfaces, posterior', status: 'scheduled', fee: 245, insurance: 196 },
  { phase: 2, tooth: 19, cdt: 'D2740', desc: 'Crown, porcelain/ceramic', status: 'planned', fee: 1250, insurance: 625 },
  { phase: 2, tooth: 4, cdt: 'D2391', desc: 'Resin composite, 1 surface, posterior', status: 'declined', fee: 190, insurance: 152 },
  { phase: 0, tooth: null, cdt: 'D1110', desc: 'Prophylaxis, adult', status: 'completed', fee: 115, insurance: 115 },
];

describe('DentalChart', () => {
  it('names teeth by type and findings', () => {
    expect([1, 4, 6, 8, 9, 11, 13, 16, 17, 22, 24, 32].map(toothKind)).toEqual([
      'Molar', 'Premolar', 'Canine', 'Incisor', 'Incisor', 'Canine', 'Premolar', 'Molar', 'Molar', 'Canine', 'Incisor', 'Molar',
    ]);
    expect(toothLabel(3, { surfaces: { O: 'caries', M: 'caries' } })).toBe('Tooth 3, Molar, O Caries, M Caries');
    expect(toothLabel(19, { whole: 'rct' })).toBe('Tooth 19, Molar, Root canal');
  });

  it('renders 32 tooth buttons in two arches', () => {
    render(<DentalChart teeth={{ 3: { surfaces: { O: 'caries' } } }} />);
    expect(within(screen.getByRole('group', { name: 'Maxillary arch, teeth 1 to 16' })).getAllByRole('button')).toHaveLength(16);
    expect(within(screen.getByRole('group', { name: 'Mandibular arch, teeth 32 to 17' })).getAllByRole('button')).toHaveLength(16);
    expect(screen.getByRole('button', { name: 'Tooth 3, Molar, O Caries' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('selects and deselects a tooth and shows its findings and procedures', async () => {
    const onSelectedChange = vi.fn();
    render(<DentalChart teeth={{ 19: { whole: 'rct', note: 'RCT 2023, needs crown' } }} plan={plan} onSelectedChange={onSelectedChange} />);
    const t19 = screen.getByRole('button', { name: 'Tooth 19, Molar, Root canal' });
    await userEvent.click(t19);
    expect(t19).toHaveAttribute('aria-pressed', 'true');
    expect(onSelectedChange).toHaveBeenLastCalledWith(19);
    expect(screen.getByText('Tooth 19 . Molar')).toBeInTheDocument();
    expect(screen.getByText('Root canal . RCT 2023, needs crown')).toBeInTheDocument();
    await userEvent.click(t19);
    expect(t19).toHaveAttribute('aria-pressed', 'false');
    expect(onSelectedChange).toHaveBeenLastCalledWith(null);
    expect(screen.queryByText('Tooth 19 . Molar')).toBeNull();
  });

  it('starts from `selected` and reports teeth with no findings', () => {
    render(<DentalChart selected={5} />);
    expect(screen.getByText('No findings recorded')).toBeInTheDocument();
  });

  it('lists the plan with phase 0 kept and open totals that skip declined and completed work', () => {
    render(<DentalChart plan={plan} />);
    const rows = screen.getAllByRole('row');
    expect(within(rows[4]!).getAllByRole('cell')[0]).toHaveTextContent('0');
    expect(within(rows[4]!).getByText('Full mouth')).toBeInTheDocument();
    // Open = 245 + 1250 = 1495; insurance 196 + 625 = 821; patient 674.
    expect(screen.getByText('Open plan total', { exact: false })).toHaveTextContent('$1,495.00');
    expect(screen.getByText('Est. patient portion', { exact: false })).toHaveTextContent('$674.00');
  });

  it('shows an empty state and hides actions when read-only', () => {
    render(<DentalChart readOnly />);
    expect(screen.getByText('No treatment planned')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Add Procedure' })).toBeNull();
  });

  it('calls the actions', async () => {
    const onAddProcedure = vi.fn();
    render(<DentalChart onAddProcedure={onAddProcedure} />);
    await userEvent.click(screen.getByRole('button', { name: 'Add Procedure' }));
    expect(onAddProcedure).toHaveBeenCalled();
  });
});
