import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PediatricDosingCalculator, calcPedsDose, type PediatricDrug } from './PediatricDosingCalculator';

const ACET: PediatricDrug = {
  name: 'Acetaminophen',
  form: '160 mg/5 mL suspension',
  mgkg: 15,
  perDay: 5,
  freq: 'every 4 to 6 hours as needed, up to 5 doses a day',
  maxDose: 1000,
  maxDaily: 4000,
  conc: 32,
};
const IBU: PediatricDrug = {
  name: 'Ibuprofen',
  form: '100 mg/5 mL suspension',
  mgkg: 10,
  perDay: 4,
  freq: 'every 6 hours as needed',
  maxDose: 400,
  maxDaily: 1600,
  conc: 20,
};
const AMOX: PediatricDrug = {
  name: 'Amoxicillin',
  form: '400 mg/5 mL suspension',
  mgkg: 45,
  perDay: 2,
  freq: 'every 12 hours for 10 days',
  maxDose: 1000,
  maxDaily: 4000,
  conc: 80,
};
const DRUGS = [ACET, IBU, AMOX];

const calc = (weightKg: number | string, d: PediatricDrug) =>
  calcPedsDose({ weightKg, mgkg: d.mgkg, maxDose: d.maxDose, maxDaily: d.maxDaily, perDay: d.perDay, conc: d.conc });

describe('calcPedsDose', () => {
  it('multiplies weight by mg/kg and converts to mL at the concentration', () => {
    expect(calc(18.4, IBU)).toEqual({ raw: 184, dose: 184, capped: null, daily: 736, volume: 9.2, perDay: 4 });
    expect(calc(11.2, ACET)).toEqual({ raw: 168, dose: 168, capped: null, daily: 840, volume: 5.3, perDay: 5 });
  });

  it('caps at the maximum single dose', () => {
    // 62 kg x 45 mg/kg = 2790 mg > 1000 mg maximum; 2 doses a day = 2000 mg, under the 4000 mg daily maximum.
    expect(calc(62, AMOX)).toEqual({ raw: 2790, dose: 1000, capped: 'single', daily: 2000, volume: 12.5, perDay: 2 });
  });

  it('reduces each dose so the daily total stays within the daily maximum', () => {
    // 60 kg x 15 = 900 mg, under the single maximum; 5 doses = 4500 mg > 4000 mg, so 4000 / 5 = 800 mg.
    expect(calc(60, ACET)).toEqual({ raw: 900, dose: 800, capped: 'daily', daily: 4000, volume: 25, perDay: 5 });
  });

  it('applies the daily cap after the single cap, and reports the daily cap', () => {
    // 80 kg x 15 = 1200 mg, capped to 1000 mg single; 5 x 1000 = 5000 mg > 4000 mg, so 800 mg.
    expect(calc(80, ACET)).toEqual({ raw: 1200, dose: 800, capped: 'daily', daily: 4000, volume: 25, perDay: 5 });
  });

  it('caps only strictly above the maximum (equal is not capped)', () => {
    // 40 kg x 10 = 400 mg = maximum single dose; 4 x 400 = 1600 mg = maximum daily dose.
    expect(calc(40, IBU)).toMatchObject({ dose: 400, capped: null, daily: 1600 });
    expect(calc(40.1, IBU)).toMatchObject({ raw: 401, dose: 400, capped: 'single', daily: 1600 });
  });

  it('rounds dose, raw, daily and volume to 0.1 with Math.round on tenths', () => {
    // 7.33 x 15 = 109.95 rounds to 110.
    expect(calc(7.33, ACET)).toMatchObject({ raw: 110, dose: 110, daily: 550, volume: 3.4 });
    // 13.7 x 15 = 205.5 stays; 205.5 / 32 = 6.42 mL rounds to 6.4.
    expect(calc(13.7, ACET)).toMatchObject({ raw: 205.5, dose: 205.5, daily: 1027.5, volume: 6.4 });
    // Half tenths round up: 1 kg x 1.15 mg/kg = 1.15 mg rounds to 1.2.
    expect(calcPedsDose({ weightKg: 1, mgkg: 1.15 })).toMatchObject({ raw: 1.2, dose: 1.2, daily: 1.2, volume: null });
  });

  it('rounds the daily-capped dose too', () => {
    // 4000 / 3 = 1333.33 rounds to 1333.3; daily 3 x 1333.3 = 3999.9.
    const r = calcPedsDose({ weightKg: 100, mgkg: 15, maxDaily: 4000, perDay: 3 });
    expect(r).toMatchObject({ raw: 1500, dose: 1333.3, capped: 'daily', daily: 3999.9 });
  });

  it('uses one dose a day and no volume when perDay and conc are missing', () => {
    expect(calcPedsDose({ weightKg: 20, mgkg: 5 })).toEqual({ raw: 100, dose: 100, capped: null, daily: 100, volume: null, perDay: 1 });
  });

  it('accepts weights from 0.5 to 150 kg, as numbers or typed text', () => {
    expect(calc(0.5, IBU)).toMatchObject({ dose: 5 });
    expect(calc(150, IBU)).toMatchObject({ dose: 400, capped: 'single' });
    expect(calc('12.5', IBU)).toMatchObject({ dose: 125 });
    expect(calc(' 12.5 ', IBU)).toMatchObject({ dose: 125 });
  });

  it('rejects missing, zero, negative, non-numeric and out-of-range weights', () => {
    const err = { error: 'Enter a weight between 0.5 and 150 kg.', field: 'weight' };
    for (const w of ['', '   ', 'abc', '12kg', 0, -3, 0.49, 150.1, NaN, Infinity]) expect(calc(w, IBU)).toEqual(err);
    expect(calcPedsDose({ weightKg: null, mgkg: 10 })).toEqual(err);
    expect(calcPedsDose({ weightKg: undefined, mgkg: 10 })).toEqual(err);
  });

  it('refuses to compute without a mg/kg dose', () => {
    expect(calcPedsDose({ weightKg: 12, mgkg: undefined })).toEqual({ error: 'This medication has no mg/kg dose.', field: 'drug' });
    expect(calcPedsDose({ weightKg: 12, mgkg: 0 })).toMatchObject({ field: 'drug' });
    expect(calcPedsDose({ weightKg: 12, mgkg: NaN })).toMatchObject({ field: 'drug' });
  });
});

const box = () => screen.getByText('Working').parentElement as HTMLElement;

describe('PediatricDosingCalculator', () => {
  it('shows the working, dose, volume and daily total without trailing zeros', () => {
    render(<PediatricDosingCalculator drugs={DRUGS} defaultDrug={1} defaultWeight={18.4} weightDate="today 09:12" />);
    const b = within(box());
    expect(b.getByText('18.4 kg')).toBeInTheDocument();
    expect(b.getByText('10 mg/kg')).toBeInTheDocument();
    expect(b.getAllByText('184 mg').length).toBe(2); // raw and dose
    expect(b.getByText('20 mg/mL')).toBeInTheDocument();
    expect(b.getByText('9.2 mL')).toBeInTheDocument();
    expect(b.getByText('736 mg')).toBeInTheDocument();
    expect(b.getByText('1,600 mg')).toBeInTheDocument();
    expect(b.queryByText(/Capped/)).toBeNull();
    expect(screen.getByText('Last weighed today 09:12')).toBeInTheDocument();
  });

  it('explains a single-dose cap', () => {
    render(<PediatricDosingCalculator drugs={DRUGS} defaultDrug={2} defaultWeight={62} />);
    expect(screen.getByText('Capped at the maximum single dose')).toBeInTheDocument();
    expect(screen.getByText('The weight-based dose is more than the 1,000 mg maximum, so the maximum is used.')).toBeInTheDocument();
    expect(within(box()).getByText('2,790 mg')).toBeInTheDocument();
    expect(within(box()).getByText('12.5 mL')).toBeInTheDocument();
  });

  it('explains a daily-dose cap', () => {
    render(<PediatricDosingCalculator drugs={DRUGS} defaultDrug={0} defaultWeight={60} />);
    expect(screen.getByText('Capped by the maximum daily dose')).toBeInTheDocument();
    expect(screen.getByText('Doses per day would pass 4,000 mg per day, so each dose is reduced.')).toBeInTheDocument();
    expect(within(box()).getByText('800 mg')).toBeInTheDocument();
  });

  it('recalculates as the weight is typed and blocks an invalid weight', async () => {
    const onWeightChange = vi.fn();
    render(<PediatricDosingCalculator drugs={DRUGS} defaultDrug={1} onWeightChange={onWeightChange} />);
    const input = screen.getByRole('textbox', { name: /Weight/ });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Enter a weight between 0.5 and 150 kg.')).toBeInTheDocument();
    expect(screen.queryByText('Working')).toBeNull();
    expect(screen.getByRole('button', { name: 'Use in Order' })).toBeDisabled();
    await userEvent.type(input, '9.5');
    expect(onWeightChange).toHaveBeenLastCalledWith('9.5');
    expect(within(box()).getAllByText('95 mg').length).toBe(2);
    expect(screen.getByRole('button', { name: 'Use in Order' })).toBeEnabled();
    await userEvent.clear(input);
    await userEvent.type(input, '151');
    expect(screen.getByText('Enter a weight between 0.5 and 150 kg.')).toBeInTheDocument();
    expect(screen.queryByText('Working')).toBeNull();
  });

  it('switches medication', async () => {
    const onDrugChange = vi.fn();
    render(<PediatricDosingCalculator drugs={DRUGS} defaultDrug={1} defaultWeight={20} onDrugChange={onDrugChange} />);
    expect(within(box()).getAllByText('200 mg').length).toBe(2);
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /Medication/ }), 'Amoxicillin 400 mg/5 mL suspension');
    expect(onDrugChange).toHaveBeenCalledWith(2);
    expect(within(box()).getAllByText('900 mg').length).toBe(2);
    expect(within(box()).getByText('11.3 mL')).toBeInTheDocument(); // 900 / 80 = 11.25 rounds to 11.3
  });

  it('passes the result to Use in Order', async () => {
    const onUseInOrder = vi.fn();
    render(<PediatricDosingCalculator drugs={DRUGS} defaultDrug={1} defaultWeight={18.4} onUseInOrder={onUseInOrder} />);
    await userEvent.click(screen.getByRole('button', { name: 'Use in Order' }));
    expect(onUseInOrder).toHaveBeenCalledWith({ raw: 184, dose: 184, capped: null, daily: 736, volume: 9.2, perDay: 4 }, IBU);
  });

  it('is controllable and hides actions when read-only', () => {
    const { rerender } = render(<PediatricDosingCalculator drugs={DRUGS} drug={1} weight="10" readOnly />);
    expect(within(box()).getAllByText('100 mg').length).toBe(2);
    expect(screen.queryByRole('button', { name: 'Use in Order' })).toBeNull();
    rerender(<PediatricDosingCalculator drugs={DRUGS} drug={1} weight="30" readOnly />);
    expect(within(box()).getAllByText('300 mg').length).toBe(2);
  });

  it('warns about a stale weight', () => {
    render(<PediatricDosingCalculator drugs={DRUGS} defaultWeight={11.2} weightStale="50 days" />);
    expect(screen.getByText('Weight is 50 days old')).toBeInTheDocument();
  });
});
