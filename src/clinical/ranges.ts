/*
 * Reference ranges and flags: ONE registry for every CareOS set.
 * Ported from CareOS.fmt (ext: clinical-values). Pure functions, no DOM, SSR safe.
 *
 * SAMPLE VALUES, NOT CLINICAL GUIDANCE. A live result carries the performing lab's range (FHIR
 * Observation.referenceRange), and that range always wins over anything here. Keyed by measure key; LOINC codes and
 * the sets' own keys resolve through RANGE_LOINC and RANGE_ALIASES.
 * Contexts: outpatient (default adult), inpatient, ed, pediatric (age bands), pregnancy. A context a measure does not
 * define falls back to outpatient, so ED values equal outpatient adult unless an ed entry is written.
 * Each band: low/high = reference edges, critLow/critHigh = critical edges (strict < and >, see `flag`).
 */
import type { IconName } from '../components/Icon/Icon';
import { ownValue } from './own';
import { isFiniteNumber, number, unitLabel } from './units';

/** The range contexts, in the order the brand book lists them. */
export const RANGE_CONTEXTS = ['outpatient', 'inpatient', 'ed', 'pediatric', 'pregnancy'] as const;

/** Which registry range applies: 'outpatient' (default adult) | 'inpatient' | 'ed' | 'pediatric' | 'pregnancy'. */
export type RangeContextId = (typeof RANGE_CONTEXTS)[number];

/** Interpretation code (HL7 v2 OBX-8 / FHIR ObservationInterpretation subset). */
export type FlagCode = 'N' | 'L' | 'H' | 'LL' | 'HH' | 'A' | 'AA';

/** Visual tone of a flag: grey, amber or solid red. */
export type FlagTone = 'neutral' | 'warning' | 'critical';

/** What a flag code shows: the screen-reader word, the tone and the icon. */
export interface FlagInfo {
  /** Word shown on screen for critical flags and always given to screen readers ('Critical high'). */
  text: string;
  /** Visual tone. */
  tone: FlagTone;
  /** Icon drawn with the letter. */
  icon: IconName;
}

/** Text, tone and icon per flag code. Flags are never colour alone: letter, icon and word. */
export const FLAGS: Readonly<Record<FlagCode, FlagInfo>> = {
  N: { text: 'Normal', tone: 'neutral', icon: 'check' },
  L: { text: 'Low', tone: 'warning', icon: 'sort-down' },
  H: { text: 'High', tone: 'warning', icon: 'sort-up' },
  LL: { text: 'Critical low', tone: 'critical', icon: 'alert' },
  HH: { text: 'Critical high', tone: 'critical', icon: 'alert' },
  A: { text: 'Abnormal', tone: 'warning', icon: 'alert-circle' },
  AA: { text: 'Critical abnormal', tone: 'critical', icon: 'alert' },
};

/** True for the critical codes LL, HH and AA (VitalSign's isCriticalFlag ignores AA). */
export function isCriticalFlagCode(f: FlagCode | null | undefined): boolean {
  return f === 'LL' || f === 'HH' || f === 'AA';
}

/** One range band in the registry: reference edges and critical edges, all optional (one-sided ranges). */
export interface RangeBand {
  /** Reference low edge; a value strictly below flags L. */
  low?: number;
  /** Reference high edge; a value strictly above flags H. */
  high?: number;
  /** Critical low edge; a value strictly below flags LL. */
  critLow?: number;
  /** Critical high edge; a value strictly above flags HH. */
  critHigh?: number;
}

/** A pediatric age band: applies when minAgeY <= ageYears < maxAgeY. */
export interface AgeBand extends RangeBand {
  /** Band name shown to people ('1-5 y', 'under 1 month'). */
  label: string;
  /** Lower age bound in years, inclusive. */
  minAgeY: number;
  /** Upper age bound in years, exclusive. */
  maxAgeY: number;
}

/** A measure's ranges per context. Only `outpatient` is required; missing contexts fall back to it. */
export interface RangeEntry {
  outpatient: RangeBand;
  inpatient?: RangeBand;
  ed?: RangeBand;
  pregnancy?: RangeBand;
  /** Age bands, youngest first. */
  pediatric?: AgeBand[];
  /** Provenance of the values: RANGE_SOURCE for the built-in samples. */
  source: string;
}

/** The `source` of every built-in range. */
export const RANGE_SOURCE = 'sample value, not clinical guidance';

function R(low: number | null, high?: number | null, critLow?: number | null, critHigh?: number | null): RangeBand {
  const o: RangeBand = {};
  if (low != null) o.low = low;
  if (high != null) o.high = high;
  if (critLow != null) o.critLow = critLow;
  if (critHigh != null) o.critHigh = critHigh;
  return o;
}
function band(label: string, minAgeY: number, maxAgeY: number, r: RangeBand): AgeBand {
  return { label, minAgeY, maxAgeY, ...r };
}
function entry(e: Omit<RangeEntry, 'source'>): RangeEntry {
  return { ...e, source: RANGE_SOURCE };
}

/**
 * The shared range registry, keyed by measure key. SAMPLE VALUES, NOT CLINICAL GUIDANCE: each entry has
 * `source: 'sample value, not clinical guidance'`. A deployment replaces entries with its own reviewed ranges or,
 * better, passes the performing lab's range (refLow/refHigh) on each result.
 */
export const RANGES = {
  bpSys: entry({
    outpatient: R(90, 129, 70, 180),
    inpatient: R(90, 139, 70, 180),
    pregnancy: R(90, 139, 70, 159),
    pediatric: [band('1-12 y', 1, 13, R(85, 115, 60, 140)), band('13-17 y', 13, 18, R(90, 129, 70, 160))],
  }),
  bpDia: entry({
    outpatient: R(60, 79, 40, 120),
    inpatient: R(60, 89, 40, 120),
    pregnancy: R(60, 89, 40, 109),
    pediatric: [band('1-12 y', 1, 13, R(50, 75, 35, 100)), band('13-17 y', 13, 18, R(60, 79, 40, 110))],
  }),
  map: entry({ outpatient: R(65, 110, 55, 130) }),
  hr: entry({
    outpatient: R(60, 100, 40, 150),
    pregnancy: R(60, 110, 40, 150),
    pediatric: [
      band('under 1 y', 0, 1, R(100, 160, 80, 200)),
      band('1-5 y', 1, 6, R(80, 140, 60, 180)),
      band('6-12 y', 6, 13, R(70, 120, 50, 160)),
      band('13-17 y', 13, 18, R(60, 100, 40, 150)),
    ],
  }),
  rr: entry({
    outpatient: R(12, 20, 8, 30),
    pediatric: [
      band('under 1 y', 0, 1, R(30, 60, 20, 70)),
      band('1-5 y', 1, 6, R(24, 40, 16, 50)),
      band('6-12 y', 6, 13, R(18, 30, 12, 40)),
      band('13-17 y', 13, 18, R(12, 20, 8, 30)),
    ],
  }),
  temp: entry({ outpatient: R(36.1, 37.2, 35.0, 40.0), inpatient: R(36.1, 37.9, 35.0, 40.0), ed: R(36.1, 37.9, 35.0, 40.0) }),
  spo2: entry({ outpatient: R(95, 100, 88), inpatient: R(92, 100, 88) }),
  etco2: entry({ outpatient: R(35, 45, 25, 60) }),
  gcs: entry({ outpatient: R(15, 15, 9) }),
  bmi: entry({ outpatient: R(18.5, 24.9) }),
  pain: entry({ outpatient: R(0, 3) }),
  glucose: entry({
    outpatient: R(70, 99, 54, 400),
    inpatient: R(70, 180, 54, 400),
    pregnancy: R(70, 94, 54, 400),
    pediatric: [band('under 1 month', 0, 1 / 12, R(50, 99, 40, 300)), band('1 month-17 y', 1 / 12, 18, R(70, 99, 54, 400))],
  }),
  potassium: entry({
    outpatient: R(3.5, 5.1, 2.8, 6.2),
    pediatric: [band('under 1 month', 0, 1 / 12, R(3.7, 5.9, 2.8, 7.0)), band('1 month-17 y', 1 / 12, 18, R(3.4, 4.7, 2.8, 6.0))],
  }),
  sodium: entry({ outpatient: R(136, 145, 120, 160) }),
  chloride: entry({ outpatient: R(98, 107) }),
  bicarbonate: entry({ outpatient: R(22, 29, 10, 40) }),
  bun: entry({ outpatient: R(7, 20) }),
  creatinine: entry({
    outpatient: R(0.74, 1.35),
    pregnancy: R(0.4, 0.8),
    pediatric: [band('1-5 y', 0, 6, R(0.2, 0.5)), band('6-12 y', 6, 13, R(0.3, 0.7)), band('13-17 y', 13, 18, R(0.5, 1.0))],
  }),
  egfr: entry({ outpatient: R(60) }),
  calcium: entry({ outpatient: R(8.6, 10.3, 6.0, 13.0) }),
  magnesium: entry({ outpatient: R(1.7, 2.2, 1.0, 4.9) }),
  a1c: entry({ outpatient: R(4.0, 5.6) }),
  ldl: entry({ outpatient: R(null, 99) }),
  tsh: entry({ outpatient: R(0.4, 4.5), pregnancy: R(0.1, 2.5) }),
  alt: entry({ outpatient: R(7, 56) }),
  inr: entry({ outpatient: R(0.8, 1.1, null, 5.0) }),
  hgb: entry({
    outpatient: R(13.2, 16.6, 7.0, 20.0),
    pregnancy: R(11.0, 15.0, 7.0, 20.0),
    pediatric: [
      band('6 months-5 y', 0, 6, R(11.0, 14.0, 7.0, 20.0)),
      band('6-12 y', 6, 13, R(11.5, 15.5, 7.0, 20.0)),
      band('13-17 y', 13, 18, R(12.0, 16.0, 7.0, 20.0)),
    ],
  }),
  wbc: entry({
    outpatient: R(3.4, 9.6, 1.0, 30.0),
    pediatric: [band('1-5 y', 0, 6, R(5.5, 15.5, 1.0, 30.0)), band('6-17 y', 6, 18, R(4.5, 13.5, 1.0, 30.0))],
  }),
  anc: entry({ outpatient: R(1.5, null, 0.5) }),
  plt: entry({ outpatient: R(135, 317, 20, 1000) }),
  bnp: entry({ outpatient: R(null, 125) }),
  trop: entry({ outpatient: R(null, 34) }),
  lactate: entry({ outpatient: R(0.5, 2.2, null, 4.0) }),
  vanc: entry({ outpatient: R(10, 20, null, 25) }),
  crcl: entry({ outpatient: R(60, null, 15) }),
  phq9: entry({ outpatient: R(null, 9, null, 19) }),
  iop: entry({ outpatient: R(10, 21, null, 29) }),
  dbhl: entry({ outpatient: R(null, 25, null, 90) }),
  uoRate: entry({ outpatient: R(0.5) }),
  fhr: entry({ outpatient: R(110, 160, 100, 180) }),
  contractions: entry({ outpatient: R(0, 5, null, 6) }),
  oxytocin: entry({ outpatient: R(null, 20, null, 30) }),
  rom: entry({ outpatient: R(null, 18, null, 24) }),
  ebl: entry({ outpatient: R(null, 500, null, 1000) }),
} satisfies Record<string, RangeEntry>;

/** A key of the range registry (`'potassium'`, `'bpSys'`, `'uoRate'`...). */
export type RangeKey = keyof typeof RANGES;

/** LOINC code to range key. */
export const RANGE_LOINC: Readonly<Record<string, RangeKey>> = {
  '8480-6': 'bpSys', '8462-4': 'bpDia', '8478-0': 'map', '8867-4': 'hr', '9279-1': 'rr', '8310-5': 'temp', '59408-5': 'spo2',
  '19889-5': 'etco2', '9269-2': 'gcs', '39156-5': 'bmi', '72514-3': 'pain', '2345-7': 'glucose', '2823-3': 'potassium',
  '2951-2': 'sodium', '2075-0': 'chloride', '1963-8': 'bicarbonate', '3094-0': 'bun', '2160-0': 'creatinine', '98979-8': 'egfr',
  '17861-6': 'calcium', '19123-9': 'magnesium', '4548-4': 'a1c', '13457-7': 'ldl', '3016-3': 'tsh', '1742-6': 'alt', '6301-6': 'inr',
  '718-7': 'hgb', '6690-2': 'wbc', '751-8': 'anc', '777-3': 'plt', '33762-6': 'bnp', '89579-7': 'trop', '2524-7': 'lactate',
  '4092-3': 'vanc', '44261-6': 'phq9', '55283-6': 'fhr',
};

/** The sets' own measure keys ('K', 'SpO2', 'creat'...), so every set looks up the same registry entry. */
export const RANGE_ALIASES: Readonly<Record<string, RangeKey>> = {
  sbp: 'bpSys', SBP: 'bpSys', dbp: 'bpDia', DBP: 'bpDia', HR: 'hr', RR: 'rr', Temp: 'temp', SpO2: 'spo2', BMI: 'bmi', Pain: 'pain',
  nprs: 'pain', Glu: 'glucose', k: 'potassium', K: 'potassium', Na: 'sodium', Cl: 'chloride', CO2: 'bicarbonate', BUN: 'bun',
  creat: 'creatinine', Cr: 'creatinine', cr: 'creatinine', eGFR: 'egfr', Ca: 'calcium', Mg: 'magnesium', A1c: 'a1c', LDL: 'ldl',
  TSH: 'tsh', ALT: 'alt', INR: 'inr', Hgb: 'hgb', WBC: 'wbc', Plt: 'plt', BNP: 'bnp', Trop: 'trop', Lact: 'lactate', Vanc: 'vanc',
  CrCl: 'crcl', PHQ9: 'phq9',
};

/** True when `c` is one of RANGE_CONTEXTS. */
export function isRangeContext(c: unknown): c is RangeContextId {
  return typeof c === 'string' && (RANGE_CONTEXTS as readonly string[]).includes(c);
}

/** Resolves a measure key, set alias or LOINC code to a registry key; null when the registry has no entry. */
export function rangeKey(k: string | null | undefined): RangeKey | null {
  if (k == null) return null;
  if (Object.prototype.hasOwnProperty.call(RANGES, k)) return k as RangeKey;
  return ownValue(RANGE_ALIASES, k) ?? ownValue(RANGE_LOINC, k) ?? null;
}

/* ---------- Global range context (the app-wide setting) ----------
   null until an app calls setRangeContext, so each set's own default (ed, inpatient) applies until then.
   Module state: on a server it is shared by every request in the process, so server code should pass the
   context explicitly (prop or RangeContextProvider) instead of calling setRangeContext per request. */
let globalCtx: RangeContextId | null = null;
const ctxSubs: Array<(c: RangeContextId | null) => void> = [];

/**
 * Sets the range context for the whole app and notifies every subscriber (useRangeContext re-renders).
 * `null` clears it. Throws for an unknown context name.
 */
export function setRangeContext(c: RangeContextId | null | undefined): void {
  if (c != null && !isRangeContext(c)) {
    throw new Error('Unknown range context: ' + String(c) + '. Use one of ' + RANGE_CONTEXTS.join(', '));
  }
  globalCtx = c || null;
  ctxSubs.slice().forEach((f) => f(globalCtx));
}

/** The global range context, or null when none is set. */
export function getRangeContext(): RangeContextId | null {
  return globalCtx;
}

/** Subscribes to global range context changes; returns the unsubscribe function. */
export function onRangeContext(f: (c: RangeContextId | null) => void): () => void {
  ctxSubs.push(f);
  return () => {
    const i = ctxSubs.indexOf(f);
    if (i >= 0) ctxSubs.splice(i, 1);
  };
}

/**
 * Which context applies. Precedence: `prop` (component prop or provider) > global setting > the set's default
 * (`setDefault`, e.g. 'ed' or 'inpatient') > 'outpatient'. The lab range on a result is not a context: it beats all
 * of these inside rangeFor.
 */
export function resolveContext(prop?: RangeContextId | null, setDefault?: RangeContextId | null): RangeContextId {
  return prop || globalCtx || setDefault || 'outpatient';
}

function pickBand(bands: readonly AgeBand[], ageY: number | null | undefined): AgeBand {
  if (isFiniteNumber(ageY)) for (const b of bands) if (ageY >= b.minAgeY && ageY < b.maxAgeY) return b;
  /* No (matching) age: the oldest band, so a missing age never makes a child's range look like an infant's. */
  return bands[bands.length - 1]!;
}

/** Options for rangeFor and the measure form of flag. Lab values (FHIR Observation.referenceRange) win. */
export interface RangeOptions {
  /** Explicit context; resolved with resolveContext (so the global setting applies when omitted). */
  context?: RangeContextId | null;
  /** Lab reference low. Passing refLow or refHigh replaces both registry reference edges. */
  refLow?: number | null;
  /** Lab reference high. Passing refLow or refHigh replaces both registry reference edges. */
  refHigh?: number | null;
  /** Lab critical low; replaces the registry's when passed. */
  critLow?: number | null;
  /** Lab critical high; replaces the registry's when passed. */
  critHigh?: number | null;
  /** Patient age in years; picks the pediatric band. */
  ageYears?: number | null;
}

/** Reference and critical edges, as flag and range read them. */
export interface RangeLimits {
  refLow?: number | null;
  refHigh?: number | null;
  critLow?: number | null;
  critHigh?: number | null;
}

/** What rangeFor returns: the edges that apply and where they came from. */
export interface ResolvedRange {
  refLow?: number;
  refHigh?: number;
  critLow?: number;
  critHigh?: number;
  /** Registry context actually used (after fallback to outpatient); null when the measure is not in the registry. */
  context: RangeContextId | null;
  /** Pediatric band label when a band was used, else null. */
  band: string | null;
  /** 'lab' when a lab range was passed, RANGE_SOURCE for a registry range, 'none' when neither. */
  source: string;
  /** Registry key the measure resolved to, or null. */
  measure: RangeKey | null;
}

/**
 * The range that applies to a measure (key, alias or LOINC). A lab range (refLow or refHigh passed) replaces the
 * reference edges whole; lab critical edges replace the registry's when passed. A context the measure does not
 * define falls back to outpatient; `pediatric` picks the band by `ageYears` (oldest band when no age).
 */
export function rangeFor(key: string | null | undefined, o: RangeOptions = {}): ResolvedRange {
  const k = rangeKey(key);
  const e: RangeEntry | null = k ? RANGES[k] : null;
  const ctx = resolveContext(isRangeContext(o.context) ? o.context : null);
  let base: RangeBand | null = null;
  let used: RangeContextId | null = null;
  let bd: AgeBand | null = null;
  if (e) {
    if (ctx === 'pediatric' && e.pediatric && e.pediatric.length) {
      bd = pickBand(e.pediatric, o.ageYears);
      base = bd;
      used = 'pediatric';
    } else if (ctx !== 'pediatric' && ctx !== 'outpatient' && e[ctx]) {
      base = e[ctx]!;
      used = ctx;
    } else {
      base = e.outpatient;
      used = 'outpatient';
    }
  }
  const b: RangeBand = base || {};
  const lab = o.refLow != null || o.refHigh != null;
  const out: ResolvedRange = { context: used, band: bd ? bd.label : null, source: lab ? 'lab' : e ? RANGE_SOURCE : 'none', measure: k };
  const refLow = lab ? (o.refLow != null ? o.refLow : undefined) : b.low;
  const refHigh = lab ? (o.refHigh != null ? o.refHigh : undefined) : b.high;
  const critLow = o.critLow != null ? o.critLow : b.critLow;
  const critHigh = o.critHigh != null ? o.critHigh : b.critHigh;
  if (refLow !== undefined) out.refLow = refLow;
  if (refHigh !== undefined) out.refHigh = refHigh;
  if (critLow !== undefined) out.critLow = critLow;
  if (critHigh !== undefined) out.critHigh = critHigh;
  return out;
}

/**
 * Flag from a value and its range: LL / HH when strictly outside the critical edges, L / H when strictly outside
 * the reference edges, else N. Critical uses strict < and >; a lab that defines critical as "at or below" must pass
 * its own flag.
 *
 * Two forms:
 * - `flag(value, { refLow, refHigh, critLow, critHigh })` with explicit edges;
 * - `flag(value, measure, { context, refLow, refHigh, critLow, critHigh, ageYears })`, which reads the shared
 *   registry through rangeFor so every set gets the same answer for the same value and context.
 *
 * Returns null when the value is not a finite number or there is no range at all (no edge is a number): a value
 * with nothing to compare against is not "Normal".
 */
export function flag(v: number | null | undefined, r: RangeLimits | string | null | undefined, o?: RangeOptions): FlagCode | null {
  const lim: RangeLimits | null | undefined = typeof r === 'string' ? rangeFor(r, o) : r;
  if (!isFiniteNumber(v) || !lim) return null;
  const { refLow, refHigh, critLow, critHigh } = lim;
  if (!isFiniteNumber(refLow) && !isFiniteNumber(refHigh) && !isFiniteNumber(critLow) && !isFiniteNumber(critHigh)) return null;
  if (isFiniteNumber(critLow) && v < critLow) return 'LL';
  if (isFiniteNumber(critHigh) && v > critHigh) return 'HH';
  if (isFiniteNumber(refLow) && v < refLow) return 'L';
  if (isFiniteNumber(refHigh) && v > refHigh) return 'H';
  return 'N';
}

/**
 * Reference range text at a precision with the unit label: '3.5–5.1 mmol/L', '≥ 60 mL/min/1.73m²', '≤ 99 mg/dL'.
 * The INR unit is not repeated. No reference edge gives ''.
 */
export function range(r: RangeLimits, p?: number | null, unit?: string | null): string {
  const lo = isFiniteNumber(r.refLow);
  const hi = isFiniteNumber(r.refHigh);
  const u = unitLabel(unit);
  const t =
    lo && hi
      ? number(r.refLow, p) + '–' + number(r.refHigh, p)
      : lo
        ? '≥ ' + number(r.refLow, p)
        : hi
          ? '≤ ' + number(r.refHigh, p)
          : '';
  return t ? t + (u && u !== 'INR' ? ' ' + u : '') : '';
}
