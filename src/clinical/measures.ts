/*
 * Measures: label, LOINC, display unit and precision. Ranges live in RANGES (ranges.ts).
 * Ported from CareOS.fmt (ext: clinical-values).
 */
import { RANGES, RANGE_ALIASES } from './ranges';
import { ownValue } from './own';

/** A key of MEASURES. */
export type MeasureKey =
  | 'bpSys' | 'bpDia' | 'hr' | 'rr' | 'temp' | 'spo2' | 'weight' | 'height' | 'bmi' | 'pain' | 'glucose' | 'potassium'
  | 'sodium' | 'creatinine' | 'egfr' | 'a1c' | 'inr' | 'hgb' | 'wbc' | 'plt' | 'ldl' | 'tsh' | 'trop';

/** One clinical measure: what it is called, how it is coded and how it is shown. */
export interface Measure {
  /** Its MEASURES key. */
  key: MeasureKey;
  /** Label shown to people ('Potassium'). */
  label: string;
  /** LOINC code. */
  loinc: string;
  /** UCUM unit code of the stored value ('mmol/L'); unitLabel gives the screen label. */
  unit: string;
  /** Decimals shown; applied by rounding half away from zero, trailing zeros kept. */
  p: number;
  /** Pediatric or special-population note. */
  peds?: string;
  /** Legacy: the outpatient sample reference low (use rangeFor instead). */
  low?: number;
  /** Legacy: the outpatient sample reference high (use rangeFor instead). */
  high?: number;
  /** Legacy: the outpatient sample critical low (use rangeFor instead). */
  critLow?: number;
  /** Legacy: the outpatient sample critical high (use rangeFor instead). */
  critHigh?: number;
}

type MeasureDef = Omit<Measure, 'key' | 'low' | 'high' | 'critLow' | 'critHigh'>;

const DEFS: Record<MeasureKey, MeasureDef> = {
  bpSys: { label: 'Systolic BP', loinc: '8480-6', unit: 'mm[Hg]', p: 0 },
  bpDia: { label: 'Diastolic BP', loinc: '8462-4', unit: 'mm[Hg]', p: 0 },
  hr: { label: 'Heart rate', loinc: '8867-4', unit: '/min', p: 0, peds: 'Newborn 100-160; age-based tables apply under 12 y.' },
  rr: { label: 'Respiratory rate', loinc: '9279-1', unit: '{breaths}/min', p: 0, peds: 'Newborn 30-60.' },
  temp: { label: 'Temperature', loinc: '8310-5', unit: 'Cel', p: 1 },
  spo2: { label: 'SpO2', loinc: '59408-5', unit: '%', p: 0, peds: 'COPD targets of 88-92% are set per patient.' },
  weight: { label: 'Weight', loinc: '29463-7', unit: 'kg', p: 1, peds: 'Infants under 10 kg: 2 decimals (grams matter).' },
  height: { label: 'Height', loinc: '8302-2', unit: 'cm', p: 1 },
  bmi: { label: 'BMI', loinc: '39156-5', unit: 'kg/m2', p: 1, peds: 'Under 20 y use BMI-for-age percentile.' },
  pain: { label: 'Pain score', loinc: '72514-3', unit: '{score}', p: 0 },
  glucose: { label: 'Glucose', loinc: '2345-7', unit: 'mg/dL', p: 0 },
  potassium: { label: 'Potassium', loinc: '2823-3', unit: 'mmol/L', p: 1, peds: 'Newborn upper limit about 6.0.' },
  sodium: { label: 'Sodium', loinc: '2951-2', unit: 'mmol/L', p: 0 },
  creatinine: { label: 'Creatinine', loinc: '2160-0', unit: 'mg/dL', p: 2, peds: 'Children run far lower; use age-based ranges.' },
  egfr: { label: 'eGFR', loinc: '98979-8', unit: 'mL/min/{1.73_m2}', p: 0 },
  a1c: { label: 'Hemoglobin A1c', loinc: '4548-4', unit: '%', p: 1 },
  inr: { label: 'INR', loinc: '6301-6', unit: '{INR}', p: 1, peds: 'On warfarin the target (often 2.0-3.0) replaces this range.' },
  hgb: { label: 'Hemoglobin', loinc: '718-7', unit: 'g/dL', p: 1, peds: 'Female adult 11.6-15.0.' },
  wbc: { label: 'WBC', loinc: '6690-2', unit: '10*3/uL', p: 1 },
  plt: { label: 'Platelets', loinc: '777-3', unit: '10*3/uL', p: 0 },
  ldl: { label: 'LDL cholesterol', loinc: '13457-7', unit: 'mg/dL', p: 0 },
  tsh: { label: 'TSH', loinc: '3016-3', unit: 'm[IU]/L', p: 2 },
  trop: { label: 'Troponin I (hs)', loinc: '89579-7', unit: 'ng/L', p: 0 },
};

function build(): Record<MeasureKey, Measure> {
  const out = {} as Record<MeasureKey, Measure>;
  for (const k of Object.keys(DEFS) as MeasureKey[]) {
    const m: Measure = { key: k, ...DEFS[k] };
    /* Legacy fields: measure(k).low etc. are the outpatient sample, for code that reads them directly. */
    const o = Object.prototype.hasOwnProperty.call(RANGES, k) ? RANGES[k as keyof typeof RANGES].outpatient : undefined;
    if (o) {
      if (o.low !== undefined) m.low = o.low;
      if (o.high !== undefined) m.high = o.high;
      if (o.critLow !== undefined) m.critLow = o.critLow;
      if (o.critHigh !== undefined) m.critHigh = o.critHigh;
    }
    out[k] = m;
  }
  return out;
}

/** Every measure with its label, LOINC, UCUM unit and precision `p`. */
export const MEASURES: Readonly<Record<MeasureKey, Measure>> = build();

const BY_LOINC: Record<string, Measure> = {};
for (const m of Object.values(MEASURES)) BY_LOINC[m.loinc] = m;

/** Finds a measure by key ('potassium'), LOINC code ('2823-3') or set alias ('K'); null when unknown. */
export function measure(keyOrLoinc: string | null | undefined): Measure | null {
  if (keyOrLoinc == null) return null;
  const direct = ownValue(MEASURES as Record<string, Measure>, keyOrLoinc) ?? ownValue(BY_LOINC, keyOrLoinc);
  if (direct) return direct;
  const alias = ownValue(RANGE_ALIASES, keyOrLoinc);
  return (alias && ownValue(MEASURES as Record<string, Measure>, alias)) || null;
}
