/*
 * Numbers, units and unit conversion for clinical values.
 * Ported from CareOS.fmt (ext: clinical-values). Pure functions, no DOM, SSR safe.
 */
import { ownValue } from './own';

/** True for a finite number (not NaN, not ±Infinity, not a numeric string). */
export function isFiniteNumber(v: unknown): v is number {
  return typeof v === 'number' && isFinite(v);
}


/** UCUM code to the label a screen shows. The UCUM code stays in data and FHIR. Codes not listed show as they are. */
export const UNIT_LABELS: Readonly<Record<string, string>> = {
  'mm[Hg]': 'mmHg',
  '/min': 'bpm',
  '{breaths}/min': 'breaths/min',
  Cel: '°C',
  '[degF]': '°F',
  'kg/m2': 'kg/m²',
  '[lb_av]': 'lb',
  '[in_i]': 'in',
  '10*3/uL': 'K/µL',
  '{INR}': 'INR',
  'm[IU]/L': 'mIU/L',
  'mL/min/{1.73_m2}': 'mL/min/1.73m²',
  '{score}': '/10',
  'mmol/mol': 'mmol/mol',
  'umol/L': 'µmol/L',
  ug: 'mcg',
};

/** Readable label for a UCUM unit code: `unitLabel('mm[Hg]')` is 'mmHg'. Unknown codes are returned unchanged; null gives ''. */
export function unitLabel(u: string | null | undefined): string {
  if (u == null) return '';
  const l = ownValue(UNIT_LABELS, u);
  return l != null ? l : u;
}

/** Rounds half away from zero to `p` decimals (decimal-exact: `round(1.005, 2)` is 1.01). */
export function round(v: number, p: number): number {
  const r = Number(Math.round(Number(Math.abs(v) + 'e' + p)) + 'e-' + p);
  return v < 0 ? -r : r;
}

/**
 * Fixed precision, US grouping, real minus sign (U+2212). Never trims trailing zeros: the precision is the measure's.
 * `number(37, 1)` is '37.0'; `number(-1234.5, 0)` is '−1,235'. Not a finite number gives ''. Default precision 0.
 */
export function number(v: number | null | undefined, p?: number | null): string {
  if (!isFiniteNumber(v)) return '';
  const prec = p == null ? 0 : p;
  const r = round(v, prec);
  const parts = Math.abs(r).toFixed(prec).split('.');
  parts[0] = parts[0]!.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return (r < 0 ? '−' : '') + parts.join('.');
}

/** A measure family UnitToggle and `convert` know. */
export type ConversionKind = 'weight' | 'height' | 'temp' | 'glucose' | 'creatinine' | 'a1c';

/** One measure family's units, exact conversion functions (keyed 'from>to') and display precision per unit. */
export interface Conversion {
  /** The two UCUM units, canonical first. */
  units: readonly [string, string];
  /** Conversion functions keyed `'<from>><to>'`, e.g. `'kg>[lb_av]'`. */
  to: Readonly<Record<string, (v: number) => number>>;
  /** Decimals to show per unit. */
  p: Readonly<Record<string, number>>;
}

/**
 * Exact factors: lb and in are defined exactly; mmol/L factors use molar mass (glucose 180.16 g/mol,
 * creatinine 113.12 g/mol); A1c uses the IFCC master equation.
 */
export const CONVERSIONS: Readonly<Record<ConversionKind, Conversion>> = {
  weight: {
    units: ['kg', '[lb_av]'],
    to: { 'kg>[lb_av]': (v) => v / 0.45359237, '[lb_av]>kg': (v) => v * 0.45359237 },
    p: { kg: 1, '[lb_av]': 1 },
  },
  height: {
    units: ['cm', '[in_i]'],
    to: { 'cm>[in_i]': (v) => v / 2.54, '[in_i]>cm': (v) => v * 2.54 },
    p: { cm: 1, '[in_i]': 1 },
  },
  temp: {
    units: ['Cel', '[degF]'],
    to: { 'Cel>[degF]': (v) => (v * 9) / 5 + 32, '[degF]>Cel': (v) => ((v - 32) * 5) / 9 },
    p: { Cel: 1, '[degF]': 1 },
  },
  glucose: {
    units: ['mg/dL', 'mmol/L'],
    to: { 'mg/dL>mmol/L': (v) => v / 18.016, 'mmol/L>mg/dL': (v) => v * 18.016 },
    p: { 'mg/dL': 0, 'mmol/L': 1 },
  },
  creatinine: {
    units: ['mg/dL', 'umol/L'],
    to: { 'mg/dL>umol/L': (v) => v * 88.42, 'umol/L>mg/dL': (v) => v / 88.42 },
    p: { 'mg/dL': 2, 'umol/L': 0 },
  },
  a1c: {
    units: ['%', 'mmol/mol'],
    to: { '%>mmol/mol': (v) => (v - 2.15) * 10.929, 'mmol/mol>%': (v) => v / 10.929 + 2.15 },
    p: { '%': 1, 'mmol/mol': 0 },
  },
};

/**
 * Converts a stored value between UCUM units with exact factors. Convert the stored number, never the rounded display.
 * Same unit returns `v` unchanged. `kind` limits the search to one family (glucose and creatinine both use mg/dL).
 * Throws `Error('No conversion <from> to <to>')` when no factor exists.
 */
export function convert(v: number, from: string, to: string, kind?: ConversionKind): number {
  if (from === to) return v;
  const kinds = kind ? [kind] : (Object.keys(CONVERSIONS) as ConversionKind[]);
  for (const k of kinds) {
    const c = ownValue(CONVERSIONS, k);
    const f = c ? ownValue(c.to, from + '>' + to) : undefined;
    if (f) return f(v);
  }
  throw new Error('No conversion ' + from + ' to ' + to);
}
