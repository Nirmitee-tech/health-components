/*
 * Private helpers for the inpatient flow components (BedBoard, ADTPanel, CensusList, DischargeChecklist,
 * AfterVisitSummary, MedReconciliation, OrderReconciliation, InpatientOrderEntry, CodeBlueTimer, RapidResponsePanel).
 * Ported from the ext: inpatient-flow helpers (Value, Dose, MedCell, DecisionGroup, useClock, mmss).
 *
 * Label, display unit and decimals live here; ranges and flags always come from the shared registry in
 * src/clinical (rangeFor / flag) with the section default context 'inpatient'. A range passed with the value as
 * `range: [low, high]` is the lab's and always wins.
 */
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import {
  FLAGS,
  doseNumber,
  doseUnit,
  flag as computeFlag,
  isCriticalFlagCode,
  isFiniteNumber,
  number,
  range as rangeText,
  rangeFor,
  useRangeContext,
  type FlagCode,
  type RangeContextId,
  type RangeLimits,
} from '../clinical';
import { cx } from './cx';

/** The inpatient flow parts default to the 'inpatient' range context (for example glucose 70-180 mg/dL). */
export const INPATIENT_DEFAULT_CONTEXT: RangeContextId = 'inpatient';

/** A measure key the inpatient flow parts know: label, unit and decimals. */
export type InpatientMeasureKey =
  | 'hr'
  | 'sbp'
  | 'dbp'
  | 'map'
  | 'rr'
  | 'spo2'
  | 'temp'
  | 'glucose'
  | 'lactate'
  | 'k'
  | 'creat'
  | 'etco2'
  | 'weight'
  | 'age'
  | 'los';

interface MeasureDisplay {
  unit: string;
  dp: number;
  label: string;
}

/** Display only (label, unit, decimals). Ranges are never kept here: they come from the shared registry. */
export const INPATIENT_MEASURES: Readonly<Record<InpatientMeasureKey, MeasureDisplay>> = {
  hr: { unit: 'bpm', dp: 0, label: 'Heart rate' },
  sbp: { unit: 'mmHg', dp: 0, label: 'Systolic BP' },
  dbp: { unit: 'mmHg', dp: 0, label: 'Diastolic BP' },
  map: { unit: 'mmHg', dp: 0, label: 'MAP' },
  rr: { unit: '/min', dp: 0, label: 'Resp rate' },
  spo2: { unit: '%', dp: 0, label: 'SpO2' },
  temp: { unit: '°C', dp: 1, label: 'Temp' },
  glucose: { unit: 'mg/dL', dp: 0, label: 'Glucose' },
  lactate: { unit: 'mmol/L', dp: 1, label: 'Lactate' },
  k: { unit: 'mmol/L', dp: 1, label: 'Potassium' },
  creat: { unit: 'mg/dL', dp: 2, label: 'Creatinine' },
  etco2: { unit: 'mmHg', dp: 0, label: 'EtCO2' },
  weight: { unit: 'kg', dp: 1, label: 'Weight' },
  age: { unit: 'y', dp: 0, label: 'Age' },
  los: { unit: 'd', dp: 0, label: 'Length of stay' },
};

function measureOf(key: string | undefined): MeasureDisplay | undefined {
  return key && Object.prototype.hasOwnProperty.call(INPATIENT_MEASURES, key)
    ? INPATIENT_MEASURES[key as InpatientMeasureKey]
    : undefined;
}

/** One clinical number on an inpatient screen: a vital, a lab or a result. */
export interface InpatientMeasureValue {
  /** Measure key: 'hr' | 'sbp' | 'dbp' | 'map' | 'rr' | 'spo2' | 'temp' | 'glucose' | 'lactate' | 'k' | 'creat' | 'etco2' | 'weight' | 'age' | 'los' */
  measure: InpatientMeasureKey;
  /** The measured value; null shows '--' */
  value: number | null;
  /** Lab reference range [low, high]; wins over the shared registry; default the registry range for the context */
  range?: readonly [number | null, number | null];
  /** When it was taken ('14:02'); default none */
  taken?: string;
  /** Flag override; null hides the computed flag; default computed from the shared registry */
  flag?: FlagCode | null;
  /** Unit override; default the measure's unit */
  unit?: string;
  /** Decimals override; default the measure's */
  dp?: number;
  /** Label override; default the measure's */
  label?: string;
}

/** The range that applies: the shared registry's for a known measure (lab range wins), else the lab range alone. */
export function inpatientRange(
  measure: string | undefined,
  range: InpatientMeasureValue['range'],
  ctx: RangeContextId
): RangeLimits {
  const refLow = range ? range[0] : undefined;
  const refHigh = range ? range[1] : undefined;
  if (measureOf(measure)) return rangeFor(measure, { context: ctx, refLow, refHigh });
  const r: RangeLimits = {};
  if (refLow != null) r.refLow = refLow;
  if (refHigh != null) r.refHigh = refHigh;
  return r;
}

/** Flag from the shared registry; null when in range, unknown or not a number. */
export function inpatientFlag(
  measure: string | undefined,
  value: number | null | undefined,
  range: InpatientMeasureValue['range'],
  ctx: RangeContextId
): FlagCode | null {
  if (value == null || !measureOf(measure)) return null;
  const f = computeFlag(Number(value), inpatientRange(measure, range, ctx));
  return f === 'N' ? null : f;
}

/** True for LL / HH / AA. */
export const isCritical = isCriticalFlagCode;

function numText(v: number | string, dp: number): string {
  const n = Number(v);
  return isFiniteNumber(n) ? number(n, dp) : String(v);
}

/** Plain text of a value with its unit: '86 %', '38.9 °C'. */
export function inpatientText(measure: string, v: number | null): string {
  const m = measureOf(measure);
  if (v == null) return '--';
  return m ? numText(v, m.dp) + ' ' + m.unit : String(v);
}

/** Label of a measure ('Resp rate'), or the key itself when unknown. */
export function inpatientLabel(measure: string): string {
  return measureOf(measure)?.label ?? measure;
}

/** Seconds to mm:ss ('05:31'). */
export function mmss(sec: number): string {
  const s0 = Math.max(0, Math.floor(sec));
  const m = Math.floor(s0 / 60);
  const s = s0 % 60;
  return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
}

const FLAG_MARK: Partial<Record<FlagCode, string>> = {
  HH: 'H!',
  LL: 'L!',
  AA: 'A!',
};

export interface ValueProps extends Partial<InpatientMeasureValue> {
  /** 'dose' writes the number the ISMP way (no trailing zero, leading zero) */
  kind?: 'dose';
  /** Shows the label before the value */
  showLabel?: boolean;
  /** Shows the reference range after the value */
  showRange?: boolean;
  /** Range context override; default the nearest provider, else 'inpatient' */
  rangeContext?: RangeContextId;
}

/** One clinical number: the digits, unit and flag, with one sentence for screen readers. */
export function Value({
  measure,
  value,
  range,
  flag: flagProp,
  unit: unitProp,
  dp: dpProp,
  label: labelProp,
  kind,
  showLabel = false,
  showRange = false,
  rangeContext,
}: ValueProps) {
  const ctx = useRangeContext(INPATIENT_DEFAULT_CONTEXT, rangeContext);
  const m = measureOf(measure);
  const isDose = kind === 'dose';
  const dp = dpProp != null ? dpProp : m ? m.dp : 0;
  const unit = isDose ? doseUnit(unitProp) : unitProp || (m ? m.unit : '');
  const r = isDose ? {} : inpatientRange(measure, range, ctx);
  const txt = value == null ? '--' : isDose ? doseNumber(value) : numText(value, dp);
  const f = isDose ? null : flagProp !== undefined ? flagProp : inpatientFlag(measure, value, range, ctx);
  const shownFlag = f && f !== 'N' ? f : null;
  const rng = rangeText(r, dp, unit) || null;
  const label = labelProp || (m ? m.label : '');
  const words =
    (label ? label + ' ' : '') +
    txt +
    (unit ? ' ' + unit : '') +
    (shownFlag ? ', ' + FLAGS[shownFlag].text : '') +
    (rng ? ', Reference ' + rng : '');
  return (
    <span
      className={cx(
        'ip-v',
        (shownFlag === 'H' || shownFlag === 'A') && 'is-h',
        shownFlag === 'L' && 'is-l',
        isCritical(shownFlag) && 'is-crit'
      )}
      title={rng ? 'Reference ' + rng : undefined}
    >
      <span className="co-sr">{words}</span>
      {showLabel && label ? (
        <span className="ip-v-r" aria-hidden="true">
          {label + ' '}
        </span>
      ) : null}
      <span aria-hidden="true">{txt}</span>
      {unit ? (
        <span className="ip-v-u" aria-hidden="true">
          {unit}
        </span>
      ) : null}
      {shownFlag ? (
        <span className="ip-flag" aria-hidden="true">
          {FLAG_MARK[shownFlag] ?? shownFlag}
        </span>
      ) : null}
      {showRange && rng ? (
        <span className="ip-v-r" aria-hidden="true">
          ({rng})
        </span>
      ) : null}
    </span>
  );
}

/** A drug dose: '0.5 mg', never '.5 mg' or '5.0 mg'. */
export function Dose({ value, unit }: { value: number | string; unit?: string }) {
  return <Value kind="dose" value={typeof value === 'number' ? value : Number(value)} unit={unit} />;
}

/** One medicine on a list. */
export interface InpatientMedication {
  /** Drug name ('Furosemide') */
  name: string;
  /** Dose amount */
  dose: number;
  /** Dose unit ('mg', 'units') */
  unit: string;
  /** Route ('PO', 'IV'); default none */
  route?: string;
  /** Frequency ('BID', 'q6h'); default none */
  freq?: string;
  /** PRN reason ('pain'); default not PRN */
  prn?: string;
}

/** Plain-text medicine: 'Furosemide 40 mg PO BID'. */
export function medText(m: InpatientMedication | null | undefined): string {
  return m
    ? m.name +
        ' ' +
        doseNumber(m.dose) +
        ' ' +
        doseUnit(m.unit) +
        (m.route ? ' ' + m.route : '') +
        (m.freq ? ' ' + m.freq : '')
    : '';
}

/** A medicine cell: bold name and dose, sig underneath; `empty` text when there is none. */
export function MedCell({
  med,
  empty,
  struck,
}: {
  med?: InpatientMedication | null;
  empty?: string;
  struck?: boolean;
}) {
  if (!med) return <span className="ip-none">{empty || 'Not on list'}</span>;
  return (
    <div className={cx('ip-med', struck && 'ip-strike')}>
      <b>{med.name} </b>
      <Dose value={med.dose} unit={med.unit} />
      <div className="ip-sig">
        {[med.route, med.freq, med.prn ? 'PRN ' + med.prn : null].filter(Boolean).join(' · ')}
      </div>
    </div>
  );
}

/**
 * A segmented radio group of decisions (Continue / Modify / Stop / New). WAI-ARIA radio group: one tab stop,
 * arrow keys move and select, Home / End jump.
 */
export function DecisionGroup<D extends string>({
  label,
  value,
  options,
  disabled,
  onChange,
}: {
  label: string;
  value?: D | null;
  options: readonly D[];
  disabled?: boolean;
  onChange: (d: D) => void;
}) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const cur = value != null ? options.indexOf(value) : -1;
  const focusIdx = cur >= 0 ? cur : 0;
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let n = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % options.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + options.length) % options.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = options.length - 1;
    if (n < 0) return;
    e.preventDefault();
    onChange(options[n]!);
    refs.current[n]?.focus();
  };
  return (
    <div className="ip-dec" role="radiogroup" aria-label={label} aria-disabled={disabled || undefined}>
      {options.map((o, i) => {
        const on = value === o;
        return (
          <button
            key={o}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={i === focusIdx ? 0 : -1}
            className={on ? 'on-' + o : undefined}
            disabled={disabled}
            onClick={() => onChange(o)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {o.charAt(0).toUpperCase() + o.slice(1)}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Seconds elapsed since `start` (epoch ms). `now` freezes the clock (review and tests). Otherwise it ticks every
 * second while `running`; the interval is cleared on unmount, when `now` is passed or when `running` turns false.
 * SSR safe: the first render (server and hydration) uses `start` (or `now`), never Date.now(); the clock catches up
 * in an effect.
 */
export function useClock(start: number | undefined, now?: number, running = true): number {
  /* No start given: the clock starts at mount. Held in state so it does not reset on every render. */
  const [origin, setOrigin] = useState<number | null>(start ?? null);
  const [tick, setTick] = useState<number | null>(null);
  const effectiveStart = start ?? origin;
  useEffect(() => {
    if (start == null && origin == null) setOrigin(Date.now());
  }, [start, origin]);
  useEffect(() => {
    if (now != null) return;
    setTick(Date.now());
    if (!running) return;
    const t = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(t);
  }, [now, running]);
  if (effectiveStart == null) return 0;
  const cur = now != null ? now : tick != null ? tick : effectiveStart;
  return Math.max(0, (cur - effectiveStart) / 1000);
}
