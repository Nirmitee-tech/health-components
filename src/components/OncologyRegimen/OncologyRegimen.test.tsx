import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { OncologyRegimen, bsaMosteller, holdReasons, type OncologyRegimenDef, type RegimenCycle } from './OncologyRegimen';

const folfox: OncologyRegimenDef = {
  name: 'mFOLFOX6',
  cycleDays: 14,
  cycles: 12,
  hold: { anc: 1.5, plt: 75 },
  drugs: [
    { name: 'Oxaliplatin', route: 'IV', days: 'D1', mgm2: 85 },
    { name: 'Pegfilgrastim', route: 'SC', days: 'D2', flat: 6 },
  ],
};
const cycles = (labs: RegimenCycle['labs'], reduction?: number): RegimenCycle[] => [
  { n: 1, date: '09/07', status: 'given' },
  { n: 2, date: '10/09', status: 'current', reduction, labsDate: '10/08', labs },
];

describe('OncologyRegimen', () => {
  it('computes Mosteller BSA to 0.01 m²', () => {
    expect(bsaMosteller(172, 68.5)).toBe(1.81);
    expect(bsaMosteller(183, 112)).toBe(2.39);
  });

  it('lists hold reasons from the regimen rules', () => {
    expect(holdReasons({ anc: 2.1, plt: 142 }, { anc: 1.5, plt: 75 })).toEqual([]);
    expect(holdReasons({ anc: 0.9, plt: 68, cr: 1.31 }, { anc: 1.5, plt: 75 })).toEqual([
      'ANC below 1.5 ×10⁹/L',
      'Platelets below 75 ×10⁹/L',
    ]);
    expect(holdReasons({ cr: 1.6 }, { cr: 1.5 })).toEqual(['Creatinine above 1.50 mg/dL']);
    expect(holdReasons({ anc: 1.5, plt: 100 })).toEqual([]); // edges are not below
    expect(holdReasons(undefined)).toEqual([]);
  });

  it('doses by BSA with the cycle reduction', () => {
    render(<OncologyRegimen regimen={folfox} patient={{ heightCm: 172, weightKg: 68.5 }} cycles={cycles({ anc: 2.1, plt: 142 }, 20)} />);
    const table = screen.getByRole('table', { name: 'Doses for cycle 2' });
    const [, oxa, peg] = within(table).getAllByRole('row');
    // 85 x 1.81 = 153.85 mg, shown 153.9 mg; 20% less = 123.08, shown 123.1 mg.
    expect(within(oxa!).getByText('153.9 mg')).toBeInTheDocument();
    expect(within(oxa!).getByText('−20 %')).toBeInTheDocument();
    expect(within(oxa!).getByText('123.1 mg')).toBeInTheDocument();
    expect(within(peg!).getAllByText('6 mg').length).toBe(2);
    expect(within(peg!).getByText('4.8 mg')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Release to Pharmacy' })).toBeEnabled();
  });

  it('blocks release when hold criteria are met', () => {
    render(<OncologyRegimen regimen={folfox} patient={{ heightCm: 172, weightKg: 66.1 }} cycles={cycles({ anc: 0.9, plt: 68 })} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Hold criteria met for cycle 2');
    expect(screen.getByRole('alert')).toHaveTextContent('ANC below 1.5 ×10⁹/L; Platelets below 75 ×10⁹/L.');
    expect(screen.getByRole('button', { name: 'Release to Pharmacy' })).toBeDisabled();
  });

  it('caps BSA and shows cumulative dose', () => {
    render(
      <OncologyRegimen
        readOnly
        regimen={{ ...folfox, bsaCap: 2, drugs: [{ name: 'Doxorubicin', route: 'IV', days: 'D1', mgm2: 60 }] }}
        patient={{ heightCm: 183, weightKg: 112 }}
        cumulative={[{ drug: 'doxorubicin', given: 380, limit: 450 }]}
      />
    );
    expect(screen.getByText('Capped at 2.00 m²')).toBeInTheDocument();
    expect(within(screen.getByRole('table')).getAllByText('120 mg').length).toBe(2);
    expect(screen.getByText('380 mg/m² of 450 mg/m² (84%)')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Release to Pharmacy' })).toBeNull();
  });

  it('lists cycles with their status', () => {
    render(<OncologyRegimen regimen={folfox} patient={{ heightCm: 172, weightKg: 68.5 }} cycles={cycles({ anc: 2 })} />);
    const items = within(screen.getByRole('list', { name: 'Cycles' })).getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('Given');
    expect(items[1]).toHaveTextContent('Due today');
  });
});
