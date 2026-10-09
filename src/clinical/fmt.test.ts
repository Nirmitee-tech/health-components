import { afterEach, describe, expect, it } from 'vitest';
import {
  CODE_SYSTEMS,
  FLAGS,
  ID_TYPES,
  MEASURES,
  RANGES,
  RANGE_CONTEXTS,
  RANGE_SOURCE,
  age,
  ageLong,
  ageParts,
  code,
  convert,
  date,
  dateTime,
  deaValid,
  dose,
  doseNumber,
  flag,
  fmt,
  gestational,
  getRangeContext,
  identifier,
  isCriticalFlagCode,
  maskTail,
  measure,
  money,
  npiValid,
  number,
  onRangeContext,
  range,
  rangeFor,
  rangeKey,
  resolveContext,
  round,
  setRangeContext,
  tallMan,
  time,
  unitLabel,
  type FlagCode,
  type RangeContextId,
} from './index';

afterEach(() => setRangeContext(null));

describe('flag: strict boundaries (outpatient)', () => {
  const cases: Array<[string, number, FlagCode]> = [
    ['glucose', 70, 'N'],
    ['glucose', 99, 'N'],
    ['glucose', 99.5, 'H'],
    ['glucose', 100, 'H'],
    ['glucose', 69, 'L'],
    ['glucose', 54, 'L'], // at the critical edge is not critical (strict <)
    ['glucose', 53.9, 'LL'],
    ['glucose', 400, 'H'], // at the critical edge is not critical (strict >)
    ['glucose', 400.1, 'HH'],
    ['potassium', 3.5, 'N'],
    ['potassium', 5.1, 'N'],
    ['potassium', 5.11, 'H'],
    ['potassium', 5.4, 'H'],
    ['potassium', 3.49, 'L'],
    ['potassium', 2.8, 'L'],
    ['potassium', 2.79, 'LL'],
    ['potassium', 6.2, 'H'],
    ['potassium', 6.21, 'HH'],
    ['sodium', 120, 'L'],
    ['sodium', 119, 'LL'],
    ['sodium', 160, 'H'],
    ['sodium', 161, 'HH'],
    ['temp', 37.2, 'N'],
    ['temp', 37.5, 'H'],
    ['temp', 40.0, 'H'],
    ['temp', 40.1, 'HH'],
    ['temp', 35.0, 'L'],
    ['temp', 34.9, 'LL'],
    ['spo2', 95, 'N'],
    ['spo2', 93, 'L'],
    ['spo2', 88, 'L'],
    ['spo2', 87, 'LL'],
    ['spo2', 100, 'N'],
    ['hr', 150, 'H'],
    ['hr', 151, 'HH'],
    ['hr', 40, 'L'],
    ['hr', 39, 'LL'],
    ['bpSys', 180, 'H'],
    ['bpSys', 181, 'HH'],
    ['bpSys', 142, 'H'],
    ['bpDia', 88, 'H'],
    ['inr', 5.0, 'H'],
    ['inr', 5.8, 'HH'],
    ['inr', 0.5, 'L'], // no critical low defined
    ['hgb', 11.2, 'L'],
    ['hgb', 6.9, 'LL'],
    ['hgb', 20.1, 'HH'],
    ['egfr', 60, 'N'],
    ['egfr', 42, 'L'], // one-sided range, no critical
    ['egfr', 140, 'N'],
    ['ldl', 99, 'N'],
    ['ldl', 131, 'H'],
    ['ldl', 0, 'N'],
    ['anc', 0.4, 'LL'],
    ['anc', 1.4, 'L'],
    ['trop', 34, 'N'],
    ['trop', 58, 'H'],
    ['gcs', 15, 'N'],
    ['gcs', 14, 'L'],
    ['gcs', 8, 'LL'],
    ['lactate', 4.0, 'H'],
    ['lactate', 4.1, 'HH'],
    ['plt', 1000, 'H'],
    ['plt', 1001, 'HH'],
    ['plt', 19, 'LL'],
    ['crcl', 14, 'LL'],
    ['phq9', 20, 'HH'],
    ['ebl', 1001, 'HH'],
    ['fhr', 99, 'LL'],
  ];
  it.each(cases)('%s %s flags %s', (m, v, f) => {
    expect(flag(v, m)).toBe(f);
  });
});

describe('flag: range contexts', () => {
  it('glucose 150 is H outpatient and ED, normal inpatient, H in pregnancy', () => {
    expect(flag(150, 'glucose', { context: 'outpatient' })).toBe('H');
    expect(flag(150, 'glucose', { context: 'ed' })).toBe('H');
    expect(flag(150, 'glucose', { context: 'inpatient' })).toBe('N');
    expect(flag(180, 'glucose', { context: 'inpatient' })).toBe('N');
    expect(flag(181, 'glucose', { context: 'inpatient' })).toBe('H');
    expect(flag(95, 'glucose', { context: 'pregnancy' })).toBe('H');
    expect(flag(94, 'glucose', { context: 'pregnancy' })).toBe('N');
  });

  it('temperature uses the 37.9 cut-off in ED and inpatient (38.0 is fever)', () => {
    expect(flag(37.5, 'temp', { context: 'outpatient' })).toBe('H');
    expect(flag(37.5, 'temp', { context: 'ed' })).toBe('N');
    expect(flag(37.9, 'temp', { context: 'ed' })).toBe('N');
    expect(flag(38.0, 'temp', { context: 'ed' })).toBe('H');
    expect(flag(37.5, 'temp', { context: 'inpatient' })).toBe('N');
    expect(flag(37.5, 'temp', { context: 'pregnancy' })).toBe('H'); // not defined: outpatient
  });

  it('SpO2 93 is L outpatient and normal inpatient', () => {
    expect(flag(93, 'spo2', { context: 'outpatient' })).toBe('L');
    expect(flag(93, 'spo2', { context: 'inpatient' })).toBe('N');
    expect(flag(91, 'spo2', { context: 'inpatient' })).toBe('L');
  });

  it('blood pressure in pregnancy and inpatient', () => {
    expect(flag(160, 'bpSys', { context: 'pregnancy' })).toBe('HH');
    expect(flag(159, 'bpSys', { context: 'pregnancy' })).toBe('H');
    expect(flag(160, 'bpSys', { context: 'outpatient' })).toBe('H');
    expect(flag(135, 'bpSys', { context: 'inpatient' })).toBe('N');
    expect(flag(110, 'bpDia', { context: 'pregnancy' })).toBe('HH');
  });

  it('pregnancy-specific labs', () => {
    expect(flag(12.0, 'hgb', { context: 'pregnancy' })).toBe('N');
    expect(flag(12.0, 'hgb', { context: 'outpatient' })).toBe('L');
    expect(flag(3.0, 'tsh', { context: 'pregnancy' })).toBe('H');
    expect(flag(3.0, 'tsh', { context: 'outpatient' })).toBe('N');
    expect(flag(0.9, 'creatinine', { context: 'pregnancy' })).toBe('H');
    expect(flag(105, 'hr', { context: 'pregnancy' })).toBe('N');
  });

  it('pediatric picks the age band, and the oldest band without an age', () => {
    expect(flag(150, 'hr', { context: 'pediatric', ageYears: 8 })).toBe('H');
    expect(flag(161, 'hr', { context: 'pediatric', ageYears: 8 })).toBe('HH');
    expect(flag(150, 'hr', { context: 'pediatric', ageYears: 0.5 })).toBe('N');
    expect(flag(150, 'hr', { context: 'pediatric' })).toBe('H'); // 13-17 y band: 60-100
    expect(rangeFor('hr', { context: 'pediatric' }).band).toBe('13-17 y');
    expect(rangeFor('hr', { context: 'pediatric', ageYears: 1 }).band).toBe('1-5 y'); // lower bound inclusive
    expect(rangeFor('hr', { context: 'pediatric', ageYears: 0.99 }).band).toBe('under 1 y');
    expect(rangeFor('hr', { context: 'pediatric', ageYears: 30 }).band).toBe('13-17 y'); // out of bands: oldest
    expect(flag(45, 'glucose', { context: 'pediatric', ageYears: 0.05 })).toBe('L');
    expect(flag(39, 'glucose', { context: 'pediatric', ageYears: 0.05 })).toBe('LL');
    expect(flag(45, 'glucose', { context: 'pediatric', ageYears: 2 })).toBe('LL');
    expect(flag(10.9, 'hgb', { context: 'pediatric', ageYears: 3 })).toBe('L');
    expect(flag(6.5, 'potassium', { context: 'pediatric', ageYears: 0.02 })).toBe('H');
    expect(flag(6.5, 'potassium', { context: 'pediatric', ageYears: 4 })).toBe('HH');
  });

  it('a context the measure does not define falls back to outpatient', () => {
    const r = rangeFor('sodium', { context: 'pediatric', ageYears: 4 });
    expect(r).toMatchObject({ refLow: 136, refHigh: 145, context: 'outpatient', band: null });
    expect(rangeFor('hr', { context: 'ed' }).context).toBe('outpatient');
    expect(rangeFor('temp', { context: 'ed' }).context).toBe('ed');
  });
});

describe('flag: lab range always wins', () => {
  it('lab refLow/refHigh replace the registry edges in every context', () => {
    for (const c of RANGE_CONTEXTS) {
      expect(flag(150, 'glucose', { context: c, refLow: 70, refHigh: 200 })).toBe('N');
      expect(flag(150, 'glucose', { context: c, refLow: 70, refHigh: 140 })).toBe('H');
    }
  });

  it('a lab range replaces both reference edges whole (one-sided lab range)', () => {
    const r = rangeFor('potassium', { refHigh: 5.0 });
    expect(r.refLow).toBeUndefined();
    expect(r.refHigh).toBe(5.0);
    expect(r.source).toBe('lab');
    expect(flag(3.0, 'potassium', { refHigh: 5.0 })).toBe('N');
  });

  it('registry critical edges still apply under a lab range unless the lab passes its own', () => {
    expect(flag(401, 'glucose', { refLow: 70, refHigh: 200 })).toBe('HH');
    expect(flag(450, 'glucose', { refLow: 70, refHigh: 200, critHigh: 500 })).toBe('H');
    expect(flag(5.8, 'inr', { refLow: 2.0, refHigh: 3.0, critHigh: 5.0 })).toBe('HH');
  });

  it('lab range wins over the global setting too', () => {
    setRangeContext('inpatient');
    expect(flag(150, 'glucose', { refLow: 70, refHigh: 140 })).toBe('H');
  });

  it('works for a measure not in the registry', () => {
    const r = rangeFor('ferritin', { refLow: 30, refHigh: 400 });
    expect(r).toMatchObject({ refLow: 30, refHigh: 400, source: 'lab', measure: null, context: null });
    expect(flag(20, 'ferritin', { refLow: 30, refHigh: 400 })).toBe('L');
  });
});

describe('flag: explicit range object and edge cases', () => {
  it('flags against a range object', () => {
    expect(flag(5, { refLow: 1, refHigh: 4 })).toBe('H');
    expect(flag(0.5, { refLow: 1, refHigh: 4, critLow: 0.6 })).toBe('LL');
    expect(flag(4, { refLow: 1, refHigh: 4 })).toBe('N');
  });
  it('returns null for non-numbers, unknown measures and empty ranges', () => {
    expect(flag(NaN, 'glucose')).toBeNull();
    expect(flag(null, 'glucose')).toBeNull();
    expect(flag(undefined, 'glucose')).toBeNull();
    expect(flag(Infinity, 'glucose')).toBeNull();
    expect(flag(5, 'not-a-measure')).toBeNull();
    expect(flag(5, {})).toBeNull();
    expect(flag(5, null)).toBeNull();
  });
  it('critical codes', () => {
    expect(['LL', 'HH', 'AA'].every((f) => isCriticalFlagCode(f as FlagCode))).toBe(true);
    expect(['N', 'L', 'H', 'A'].some((f) => isCriticalFlagCode(f as FlagCode))).toBe(false);
  });
  it('FLAGS spell every code with a word, tone and icon', () => {
    expect(FLAGS.HH).toEqual({ text: 'Critical high', tone: 'critical', icon: 'alert' });
    expect(FLAGS.LL.text).toBe('Critical low');
    expect(FLAGS.L).toEqual({ text: 'Low', tone: 'warning', icon: 'sort-down' });
    expect(FLAGS.N.tone).toBe('neutral');
    expect(FLAGS.AA.text).toBe('Critical abnormal');
  });
});

describe('global range context and precedence', () => {
  it('starts unset and resolves to outpatient', () => {
    expect(getRangeContext()).toBeNull();
    expect(resolveContext()).toBe('outpatient');
    expect(resolveContext(undefined, 'ed')).toBe('ed');
  });
  it('global beats the set default, an explicit context beats global', () => {
    setRangeContext('inpatient');
    expect(resolveContext(undefined, 'ed')).toBe('inpatient');
    expect(resolveContext('pregnancy', 'ed')).toBe('pregnancy');
    expect(flag(150, 'glucose')).toBe('N');
    expect(flag(150, 'glucose', { context: 'outpatient' })).toBe('H');
    setRangeContext(null);
    expect(flag(150, 'glucose')).toBe('H');
  });
  it('rejects unknown contexts and notifies subscribers', () => {
    expect(() => setRangeContext('icu' as RangeContextId)).toThrow(/Unknown range context: icu/);
    const seen: Array<RangeContextId | null> = [];
    const off = onRangeContext((c) => seen.push(c));
    setRangeContext('ed');
    setRangeContext(null);
    off();
    setRangeContext('inpatient');
    expect(seen).toEqual(['ed', null]);
  });
});

describe('registry', () => {
  it('every entry is marked as a sample', () => {
    for (const e of Object.values(RANGES)) expect(e.source).toBe(RANGE_SOURCE);
    expect(RANGE_SOURCE).toBe('sample value, not clinical guidance');
  });
  it('matches the brand book sample ranges', () => {
    expect(RANGES.potassium.outpatient).toEqual({ low: 3.5, high: 5.1, critLow: 2.8, critHigh: 6.2 });
    expect(RANGES.temp.ed).toEqual({ low: 36.1, high: 37.9, critLow: 35, critHigh: 40 });
    expect(RANGES.spo2.outpatient).toEqual({ low: 95, high: 100, critLow: 88 });
    expect(RANGES.egfr.outpatient).toEqual({ low: 60 });
    expect(RANGES.ldl.outpatient).toEqual({ high: 99 });
    expect(RANGES.inr.outpatient).toEqual({ low: 0.8, high: 1.1, critHigh: 5 });
    expect(RANGES.creatinine.pediatric?.map((b) => [b.label, b.low, b.high])).toEqual([
      ['1-5 y', 0.2, 0.5],
      ['6-12 y', 0.3, 0.7],
      ['13-17 y', 0.5, 1],
    ]);
    expect(Object.keys(RANGES)).toEqual([
      'bpSys', 'bpDia', 'map', 'hr', 'rr', 'temp', 'spo2', 'etco2', 'gcs', 'bmi', 'pain', 'glucose', 'potassium', 'sodium',
      'chloride', 'bicarbonate', 'bun', 'creatinine', 'egfr', 'calcium', 'magnesium', 'a1c', 'ldl', 'tsh', 'alt', 'inr', 'hgb',
      'wbc', 'anc', 'plt', 'bnp', 'trop', 'lactate', 'vanc', 'crcl', 'phq9', 'iop', 'dbhl', 'uoRate', 'fhr', 'contractions',
      'oxytocin', 'rom', 'ebl',
    ]);
  });
  it('resolves keys, aliases and LOINC codes, never inherited members', () => {
    expect(rangeKey('potassium')).toBe('potassium');
    expect(rangeKey('K')).toBe('potassium');
    expect(rangeKey('2823-3')).toBe('potassium');
    expect(rangeKey('SpO2')).toBe('spo2');
    expect(rangeKey('constructor')).toBeNull();
    expect(rangeKey('toString')).toBeNull();
    expect(rangeKey(undefined)).toBeNull();
    expect(flag(5.4, 'K')).toBe('H');
    expect(flag(5.4, '2823-3')).toBe('H');
  });
  it('rangeFor reports where the range came from', () => {
    expect(rangeFor('glucose', { context: 'inpatient' })).toEqual({
      refLow: 70,
      refHigh: 180,
      critLow: 54,
      critHigh: 400,
      context: 'inpatient',
      band: null,
      source: RANGE_SOURCE,
      measure: 'glucose',
    });
    expect(rangeFor('nothing')).toEqual({ context: null, band: null, source: 'none', measure: null });
  });
});

describe('measures and units', () => {
  it('finds a measure by key, LOINC or alias', () => {
    expect(measure('potassium')?.label).toBe('Potassium');
    expect(measure('2823-3')?.key).toBe('potassium');
    expect(measure('K')?.key).toBe('potassium');
    expect(measure('constructor')).toBeNull();
    expect(measure(null)).toBeNull();
  });
  it('keeps legacy outpatient fields on MEASURES', () => {
    expect(MEASURES.potassium).toMatchObject({ unit: 'mmol/L', p: 1, low: 3.5, high: 5.1, critLow: 2.8, critHigh: 6.2 });
    expect(MEASURES.weight.low).toBeUndefined();
    expect(MEASURES.creatinine.p).toBe(2);
    expect(MEASURES.tsh.p).toBe(2);
  });
  it('labels UCUM units', () => {
    expect(unitLabel('mm[Hg]')).toBe('mmHg');
    expect(unitLabel('Cel')).toBe('°C');
    expect(unitLabel('10*3/uL')).toBe('K/µL');
    expect(unitLabel('mL/min/{1.73_m2}')).toBe('mL/min/1.73m²');
    expect(unitLabel('mg/dL')).toBe('mg/dL');
    expect(unitLabel(null)).toBe('');
    expect(unitLabel('constructor')).toBe('constructor');
  });
});

describe('precision', () => {
  it('keeps trailing zeros at the measure precision', () => {
    expect(number(37, 1)).toBe('37.0');
    expect(number(0.4, 2)).toBe('0.40');
    expect(number(70.25, 1)).toBe('70.3');
  });
  it('rounds half away from zero, decimal-exact', () => {
    expect(number(2.5, 0)).toBe('3');
    expect(number(-2.5, 0)).toBe('−3');
    expect(number(1.005, 2)).toBe('1.01');
    expect(number(1.45, 1)).toBe('1.5');
    expect(round(-1.005, 2)).toBe(-1.01);
  });
  it('groups thousands and uses a real minus sign', () => {
    expect(number(1234.5, 0)).toBe('1,235');
    expect(number(1234567.891, 2)).toBe('1,234,567.89');
    expect(number(-1234.5, 1)).toBe('−1,234.5');
    expect(number(-0.04, 1)).toBe('0.0');
  });
  it('gives empty text for non-numbers and defaults to 0 decimals', () => {
    expect(number(NaN, 1)).toBe('');
    expect(number(null)).toBe('');
    expect(number(12.6)).toBe('13');
  });
  it('formats ranges with the unit label', () => {
    expect(range(rangeFor('potassium'), 1, 'mmol/L')).toBe('3.5–5.1 mmol/L');
    expect(range(rangeFor('egfr'), 0, 'mL/min/{1.73_m2}')).toBe('≥ 60 mL/min/1.73m²');
    expect(range(rangeFor('ldl'), 0, 'mg/dL')).toBe('≤ 99 mg/dL');
    expect(range(rangeFor('inr'), 1, '{INR}')).toBe('0.8–1.1');
    expect(range(rangeFor('glucose', { context: 'inpatient' }), 0, 'mg/dL')).toBe('70–180 mg/dL');
    expect(range({}, 1, 'mg/dL')).toBe('');
  });
});

describe('conversions', () => {
  it('uses exact factors', () => {
    expect(convert(1, '[lb_av]', 'kg')).toBe(0.45359237);
    expect(convert(1, '[in_i]', 'cm')).toBe(2.54);
    expect(convert(100, 'Cel', '[degF]')).toBe(212);
    expect(convert(98.6, '[degF]', 'Cel')).toBeCloseTo(37, 10);
    expect(number(convert(212, 'mg/dL', 'mmol/L', 'glucose'), 1)).toBe('11.8');
    expect(number(convert(1.82, 'mg/dL', 'umol/L', 'creatinine'), 0)).toBe('161');
    expect(number(convert(7.2, '%', 'mmol/mol'), 0)).toBe('55');
    expect(number(convert(36.3, 'kg', '[lb_av]'), 1)).toBe('80.0');
  });
  it('round-trips the stored value without drift', () => {
    expect(convert(convert(154.3, '[lb_av]', 'kg'), 'kg', '[lb_av]')).toBeCloseTo(154.3, 10);
    expect(number(convert(convert(154.3, '[lb_av]', 'kg'), 'kg', '[lb_av]'), 1)).toBe('154.3');
  });
  it('picks the family by kind, returns same-unit values and throws otherwise', () => {
    expect(convert(5, 'kg', 'kg')).toBe(5);
    expect(convert(1, 'mg/dL', 'umol/L', 'creatinine')).toBe(88.42);
    expect(convert(1, 'mg/dL', 'mmol/L', 'glucose')).toBeCloseTo(1 / 18.016, 12);
    expect(() => convert(1, 'kg', 'cm')).toThrow('No conversion kg to cm');
    expect(() => convert(1, 'mg/dL', 'umol/L', 'glucose')).toThrow();
  });
});

describe('doses (ISMP)', () => {
  it('adds a leading zero and drops trailing zeros', () => {
    expect(dose('.5', 'mg')).toBe('0.5 mg');
    expect(dose(5.0, 'mg')).toBe('5 mg');
    expect(dose(0.088, 'mg')).toBe('0.088 mg');
    expect(doseNumber(12.5)).toBe('12.5');
    expect(doseNumber('abc')).toBe('');
    expect(doseNumber(1 / 3)).toBe('0.333333');
  });
  it('spells units safely and groups thousands', () => {
    expect(dose(18, 'U')).toBe('18 units');
    expect(dose(50000, 'IU')).toBe('50,000 units');
    expect(dose('88', 'ug')).toBe('88 mcg');
    expect(dose(88, 'µg')).toBe('88 mcg');
    expect(dose(10, 'cc')).toBe('10 mL');
    expect(dose(20, 'meq')).toBe('20 mEq');
    expect(dose(2, 'puffs')).toBe('2 puffs');
    expect(dose(2)).toBe('2');
  });
  it('applies tall-man lettering', () => {
    expect(tallMan('hydroxyzine')).toBe('hydrOXYzine');
    expect(tallMan('HYDRALAZINE 10 mg')).toBe('hydrALAZINE 10 mg');
    expect(tallMan('insulin glargine')).toBe('insulin glargine');
    expect(tallMan('constructor')).toBe('constructor');
    expect(tallMan(null)).toBe('');
  });
});

describe('dates and ages', () => {
  it('formats MM/DD/YYYY from a local calendar date', () => {
    expect(date('2026-10-09')).toBe('10/09/2026');
    expect(date('nope')).toBe('');
    expect(date(undefined)).toBe('');
  });
  it('formats times in a zone, 12- or 24-hour', () => {
    const t = '2026-10-09T19:05:00Z';
    expect(dateTime(t, { timeZone: 'America/Chicago' })).toBe('10/09/2026 02:05 PM CDT');
    expect(dateTime(t, { timeZone: 'America/New_York', hour24: true })).toBe('10/09/2026 15:05 EDT');
    expect(time(t, { timeZone: 'America/Los_Angeles' })).toBe('12:05 PM PDT');
    expect(time('2026-10-09T05:00:00Z', { timeZone: 'America/Chicago' })).toBe('12:00 AM CDT');
    expect(time(t, { timeZone: 'America/Chicago', showZone: false })).toBe('02:05 PM');
    expect(dateTime('bad')).toBe('');
  });
  it('shows ages in days, weeks, months then years', () => {
    const now = '2026-10-09';
    expect(age('2026-10-01', now)).toBe('8 d');
    expect(age('2026-09-26', now)).toBe('13 d');
    expect(age('2026-09-25', now)).toBe('2 wk');
    expect(age('2026-08-28', now)).toBe('6 wk');
    expect(age('2026-08-14', now)).toBe('1 mo');
    expect(age('2025-01-20', now)).toBe('20 mo');
    expect(age('2024-10-10', now)).toBe('23 mo');
    expect(age('2024-10-09', now)).toBe('2 y');
    expect(age('1979-03-14', now)).toBe('47 y');
    expect(age('1938-11-02', now)).toBe('87 y');
    expect(age('2026-10-10', now)).toBe('');
    expect(age('garbage', now)).toBe('');
    expect(ageParts('2026-08-28', now)).toEqual({ days: 42, weeks: 6, months: 1, years: 0 });
  });
  it('spells ages in words', () => {
    expect(ageLong('2026-10-08', '2026-10-09')).toBe('1 day');
    expect(ageLong('2026-08-28', '2026-10-09')).toBe('6 weeks');
    expect(ageLong('1979-03-14', '2026-10-09')).toBe('47 years');
    expect(ageLong('2025-09-09', '2026-10-09')).toBe('13 months');
  });
  it('computes gestational age from weeks and days or from the EDD', () => {
    expect(gestational({ weeks: 38, days: 4 })).toBe('38w 4d');
    expect(gestational({ weeks: 12 })).toBe('12w 0d');
    expect(gestational({ edd: '2026-11-20', asOf: '2026-10-09' })).toBe('34w 0d');
    expect(gestational({ edd: '2026-11-17', asOf: '2026-10-09' })).toBe('34w 3d');
    expect(gestational({})).toBe('');
  });
});

describe('identifiers', () => {
  it('formats and masks SSNs', () => {
    expect(identifier('ssn', '123456789')).toBe('123-45-6789');
    expect(identifier('ssn', '123-45-6789', true)).toBe('•••-••-6789');
    expect(ID_TYPES.ssn.masked).toBe(true);
  });
  it('masks all but the last four for other types, keeping separators', () => {
    expect(identifier('member', 'XQK123456789', true)).toBe('••••••••6789');
    expect(identifier('dea', 'AB1234563', true)).toBe('•••••4563');
    expect(maskTail('AB-1234-5678')).toBe('••-••••-5678');
    expect(maskTail('1234')).toBe('1234');
    expect(identifier('mrn', 'MRN-0048213')).toBe('MRN-0048213');
    expect(identifier('unknown', 'X1')).toBe('X1');
  });
  it('checks NPI and DEA check digits', () => {
    expect(npiValid('1234567893')).toBe(true);
    expect(npiValid('1234567890')).toBe(false);
    expect(npiValid('123456789')).toBe(false);
    expect(deaValid('AB1234563')).toBe(true);
    expect(deaValid('ab1234563')).toBe(true);
    expect(deaValid('AB1234564')).toBe(false);
    expect(deaValid('A11234563')).toBe(false);
  });
});

describe('codes', () => {
  it('normalises ICD-10 and NDC', () => {
    expect(code('icd10', 'E119')).toBe('E11.9');
    expect(code('icd10', 'e11.9')).toBe('E11.9');
    expect(code('icd10', 'I10')).toBe('I10');
    expect(code('icd10', 'S72.001A')).toBe('S72.001A');
    expect(code('ndc', '00002831701')).toBe('00002-8317-01');
    expect(code('ndc', '0002-8317-01')).toBe('0002-8317-01');
  });
  it('passes other systems through', () => {
    expect(code('cpt', '99214')).toBe('99214');
    expect(code('loinc', '2823-3')).toBe('2823-3');
    expect(code('custom', 'X')).toBe('X');
    expect(code('icd10', '')).toBe('');
    expect(code('icd10', undefined)).toBe('');
    expect(CODE_SYSTEMS.snomed).toEqual({ label: 'SNOMED CT', uri: 'http://snomed.info/sct' });
  });
});

describe('money', () => {
  it('shows dollars with two decimals and grouping', () => {
    expect(money(1234.5)).toBe('$1,234.50');
    expect(money(0)).toBe('$0.00');
    expect(money(8.05)).toBe('$8.05');
    expect(money(1000000)).toBe('$1,000,000.00');
  });
  it('puts negatives in parentheses, or a minus sign on request', () => {
    expect(money(-45)).toBe('($45.00)');
    expect(money(-118.25)).toBe('($118.25)');
    expect(money(-45, { minus: true })).toBe('−$45.00');
    expect(money(-0.004)).toBe('$0.00');
    expect(money(-0.005)).toBe('($0.01)');
  });
  it('gives empty text for no amount', () => {
    expect(money(null)).toBe('');
    expect(money(NaN)).toBe('');
  });
});

describe('fmt namespace', () => {
  it('exposes every CareOS.fmt member', () => {
    const names = [
      'MEASURES', 'FLAGS', 'CONVERSIONS', 'TALL_MAN', 'CODE_SYSTEMS', 'ID_TYPES', 'measure', 'unitLabel', 'RANGES',
      'RANGE_CONTEXTS', 'rangeFor', 'rangeKey', 'setRangeContext', 'getRangeContext', 'onRangeContext', 'resolveContext',
      'number', 'round', 'flag', 'range', 'convert', 'tallMan', 'dose', 'doseNumber', 'date', 'time', 'dateTime', 'age',
      'ageLong', 'ageParts', 'gestational', 'identifier', 'npiValid', 'deaValid', 'code', 'money', 'useRangeContext',
      'withRangeContext',
    ];
    for (const n of names) expect(fmt).toHaveProperty(n);
    expect(fmt.flag).toBe(flag);
    expect(fmt.RANGE_CONTEXTS).toEqual(['outpatient', 'inpatient', 'ed', 'pediatric', 'pregnancy']);
  });
});
