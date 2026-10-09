/*
 * Private helpers of the acute care set (ext: ed-periop): EDTrackingBoard, TriageForm, ORSchedule, SurgicalSafetyChecklist,
 * AnesthesiaRecord, PACUScore, LaborDeliveryBoard, PartogramChart, FetalMonitorStrip, ProcedureNote.
 *
 * Every number goes through `formatAcute` / `AcuteValue`: label, unit and decimals per measure here; reference ranges and
 * flags always come from the shared registry in src/clinical (rangeFor / flag), in the 'ed' context by default. A range
 * passed with a value (`lo` / `hi`: a lab range, an ESI wait target, a score target) wins over the registry.
 */
import type { ReactNode } from 'react';
import {
  flag as computeFlag,
  number,
  range as rangeText,
  rangeFor,
  resolveContext,
  useRangeContext,
  type FlagCode,
  type RangeContextId,
  type ResolvedRange,
} from '../clinical';
import { AbnormalFlag } from '../components/AbnormalFlag/AbnormalFlag';
import { cx } from './cx';

/** The set's own default range context (prop > provider > global setRangeContext > this > outpatient). */
export const ACUTE_DEFAULT_CONTEXT: RangeContextId = 'ed';

/** Label, display unit and fixed decimals of one acute care measure. */
export interface AcuteMeasure {
  label: string;
  unit: string;
  dp: number;
}

export type AcuteMeasureKey =
  | 'hr'
  | 'sbp'
  | 'dbp'
  | 'map'
  | 'rr'
  | 'spo2'
  | 'temp'
  | 'etco2'
  | 'pain'
  | 'gcs'
  | 'glucose'
  | 'fhr'
  | 'contractions'
  | 'dilation'
  | 'effacement'
  | 'oxytocin'
  | 'rom'
  | 'ebl'
  | 'urine'
  | 'fluids'
  | 'weight'
  | 'ett'
  | 'wait'
  | 'duration'
  | 'util'
  | 'score';

/** Labels, units and decimals. Ranges are not here: they come from the shared registry. */
export const ACUTE_MEASURES: Readonly<Record<AcuteMeasureKey, AcuteMeasure>> = {
  hr: { label: 'Heart rate', unit: 'bpm', dp: 0 },
  sbp: { label: 'Systolic BP', unit: 'mmHg', dp: 0 },
  dbp: { label: 'Diastolic BP', unit: 'mmHg', dp: 0 },
  map: { label: 'MAP', unit: 'mmHg', dp: 0 },
  rr: { label: 'Resp rate', unit: '/min', dp: 0 },
  spo2: { label: 'SpO2', unit: '%', dp: 0 },
  temp: { label: 'Temp', unit: '°C', dp: 1 },
  etco2: { label: 'EtCO2', unit: 'mmHg', dp: 0 },
  pain: { label: 'Pain', unit: '/10', dp: 0 },
  gcs: { label: 'GCS', unit: '/15', dp: 0 },
  glucose: { label: 'Glucose', unit: 'mg/dL', dp: 0 },
  fhr: { label: 'FHR', unit: 'bpm', dp: 0 },
  contractions: { label: 'Contractions', unit: '/10 min', dp: 0 },
  dilation: { label: 'Dilation', unit: 'cm', dp: 0 },
  effacement: { label: 'Effacement', unit: '%', dp: 0 },
  oxytocin: { label: 'Oxytocin', unit: 'mU/min', dp: 0 },
  rom: { label: 'Since ROM', unit: 'h', dp: 0 },
  ebl: { label: 'EBL', unit: 'mL', dp: 0 },
  urine: { label: 'Urine', unit: 'mL', dp: 0 },
  fluids: { label: 'Fluids in', unit: 'mL', dp: 0 },
  weight: { label: 'Weight', unit: 'kg', dp: 1 },
  ett: { label: 'ETT depth', unit: 'cm', dp: 0 },
  wait: { label: 'Wait', unit: 'min', dp: 0 },
  duration: { label: 'Duration', unit: 'min', dp: 0 },
  util: { label: 'Utilization', unit: '%', dp: 0 },
  score: { label: 'Score', unit: '/10', dp: 0 },
};

/** A range supplied with a value, and display overrides. `lo`/`hi` win over the registry. */
export interface AcuteRangeOverride {
  /** Range context; default resolved with 'ed' as the set default */
  context?: RangeContextId | null;
  /** Reference low (lab range, target) */
  lo?: number;
  /** Reference high (lab range, target) */
  hi?: number;
  /** Critical low */
  cl?: number;
  /** Critical high */
  ch?: number;
  /** Age in years, for the pediatric bands */
  ageYears?: number;
  /** Display unit for a value without a measure */
  unit?: string;
  /** Decimals for a value without a measure */
  dp?: number;
}

/** A formatted acute care value. */
export interface AcuteFormatted {
  text: string;
  unit: string;
  flag: FlagCode | null;
  range: string;
  missing?: boolean;
}

export type AcuteValueInput = number | string | null | undefined;
export type AcuteMeasureArg = AcuteMeasureKey | 'bp' | null | undefined;

function isMissing(v: AcuteValueInput): boolean {
  return v == null || v === '' || Number.isNaN(Number(v));
}

function measureOf(key: AcuteMeasureArg): AcuteMeasure | undefined {
  return key && key !== 'bp' ? ACUTE_MEASURES[key] : undefined;
}

/** The shared registry range that applies (registry key, alias or none) with the supplied range on top. */
export function acuteRange(key: string | null | undefined, over: AcuteRangeOverride = {}): ResolvedRange {
  return rangeFor(key, {
    context: resolveContext(over.context, ACUTE_DEFAULT_CONTEXT),
    refLow: over.lo,
    refHigh: over.hi,
    critLow: over.cl,
    critHigh: over.ch,
    ageYears: over.ageYears,
  });
}

/** Flag from the shared registry; null for in range or no range ('N' is not shown on these boards). */
export function acuteFlag(key: string | null | undefined, v: AcuteValueInput, over?: AcuteRangeOverride): FlagCode | null {
  if (isMissing(v)) return null;
  const f = computeFlag(Number(v), acuteRange(key, over));
  return f === 'N' ? null : f;
}

function refText(key: string | null | undefined, unit: string, dp: number, over?: AcuteRangeOverride): string {
  const t = rangeText(acuteRange(key, over), dp, unit);
  return t ? 'Reference ' + t : '';
}

const RANK: Partial<Record<FlagCode, number>> = { LL: 4, HH: 4, H: 2, L: 2 };

/**
 * Formats one value: text at the measure's precision, unit, flag and reference text.
 * `bp` takes [systolic, diastolic] and flags on the worse of the two.
 */
export function formatAcute(
  key: AcuteMeasureArg,
  value: AcuteValueInput | readonly [number, number],
  over: AcuteRangeOverride = {}
): AcuteFormatted {
  if (key === 'bp') {
    const pair = Array.isArray(value) ? (value as readonly [number, number]) : null;
    const s = pair ? pair[0] : null;
    const d = pair ? pair[1] : null;
    if (s == null || d == null) return { text: 'Not recorded', unit: '', flag: null, range: '', missing: true };
    const c = { context: over.context };
    const fs = acuteFlag('sbp', s, c);
    const fd = acuteFlag('dbp', d, c);
    const f = (RANK[fs as FlagCode] || 0) >= (RANK[fd as FlagCode] || 0) ? fs : fd;
    const rs = acuteRange('sbp', c);
    const rd = acuteRange('dbp', c);
    const range =
      rs.refLow != null && rs.refHigh != null && rd.refLow != null && rd.refHigh != null
        ? 'Reference ' + number(rs.refLow) + '/' + number(rd.refLow) + '–' + number(rs.refHigh) + '/' + number(rd.refHigh) + ' mmHg'
        : '';
    return { text: number(s, 0) + '/' + number(d, 0), unit: 'mmHg', flag: f, range };
  }
  const m = measureOf(key);
  const unit = over.unit || (m ? m.unit : '');
  const dp = over.dp != null ? over.dp : m ? m.dp : 0;
  const v = Array.isArray(value) ? null : (value as AcuteValueInput);
  if (isMissing(v)) return { text: 'Not recorded', unit: '', flag: null, range: refText(key, unit, dp, over), missing: true };
  return { text: number(Number(v), dp), unit, flag: acuteFlag(key, v, over), range: refText(key, unit, dp, over) };
}

/** Minutes as '52 min' or '5 h 10 min'. */
export function fmtMinutes(min: number | null | undefined): string {
  const m = Math.max(0, Math.round(Number(min) || 0));
  const hh = Math.floor(m / 60);
  const mm = m % 60;
  return hh ? hh + ' h ' + (mm < 10 ? '0' : '') + mm + ' min' : mm + ' min';
}

/** Minutes after midnight as 24-hour 'HH:MM'. */
export function fmtClock(min: number): string {
  const r = Math.round(min);
  const hh = Math.floor(r / 60) % 24;
  const mm = r % 60;
  return (hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm;
}

/** 'HH:MM' (or minutes) to minutes after midnight. */
export function parseClock(t: string | number): number {
  if (typeof t === 'number') return t;
  const p = String(t).split(':');
  return Number(p[0]) * 60 + Number(p[1] || 0);
}

export interface AcuteValueProps {
  /** Measure key, 'bp' for [systolic, diastolic], or null for a plain count with `range.unit` */
  measure: AcuteMeasureArg;
  /** The value; a [systolic, diastolic] pair for 'bp' */
  value: AcuteValueInput | readonly [number, number] | null;
  /** Supplied range and display overrides */
  range?: AcuteRangeOverride | null;
  /** false renders the number in normal weight; default true (bold) */
  strong?: boolean;
  /** Hides the flag tag (the number still turns red); default false */
  hideFlag?: boolean;
  /** Letter flag instead of letter and word; default false */
  shortFlag?: boolean;
  /** Text for a missing value; default 'Not recorded' */
  missingText?: string;
  /** Range context for this value; default the nearest provider, else 'ed' */
  rangeContext?: RangeContextId;
  className?: string;
}

/** One clinical value: number in tabular figures, unit, flag tag, range in the title. */
export function AcuteValue({
  measure,
  value,
  range,
  strong = true,
  hideFlag = false,
  shortFlag = false,
  missingText = 'Not recorded',
  rangeContext,
  className,
}: AcuteValueProps) {
  const ctx = useRangeContext(ACUTE_DEFAULT_CONTEXT, rangeContext);
  const f = formatAcute(measure, value, { context: ctx, ...(range || {}) });
  if (f.missing) return <span className={cx('co-mi-s co-ac-num', className)}>{missingText}</span>;
  const time = measure === 'wait' || measure === 'duration';
  const text = time ? fmtMinutes(Number(value)) : f.text;
  const label = measure === 'bp' ? 'Blood pressure' : measureOf(measure)?.label;
  const title = [label, f.range].filter(Boolean).join('. ');
  const Num = strong ? 'b' : 'span';
  return (
    <span className={cx('co-ac-v', f.flag && 'is-flag', className)} title={title || undefined}>
      <Num className="co-ac-n">{text}</Num>
      {time || !f.unit ? null : <span className="co-ac-u">{f.unit}</span>}
      {f.flag && !hideFlag ? <AbnormalFlag flag={f.flag} variant={shortFlag ? 'compact' : 'full'} /> : null}
    </span>
  );
}

/** A horizontally scrollable, keyboard-focusable table with a screen-reader caption. */
export function AcuteTable({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- scrollable region must be reachable from the keyboard.
    <div className={cx('co-tbx', className)} tabIndex={0} role="region" aria-label={label}>
      <table className="co-table">
        <caption className="co-sr">{label}</caption>
        {children}
      </table>
    </div>
  );
}

/* ---------- ESI v4 ---------- */

/** Emergency Severity Index level. */
export type ESILevel = 1 | 2 | 3 | 4 | 5;

/** Answers to ESI decision points A to D. */
export interface ESIInput {
  /** A: needs an immediate life-saving intervention */
  lifeSaving?: boolean;
  /** B: high-risk situation */
  highRisk?: boolean;
  /** B: new confusion, lethargy or disorientation */
  confused?: boolean;
  /** B: severe pain or distress */
  severePain?: boolean;
  /** C: resources expected (2 means two or more) */
  resources?: number;
  /** D: vitals for the danger zone */
  vitals?: { hr?: number | null; rr?: number | null; spo2?: number | null };
}

/** A suggested ESI level and the decision point that produced it. */
export interface ESIResult {
  level: ESILevel;
  reason: string;
}

/** Adult danger-zone vitals from the ESI v4 handbook: HR > 100, RR > 20, SpO2 < 92. */
export function dangerZone(v?: ESIInput['vitals']): string[] {
  const x = v || {};
  const out: string[] = [];
  if (x.hr != null && x.hr > 100) out.push('HR above 100');
  if (x.rr != null && x.rr > 20) out.push('RR above 20');
  if (x.spo2 != null && x.spo2 < 92) out.push('SpO2 below 92%');
  return out;
}

/** ESI v4 decision points A to D. A suggestion only; the triage nurse confirms or overrides it. */
export function esiLevel(a: ESIInput = {}): ESIResult {
  if (a.lifeSaving) return { level: 1, reason: 'Needs an immediate life-saving intervention (decision point A).' };
  if (a.highRisk || a.confused || a.severePain)
    return { level: 2, reason: 'High-risk situation, new confusion or lethargy, or severe pain or distress (decision point B).' };
  const r = Number(a.resources) || 0;
  if (r === 0) return { level: 5, reason: 'No resources expected (decision point C).' };
  if (r === 1) return { level: 4, reason: 'One resource expected (decision point C).' };
  const dz = dangerZone(a.vitals);
  if (dz.length)
    return {
      level: 2,
      reason: 'Two or more resources and danger-zone vitals: ' + dz.join(', ') + ' (decision point D). Consider ESI 2.',
    };
  return { level: 3, reason: 'Two or more resources, vitals outside the danger zone (decision point C).' };
}

/* ---------- Modified Aldrete ---------- */

export type AldreteItem = 'activity' | 'respiration' | 'circulation' | 'consciousness' | 'spo2';
/** One Aldrete item score. */
export type AldreteScore = 0 | 1 | 2;
/** Item scores; a missing item is not scored yet. */
export type AldreteValues = Partial<Record<AldreteItem, AldreteScore>>;

/** One criterion of the modified Aldrete scale with its three options (scores 0, 1, 2). */
export interface AldreteCriterion {
  id: AldreteItem;
  label: string;
  opts: readonly [string, string, string];
}

export const ALDRETE: readonly AldreteCriterion[] = [
  { id: 'activity', label: 'Activity', opts: ['Unable to move extremities', 'Moves 2 extremities on command', 'Moves 4 extremities on command'] },
  { id: 'respiration', label: 'Respiration', opts: ['Apneic', 'Dyspnea or limited breathing', 'Breathes deeply and coughs freely'] },
  { id: 'circulation', label: 'Circulation', opts: ['BP more than 50% from pre-op', 'BP within 20% to 50% of pre-op', 'BP within 20% of pre-op'] },
  { id: 'consciousness', label: 'Consciousness', opts: ['Not responding', 'Arousable on calling', 'Fully awake'] },
  { id: 'spo2', label: 'Oxygen saturation', opts: ['SpO2 below 90% even with oxygen', 'Needs oxygen to keep SpO2 above 90%', 'SpO2 above 92% on room air'] },
];

/** Result of scoring: total (null when nothing is scored), all items scored, and phase I discharge readiness. */
export interface AldreteResult {
  total: number | null;
  complete: boolean;
  ready: boolean;
}

/** Total out of 10. Ready for discharge at 9 or more with no item at 0 (common local rule; the unit sets it). */
export function aldrete(v: Partial<Record<AldreteItem, number | null>> = {}): AldreteResult {
  let any = false;
  let zero = false;
  let t = 0;
  for (const c of ALDRETE) {
    const x = v[c.id];
    if (x != null) any = true;
    if (x === 0) zero = true;
    t += Number(x) || 0;
  }
  const complete = ALDRETE.every((c) => v[c.id] != null);
  return { total: any ? t : null, complete, ready: complete && t >= 9 && !zero };
}

/** The acute care value rules (CareOS.acuteFmt in the source). */
export const acuteFmt = {
  measures: ACUTE_MEASURES,
  format: formatAcute,
  minutes: fmtMinutes,
  esiLevel,
  dangerZone,
  aldrete,
  Value: AcuteValue,
};
