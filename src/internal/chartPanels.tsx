/*
 * Private helpers of the chart-panels section (ChartSummary, ResultsTrendPanel, ResultsReview, StructuredDataGrid,
 * HistoryPanels, ClinicalDecisionSupportCard, PharmacyVerificationQueue...). Ported from ext: chart-panels.
 *
 * Clinical value rules. LOCAL_MEASURES holds name, LOINC, unit and decimals only; it holds no ranges. The shared
 * `fmt` supplies precision and units where it has the measure, and every reference range and critical limit from
 * its one registry (rangeFor) for the context in force. over.low/high/cl/ch is a range sent with the value (the
 * lab's, or a dose limit) and wins. The flag says where a number sits against that range; it does not check the
 * measurement.
 */
import type { ReactElement } from 'react';
import {
  flag as computeFlag,
  measure as sharedMeasure,
  number,
  range,
  rangeFor,
  rangeKey,
  RangeContextProvider,
  unitLabel,
  useRangeContext,
  type FlagCode,
  type RangeContextId,
} from '../clinical';
import { ClinicalValue } from '../components/ClinicalValue/ClinicalValue';
import { cx } from './cx';

/**
 * A measure override sent with a value: the performing lab's range, a dose limit or a measure the shared table
 * lacks. Every field is optional; a range given here wins over the shared registry.
 */
export interface ChartValueOverride {
  /** Display name; default the measure's name */
  name?: string;
  /** UCUM unit code of the value; default the measure's unit */
  unit?: string;
  /** Decimals shown; default the measure's precision */
  dp?: number;
  /** Reference low (lab range or dose minimum); default from the shared registry */
  low?: number;
  /** Reference high (lab range or usual dose maximum); default from the shared registry */
  high?: number;
  /** Critical low; default from the shared registry */
  cl?: number;
  /** Critical high (for a dose: the hard limit); default from the shared registry */
  ch?: number;
  /** Range context for this one value; default the component's */
  context?: RangeContextId | null;
}

interface LocalMeasure {
  name: string;
  loinc?: string;
  unit: string;
  dp: number;
}

/** Name, LOINC, unit and decimals of the measures the section uses. No ranges: those come from fmt.rangeFor. */
const LOCAL_MEASURES: Readonly<Record<string, LocalMeasure>> = {
  K: { name: 'Potassium', loinc: '2823-3', unit: 'mmol/L', dp: 1 },
  Na: { name: 'Sodium', loinc: '2951-2', unit: 'mmol/L', dp: 0 },
  Cl: { name: 'Chloride', loinc: '2075-0', unit: 'mmol/L', dp: 0 },
  CO2: { name: 'Bicarbonate', loinc: '1963-8', unit: 'mmol/L', dp: 0 },
  BUN: { name: 'BUN', loinc: '3094-0', unit: 'mg/dL', dp: 0 },
  Cr: { name: 'Creatinine', loinc: '2160-0', unit: 'mg/dL', dp: 2 },
  eGFR: { name: 'eGFR', loinc: '98979-8', unit: 'mL/min/1.73 m²', dp: 0 },
  Glu: { name: 'Glucose', loinc: '2345-7', unit: 'mg/dL', dp: 0 },
  Ca: { name: 'Calcium', loinc: '17861-6', unit: 'mg/dL', dp: 1 },
  Mg: { name: 'Magnesium', loinc: '19123-9', unit: 'mg/dL', dp: 1 },
  A1c: { name: 'Hemoglobin A1c', loinc: '4548-4', unit: '%', dp: 1 },
  LDL: { name: 'LDL cholesterol', loinc: '13457-7', unit: 'mg/dL', dp: 0 },
  TSH: { name: 'TSH', loinc: '3016-3', unit: 'mIU/L', dp: 2 },
  ALT: { name: 'ALT', loinc: '1742-6', unit: 'U/L', dp: 0 },
  Hgb: { name: 'Hemoglobin', loinc: '718-7', unit: 'g/dL', dp: 1 },
  WBC: { name: 'WBC', loinc: '6690-2', unit: '10³/µL', dp: 1 },
  Plt: { name: 'Platelets', loinc: '777-3', unit: '10³/µL', dp: 0 },
  INR: { name: 'INR', loinc: '6301-6', unit: 'INR', dp: 1 },
  BNP: { name: 'NT-proBNP', loinc: '33762-6', unit: 'pg/mL', dp: 0 },
  Trop: { name: 'Troponin I, hs', loinc: '89579-7', unit: 'ng/L', dp: 0 },
  Lact: { name: 'Lactate', loinc: '2524-7', unit: 'mmol/L', dp: 1 },
  Vanc: { name: 'Vancomycin trough', loinc: '4092-3', unit: 'mcg/mL', dp: 1 },
  SBP: { name: 'Systolic BP', loinc: '8480-6', unit: 'mmHg', dp: 0 },
  DBP: { name: 'Diastolic BP', loinc: '8462-4', unit: 'mmHg', dp: 0 },
  HR: { name: 'Heart rate', loinc: '8867-4', unit: '/min', dp: 0 },
  RR: { name: 'Respiratory rate', loinc: '9279-1', unit: '/min', dp: 0 },
  Temp: { name: 'Temperature', loinc: '8310-5', unit: '°C', dp: 1 },
  SpO2: { name: 'SpO2', loinc: '59408-5', unit: '%', dp: 0 },
  Wt: { name: 'Weight', loinc: '29463-7', unit: 'kg', dp: 1 },
  BMI: { name: 'BMI', loinc: '39156-5', unit: 'kg/m²', dp: 1 },
  CrCl: { name: 'CrCl (Cockcroft-Gault)', unit: 'mL/min', dp: 0 },
  PHQ9: { name: 'PHQ-9', loinc: '44261-6', unit: 'score', dp: 0 },
  Pain: { name: 'Pain', loinc: '72514-3', unit: '/10', dp: 0 },
};

/** Flag words for screen readers and messages. */
export const FLAG_WORDS: Readonly<Partial<Record<FlagCode, string>>> = {
  H: 'High',
  L: 'Low',
  HH: 'Critical high',
  LL: 'Critical low',
};

/** A resolved measure: names and units from the shared table (else the local one), range from the registry. */
export interface ChartMeasure {
  key?: string;
  name: string;
  loinc?: string;
  /** UCUM unit code */
  unitCode?: string;
  /** Screen unit label */
  unit: string;
  dp: number;
  shared: boolean;
  low?: number;
  high?: number;
  cl?: number;
  ch?: number;
  context: RangeContextId | null;
}

const own = <T,>(map: Readonly<Record<string, T>>, k: string): T | undefined =>
  Object.prototype.hasOwnProperty.call(map, k) ? map[k] : undefined;

/**
 * Shared fmt measures win for name, unit and decimals (matched by key or LOINC); the local table fills the rest.
 * Ranges always come from fmt.rangeFor, keyed by code or LOINC, for over.context (else the global context, else
 * outpatient). A range in `over` wins.
 */
export function chartMeasure(code: string, over?: ChartValueOverride): ChartMeasure {
  const loc = own(LOCAL_MEASURES, code);
  const sh = sharedMeasure(code) || (loc?.loinc ? sharedMeasure(loc.loinc) : null);
  const o = over || {};
  const base = sh
    ? { key: sh.key as string, name: sh.label, loinc: sh.loinc, unitCode: sh.unit, dp: sh.p, shared: true }
    : { name: loc?.name ?? code, loinc: loc?.loinc, unitCode: loc?.unit, dp: loc?.dp ?? 1, shared: false };
  const rk = rangeKey(code) ? code : base.loinc;
  const rr = rangeFor(rk, {
    context: o.context ?? null,
    refLow: o.low ?? null,
    refHigh: o.high ?? null,
    critLow: o.cl ?? null,
    critHigh: o.ch ?? null,
  });
  const unitCode = o.unit || base.unitCode;
  return {
    ...base,
    name: o.name ?? base.name,
    dp: o.dp ?? base.dp,
    unitCode,
    unit: unitLabel(unitCode),
    low: rr.refLow,
    high: rr.refHigh,
    cl: rr.critLow,
    ch: rr.critHigh,
    context: rr.context,
  };
}

/** Reference range text of a measure, or 'No reference range'. */
export function rangeText(m: ChartMeasure): string {
  return range({ refLow: m.low, refHigh: m.high }, m.dp, m.unitCode) || 'No reference range';
}

/** A value formatted by the section rules. */
export interface ChartValueText {
  text: string;
  unit: string;
  flag: FlagCode | null;
  range: string;
  words: string;
  m: ChartMeasure;
}

/** A raw value as it arrives: a number, or the text typed in a cell. */
export type ChartRawValue = number | string | null | undefined;

function isBlank(v: ChartRawValue): v is null | undefined | '' {
  return v == null || v === '';
}

/** Formats a value with its measure. Critical limits are strict (< and >), the same rule as fmt.flag. */
export function chartValue(code: string, value: ChartRawValue, over?: ChartValueOverride): ChartValueText {
  const m = chartMeasure(code, over);
  if (isBlank(value) || isNaN(Number(value))) {
    return {
      text: isBlank(value) ? '--' : String(value),
      unit: m.unit,
      flag: null,
      range: rangeText(m),
      words: (isBlank(value) ? 'no value' : String(value)) + ' ' + m.unit,
      m,
    };
  }
  const v = Number(value);
  let f = computeFlag(v, { refLow: m.low, refHigh: m.high, critLow: m.cl, critHigh: m.ch });
  if (f === 'N') f = null;
  const t = number(v, m.dp);
  return { text: t, unit: m.unit, flag: f, range: rangeText(m), words: t + ' ' + m.unit + (f ? ', ' + (FLAG_WORDS[f] ?? f) : ''), m };
}

/** Adds the component's context to an override (the override's own context wins). */
export function withContext(over: ChartValueOverride | undefined, ctx: RangeContextId): ChartValueOverride {
  return { context: ctx, ...(over || {}) };
}

/** The most severe of a list of flags. */
export function worstFlag(flags: ReadonlyArray<FlagCode | null>): FlagCode | null {
  for (const f of ['HH', 'LL', 'H', 'L'] as const) if (flags.includes(f)) return f;
  return null;
}

export interface ValProps {
  code: string;
  value: ChartRawValue;
  over?: ChartValueOverride;
  label?: string;
  showRange?: boolean;
  noRange?: boolean;
}

/** One value: ClinicalValue for a number, else the plain section markup ('--', or the text typed). */
export function Val({ code, value, over, label, showRange, noRange }: ValProps) {
  const ctx = useRangeContext(null, null);
  const r = chartValue(code, value, withContext(over, ctx));
  const m = r.m;
  if (r.text !== '--' && !isNaN(Number(value))) {
    return (
      <span className="cp-cvw">
        <ClinicalValue
          measure={m.shared ? m.key : undefined}
          loinc={m.loinc}
          label={label || m.name}
          value={Number(value)}
          unit={m.unitCode}
          precision={m.dp}
          refLow={m.low}
          refHigh={m.high}
          critLow={m.cl}
          critHigh={m.ch}
          tooltip={noRange ? false : undefined}
          flag={r.flag || undefined}
        />
        {showRange ? <span className="cp-rr"> ({r.range})</span> : null}
      </span>
    );
  }
  return (
    <span
      className={cx('cp-v', r.flag && 'is-' + r.flag)}
      title={noRange ? undefined : 'Reference ' + r.range}
      role="img"
      aria-label={(label ? label + ' ' : '') + r.words}
    >
      <b aria-hidden="true">{r.text}</b>
      <span className="cp-u" aria-hidden="true">
        {r.unit}
      </span>
      {r.flag ? (
        <span className="cp-fl" aria-hidden="true">
          {r.flag}
        </span>
      ) : null}
      {showRange ? (
        <span className="cp-rr" aria-hidden="true">
          ({r.range})
        </span>
      ) : null}
    </span>
  );
}

/** Wraps content in a RangeContextProvider when the component got a `rangeContext` prop. */
export function withRangeProvider(rangeContext: RangeContextId | null | undefined, el: ReactElement): ReactElement {
  return rangeContext ? <RangeContextProvider value={rangeContext}>{el}</RangeContextProvider> : el;
}
