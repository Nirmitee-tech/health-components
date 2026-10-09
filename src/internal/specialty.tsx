/*
 * Private helpers of the specialty components (ext: specialty in the source): the specialty measures, the value
 * formatter `specFmt` (the source's local fmt), its text form `specText` (ft), the value cell `V` and the table `SpecTable`.
 * Every number goes through the shared clinical rules in src/clinical (number, doseNumber, money, rangeFor, flag, range):
 * this file only adds the measures fmt.MEASURES lacks and holds no range or flag logic of its own.
 * Not exported from the package.
 */
import type { ReactNode } from 'react';
import {
  doseNumber,
  flag as computeFlag,
  money,
  number,
  range,
  rangeFor,
  resolveContext,
  round,
  useRangeContext,
  type FlagCode,
  type RangeContextId,
  type ResolvedRange,
} from '../clinical';
import { ClinicalValue, type ClinicalValueSize } from '../components/ClinicalValue/ClinicalValue';
import { cx } from './cx';

/**
 * One specialty measure: unit label and decimals. `sign` always shows + or ±; `dose` is an ISMP medication amount
 * (rounded to dp, then no trailing zero); `money` is US dollars. lo/hi/clo/chi is a range passed with the value
 * (lab or regimen): it wins over the shared registry.
 */
export interface SpecMeasure {
  u: string;
  dp: number;
  sign?: boolean;
  dose?: boolean;
  money?: boolean;
  lo?: number;
  hi?: number;
  clo?: number;
  chi?: number;
}

/** The specialty measures fmt.MEASURES lacks (CareOS.specialty.MEAS). They hold no ranges: flags come from the registry. */
export const SPECIALTY_MEASURES: Readonly<Record<string, SpecMeasure>> = {
  iop: { u: 'mmHg', dp: 0 },
  sph: { u: 'D', dp: 2, sign: true },
  cyl: { u: 'D', dp: 2, sign: true },
  add: { u: 'D', dp: 2, sign: true },
  axis: { u: '°', dp: 0 },
  dbhl: { u: 'dB HL', dp: 0 },
  wt: { u: 'kg', dp: 2 },
  len: { u: 'cm', dp: 1 },
  hc: { u: 'cm', dp: 1 },
  bmi: { u: 'kg/m²', dp: 1 },
  mwt: { u: 'kg', dp: 1 },
  fh: { u: 'cm', dp: 0 },
  fhr: { u: 'bpm', dp: 0 },
  sbp: { u: 'mmHg', dp: 0 },
  dbp: { u: 'mmHg', dp: 0 },
  mgkg: { u: 'mg/kg', dp: 1, dose: true },
  mg: { u: 'mg', dp: 1, dose: true },
  ml: { u: 'mL', dp: 1, dose: true },
  conc: { u: 'mg/mL', dp: 1, dose: true },
  mgm2: { u: 'mg/m²', dp: 0, dose: true },
  bsa: { u: 'm²', dp: 2 },
  anc: { u: '×10⁹/L', dp: 1 },
  plt: { u: '×10⁹/L', dp: 0 },
  cr: { u: 'mg/dL', dp: 2 },
  hgb: { u: 'g/dL', dp: 1 },
  mm: { u: 'mm', dp: 0 },
  m: { u: 'm', dp: 0 },
  pct: { u: '%', dp: 0 },
  pts: { u: 'points', dp: 0 },
  nprs: { u: '/10', dp: 0 },
  deg: { u: '°', dp: 0 },
  usd: { u: '', dp: 2, money: true },
  visits: { u: 'visits', dp: 0 },
};

/** A measure key of SPECIALTY_MEASURES ('mg', 'iop', 'pts'...). Unknown keys format as unitless whole numbers. */
export type SpecMeasureKey = string;

/** Overrides for one value: any SpecMeasure field, plus the range context. */
export interface SpecOver extends Partial<SpecMeasure> {
  context?: RangeContextId | null;
}

/** What specFmt returns. `missing` when there is no number; then text is null. */
export interface SpecFormatted {
  text: string | null;
  unit: string;
  flag: Exclude<FlagCode, 'N'> | null;
  range: string;
  missing?: boolean;
  value?: number;
  m: SpecMeasure;
  r: ResolvedRange;
}

/** A value as the components receive it: a number, a numeric string (an input), or nothing. */
export type SpecInput = number | string | null | undefined;

function own(key: string): SpecMeasure | undefined {
  return Object.prototype.hasOwnProperty.call(SPECIALTY_MEASURES, key) ? SPECIALTY_MEASURES[key] : undefined;
}

/**
 * Formats one specialty value: fixed precision (or ISMP dose style, or money), sign when the measure is signed,
 * the range for the context in force (a range passed in `over` wins) and the H/L/critical flag.
 */
export function specFmt(key: SpecMeasureKey, v: SpecInput, over?: SpecOver): SpecFormatted {
  const m: SpecMeasure = { ...(own(key) || { u: '', dp: 0 }), ...(over || {}) };
  const r = rangeFor(key, {
    context: resolveContext(over && over.context),
    refLow: m.lo,
    refHigh: m.hi,
    critLow: m.clo,
    critHigh: m.chi,
  });
  const rangeText = range(r, m.dp, m.u);
  if (v == null || v === '' || isNaN(Number(v))) return { text: null, unit: m.u, flag: null, range: rangeText, missing: true, m, r };
  const n = Number(v);
  let t = m.money ? money(n) : m.dose ? (n < 0 ? '−' : '') + doseNumber(round(Math.abs(n), m.dp)) : number(n, m.dp);
  const z = round(n, m.dp);
  if (m.sign && z > 0) t = '+' + t;
  else if (m.sign && z === 0) t = '±' + t;
  const fl = computeFlag(n, r);
  return { text: t, unit: m.u, flag: fl === 'N' ? null : fl, range: rangeText, value: n, m, r };
}

/** A value as plain text with its unit ('400 mg', '12%'); 'not recorded' when missing. */
export function specText(key: SpecMeasureKey, v: SpecInput, over?: SpecOver): string {
  const f = specFmt(key, v, over);
  return f.missing ? 'not recorded' : f.text + (f.unit ? (f.unit === '%' ? '' : ' ') + f.unit : '');
}

export interface VProps {
  /** Measure key */
  k: SpecMeasureKey;
  /** The value */
  v: SpecInput;
  /** Measure or range overrides */
  over?: SpecOver;
  /** The section's default range context for this value */
  dctx?: RangeContextId;
  /** Hide the unit */
  noUnit?: boolean;
  /** Never flag */
  noFlag?: boolean;
  /** No range tooltip */
  noTip?: boolean;
  label?: string;
  size?: ClinicalValueSize;
}

/** One value through ClinicalValue: tabular digits, unit, H/L/critical flag, range in the tooltip. */
export function V({ k, v, over, dctx, noUnit, noFlag, noTip, label, size }: VProps) {
  const ctx = useRangeContext(dctx);
  const f = specFmt(k, v, { context: ctx, ...(over || {}) });
  if (f.missing) return <span className="co-mi-s co-sp-inline">Not recorded</span>;
  if (f.m.money) return <span className="co-money">{f.text}</span>;
  return (
    <ClinicalValue
      value={f.value ?? null}
      display={f.text ?? undefined}
      unit={noUnit ? '' : f.unit}
      precision={f.m.dp}
      refLow={f.r.refLow}
      refHigh={f.r.refHigh}
      critLow={f.r.critLow}
      critHigh={f.r.critHigh}
      flag={noFlag ? 'N' : undefined}
      tooltip={f.range && !noTip ? undefined : false}
      label={label}
      size={size}
    />
  );
}

/** A table row: its cells, or `{ crit, cells }` for a critical row (red background). */
export type SpecRow = ReadonlyArray<ReactNode> | { crit?: boolean; cells: ReadonlyArray<ReactNode> };

export interface SpecTableProps {
  /** Screen-reader caption */
  caption: string;
  cols: ReadonlyArray<ReactNode>;
  rows: ReadonlyArray<SpecRow>;
  /** Indexes of numeric columns (right aligned) */
  num?: ReadonlyArray<number>;
  /** First cell is a row header */
  rowHead?: boolean;
}

function isCellList(r: SpecRow): r is ReadonlyArray<ReactNode> {
  return Array.isArray(r);
}

/** The section's table: scrolls sideways, caption for screen readers, numeric columns, critical rows. */
export function SpecTable({ caption, cols, rows, num, rowHead }: SpecTableProps) {
  const isNum = (i: number) => !!num && num.includes(i);
  return (
    <div className="co-tbx">
      <table className="co-table co-sp-table">
        <caption className="co-sr">{caption}</caption>
        <thead>
          <tr>
            {cols.map((c, i) => (
              <th key={i} scope="col" className={cx('co-th-plain', isNum(i) && 'co-num')}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const cells = isCellList(r) ? r : r.cells;
            const crit = !isCellList(r) && r.crit;
            return (
              <tr key={i} className={crit ? 'is-crit' : undefined}>
                {cells.map((c, j) =>
                  j === 0 && rowHead ? (
                    <th key={j} scope="row" className="co-th-plain">
                      {c}
                    </th>
                  ) : (
                    <td key={j} className={isNum(j) ? 'co-num' : undefined}>
                      {c}
                    </td>
                  )
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Section heading inside a card (the source's small uppercase h3). */
export function SpecHeading({ children, first }: { children: ReactNode; first?: boolean }) {
  return <h3 className={cx('co-kl co-sp-h', first && 'is-first')}>{children}</h3>;
}

/** "Not recorded" style muted inline text. */
export function Muted({ children }: { children: ReactNode }) {
  return <span className="co-mi-s co-sp-inline">{children}</span>;
}
