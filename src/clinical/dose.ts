/*
 * Doses the ISMP way: leading zero, no trailing zero, mcg, units, mL, tall-man lettering.
 * Ported from CareOS.fmt (ext: clinical-values).
 */
import { ownValue } from './own';
import { isFiniteNumber } from './units';

/** Look-alike drug names in tall-man lettering (ISMP and FDA lists). */
export const TALL_MAN: readonly string[] = [
  'hydrOXYzine', 'hydrALAZINE', 'predniSONE', 'prednisoLONE', 'glipiZIDE', 'glyBURIDE', 'DOBUTamine', 'DOPamine', 'NIFEdipine',
  'niCARdipine', 'traMADol', 'traZODone', 'ALPRAZolam', 'LORazepam', 'clonazePAM', 'cloNIDine', 'busPIRone', 'buPROPion',
  'OXcarbazepine', 'carBAMazepine', 'HYDROmorphone', 'oxyCODONE', 'OxyCONTIN', 'chlorproMAZINE', 'chlordiazePOXIDE',
  'sulfaSALAzine', 'sulfADIAZINE', 'vinBLAStine', 'vinCRIStine', 'DAUNOrubicin', 'DOXOrubicin', 'NOVOlog', 'HumaLOG', 'HumuLIN',
  'NovoLIN', 'risperiDONE', 'rOPINIRole', 'metFORMIN', 'medroxyPROGESTERone', 'methylPREDNISolone',
];

const TALL_MAP: Record<string, string> = {};
TALL_MAN.forEach((t) => {
  TALL_MAP[t.toLowerCase()] = t;
});

/** Applies tall-man lettering to every listed word in a drug name: 'hydroxyzine HCl' gives 'hydrOXYzine HCl'. */
export function tallMan(name: string | null | undefined): string {
  return String(name || '').replace(/[A-Za-z]+/g, (w) => ownValue(TALL_MAP, w.toLowerCase()) ?? w);
}

/** Dose unit spellings to the safe ISMP form: U / IU to 'units', µg / ug to 'mcg', cc / ml to 'mL'. */
export const DOSE_UNITS: Readonly<Record<string, string>> = {
  u: 'units', U: 'units', iu: 'units', IU: 'units', unit: 'units', units: 'units', ug: 'mcg', 'µg': 'mcg', mcg: 'mcg',
  cc: 'mL', ml: 'mL', mL: 'mL', mg: 'mg', g: 'g', meq: 'mEq', mEq: 'mEq', 'mg/kg': 'mg/kg', 'mcg/kg/min': 'mcg/kg/min',
  'units/h': 'units/h', 'mL/h': 'mL/h',
};

/** The safe ISMP spelling of a dose unit; unknown units unchanged. */
export function doseUnit(unit: string | null | undefined): string {
  if (!unit) return '';
  return ownValue(DOSE_UNITS, unit) ?? unit;
}

/**
 * A dose amount: no trailing zero (5.0 gives '5'), leading zero ('.5' gives '0.5'), grouping from 1,000, up to 6
 * decimals. Strings are parsed with parseFloat. Not a number gives ''.
 */
export function doseNumber(a: number | string | null | undefined): string {
  const n = typeof a === 'string' ? parseFloat(a) : a;
  if (!isFiniteNumber(n)) return '';
  const s = String(parseFloat(n.toFixed(6)));
  const parts = s.split('.');
  parts[0] = parts[0]!.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

/** Dose amount with its safe unit: `dose('.5', 'mg')` is '0.5 mg'; `dose(18, 'U')` is '18 units'. */
export function dose(a: number | string | null | undefined, unit?: string | null): string {
  const u = doseUnit(unit);
  return doseNumber(a) + (u ? ' ' + u : '');
}
