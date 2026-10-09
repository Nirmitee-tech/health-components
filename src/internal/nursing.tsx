/*
 * Private helpers of the inpatient nursing set (Flowsheet, MAR, BarcodeScanPrompt, IntakeOutputPanel, NursingAssessment,
 * FallRiskScore, BradenScore, PainScale, ShiftHandoff, CarePlanByShift, WoundCareDoc).
 * Ported from the ext: inpatient-nursing section: NURSE, format, Value, Spark and ScoreForm.
 *
 * Every number goes through the shared clinical formatting (src/clinical): measures, precision, unit labels, range
 * text and the one reference range registry for flags. NURSE only adds label, unit and decimals for nursing measures
 * fmt.MEASURES lacks; it holds no ranges. A range passed with a value (`range: {low, high, critLow, critHigh}`, such as
 * a urine output target) wins over the registry. The set's default range context is 'inpatient'.
 */
import { forwardRef, useRef, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import {
  flag as computeFlag,
  measure as findMeasure,
  number,
  range as rangeText,
  rangeFor,
  unitLabel,
  useRangeContext,
  type FlagCode,
  type RangeContextId,
  type ResolvedRange,
} from '../clinical';
import { Badge, type BadgeTone } from '../components/Badge/Badge';
import { Card } from '../components/Card/Card';
import { ClinicalValue, type ClinicalValueSize } from '../components/ClinicalValue/ClinicalValue';
import { cx } from './cx';
import { useControllableState } from './hooks';

/** The nursing set's default range context, used when no prop, provider or global context applies. */
export const NURSING_CONTEXT: RangeContextId = 'inpatient';

/** A range passed with one value (lab or target range). It wins over the shared registry. */
export interface NursingRange {
  /** Reference low */
  low?: number;
  /** Reference high */
  high?: number;
  /** Critical low */
  critLow?: number;
  /** Critical high */
  critHigh?: number;
}

/** Label, UCUM unit and decimals of a measure. */
export interface NursingMeasure {
  label: string;
  unit: string;
  p: number;
}

/** Nursing measures fmt.MEASURES lacks: label, unit and decimals only (no ranges). */
export const NURSE: Readonly<Record<string, NursingMeasure>> = {
  map: { label: 'MAP', unit: 'mm[Hg]', p: 0 },
  gcs: { label: 'GCS', unit: '/15', p: 0 },
  o2: { label: 'O2 flow', unit: 'L/min', p: 1 },
  ml: { label: 'Volume', unit: 'mL', p: 0 },
  rate: { label: 'Rate', unit: 'mL/h', p: 0 },
  uoRate: { label: 'Urine output', unit: 'mL/kg/h', p: 2 },
  cm: { label: 'Length', unit: 'cm', p: 1 },
  cm2: { label: 'Area', unit: 'cm²', p: 1 },
  pct: { label: 'Percent', unit: '%', p: 0 },
  pts: { label: 'Score', unit: 'pts', p: 0 },
};

const own = <T,>(o: Readonly<Record<string, T>>, k: string): T | undefined =>
  Object.prototype.hasOwnProperty.call(o, k) ? o[k] : undefined;

/** A number from a number or numeric string; null for empty or not finite. */
export function num(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return isFinite(n) ? n : null;
}

/** The measure for a key: the shared fmt.MEASURES first (keys, aliases, LOINC), then the nursing additions. */
export function measureOf(key: string | null | undefined): NursingMeasure | null {
  if (!key) return null;
  return findMeasure(key) || own(NURSE, key) || null;
}

/** Range for one value: the range passed with it first, then the shared registry for the context. */
export function refsOf(key: string, rng: NursingRange | null | undefined, ctx: RangeContextId): ResolvedRange {
  const r = rng || {};
  return rangeFor(key, { context: ctx, refLow: r.low, refHigh: r.high, critLow: r.critLow, critHigh: r.critHigh });
}

const RANK: Partial<Record<FlagCode, number>> = { LL: 3, HH: 3, AA: 3, L: 2, H: 2, A: 2, N: 1 };

/** Options of `format`. */
export interface FormatOptions {
  /** Range passed with the value; wins over the registry */
  range?: NursingRange | null;
  /** Range context; default 'inpatient' */
  context?: RangeContextId;
  /** Decimals; default the measure's */
  dp?: number;
  /** UCUM unit; default the measure's */
  unit?: string;
  /** '+' before positive numbers */
  signed?: boolean;
  /** Never flag */
  noFlag?: boolean;
}

/** What `format` returns for one value. */
export interface Formatted {
  /** Formatted number (or the text of a non-numeric value) */
  text: string;
  /** Unit label */
  unit: string;
  /** UCUM unit */
  ucum: string;
  /** Flag outside the range; null when in range or no range */
  flag: FlagCode | null;
  /** Range text, or null */
  range: string | null;
  /** Range used */
  refs: ResolvedRange | null;
  /** Numeric value, or null */
  n: number | null;
  /** Decimals used */
  p: number;
  /** True for a non-numeric value ('Alert', '') */
  textOnly: boolean;
}

/**
 * Formats one nursing value. Blood pressure ('124/78' with measure 'bp') flags the worse of systolic and diastolic.
 * A flag says the number is outside the range used; it does not say the reading is correct.
 */
export function format(key: string | null | undefined, value: unknown, opt: FormatOptions = {}): Formatted {
  const ctx = opt.context || NURSING_CONTEXT;
  if (key === 'bp' && typeof value === 'string' && value.indexOf('/') > 0) {
    const ps = value.split('/');
    const s = num(ps[0]);
    const d = num(ps[1]);
    const rs = refsOf('bpSys', null, ctx);
    const rd = refsOf('bpDia', null, ctx);
    const fs = computeFlag(s, rs);
    const fd = computeFlag(d, rd);
    const fl = (RANK[fs as FlagCode] || 0) >= (RANK[fd as FlagCode] || 0) ? fs : fd;
    return {
      text: (s === null ? '--' : number(s, 0)) + '/' + (d === null ? '--' : number(d, 0)),
      unit: unitLabel('mm[Hg]'),
      ucum: 'mm[Hg]',
      flag: opt.noFlag || fl === 'N' ? null : fl,
      range: 'SBP ' + rangeText(rs, 0, '') + ', DBP ' + rangeText(rd, 0, 'mm[Hg]'),
      refs: null,
      n: s,
      p: 0,
      textOnly: false,
    };
  }
  const m = measureOf(key);
  const p = opt.dp != null ? opt.dp : m ? m.p : 0;
  const n = num(value);
  if (n === null) {
    return {
      text: value == null || value === '' ? '' : String(value),
      unit: '',
      ucum: '',
      flag: null,
      range: null,
      refs: null,
      n: null,
      p,
      textOnly: true,
    };
  }
  const r = refsOf(key || '', opt.range, ctx);
  const fl = opt.noFlag ? null : computeFlag(n, r);
  let t = number(n, p);
  if (opt.signed && n > 0 && t !== number(0, p)) t = '+' + t;
  const ucum = opt.unit || (m ? m.unit : '');
  return { text: t, unit: unitLabel(ucum), ucum, flag: fl === 'N' ? null : fl, range: rangeText(r, p, ucum) || null, refs: r, n, p, textOnly: false };
}

/** True for LL / HH / AA. */
export const isCritical = (f: FlagCode | null | undefined) => f === 'LL' || f === 'HH' || f === 'AA';

export interface ValueProps {
  /** Measure key (fmt.MEASURES key or a nursing key such as 'ml', 'rate', 'map', 'bp') */
  measure?: string;
  /** The value: a number, a numeric string, '120/80' for 'bp', or text */
  value: unknown;
  /** Range passed with the value */
  range?: NursingRange | null;
  /** Range context; default the nearest provider, global, else 'inpatient' */
  rangeContext?: RangeContextId | null;
  /** Label for screen readers; default the measure label */
  label?: string;
  /** Hides the unit (grid cells whose row header names it) */
  hideUnit?: boolean;
  /** Never flag */
  noFlag?: boolean;
  /** '+' before positive numbers */
  signed?: boolean;
  /** Decimals */
  dp?: number;
  /** UCUM unit */
  unit?: string;
  /** default 'sm' */
  size?: ClinicalValueSize;
  /** Text for an empty value; default '--' */
  empty?: string;
  /** Range tooltip (focusable); pass false inside buttons; default true */
  tooltip?: boolean;
}

/** Value renders one nursing number as a ClinicalValue (same markup and flags as every other CareOS screen). */
export function Value(p: ValueProps) {
  const ctx = useRangeContext(NURSING_CONTEXT, p.rangeContext);
  const f = format(p.measure, p.value, { range: p.range, context: ctx, dp: p.dp, unit: p.unit, signed: p.signed, noFlag: p.noFlag });
  if (f.textOnly) {
    return <span className="nu-cv">{f.text ? <b>{f.text}</b> : <span className="nu-muted">{p.empty || '--'}</span>}</span>;
  }
  const r = f.refs || ({} as Partial<ResolvedRange>);
  return (
    <ClinicalValue
      label={p.label || measureOf(p.measure)?.label}
      value={f.n}
      display={f.text}
      unit={p.hideUnit ? '' : f.ucum}
      precision={f.p}
      refLow={r.refLow}
      refHigh={r.refHigh}
      critLow={r.critLow}
      critHigh={r.critHigh}
      flag={p.noFlag ? 'N' : f.flag || 'N'}
      size={p.size || 'sm'}
      tooltip={p.tooltip}
    />
  );
}

export interface SparkProps {
  /** Values in column order (gaps allowed) */
  values: unknown[];
  /** Measure key */
  measure?: string;
  /** Accessible name */
  label: string;
  /** Range passed with the row */
  range?: NursingRange | null;
  /** Range context */
  rangeContext?: RangeContextId | null;
  /** default 240 */
  width?: number;
  /** default 64 */
  height?: number;
}

/** Spark is the small trend line of the Flowsheet graph view, with the reference band and flagged points. */
export function Spark(p: SparkProps) {
  const ctx = useRangeContext(NURSING_CONTEXT, p.rangeContext);
  const vals = p.values.map(num);
  const xs = vals.filter((v): v is number => v !== null);
  if (xs.length < 1) return <div className="nu-muted">No numeric values</div>;
  const W = p.width || 240;
  const H = p.height || 64;
  let mn = Math.min(...xs);
  let mx = Math.max(...xs);
  if (mx === mn) {
    mx += 1;
    mn -= 1;
  }
  const m = measureOf(p.measure);
  const y = (v: number) => 6 + (1 - (v - mn) / (mx - mn)) * (H - 12);
  const x = (i: number) => 6 + (i * (W - 12)) / Math.max(1, vals.length - 1);
  const pts: Array<[number, number, number]> = [];
  vals.forEach((v, i) => {
    if (v !== null) pts.push([x(i), y(v), v]);
  });
  const r = refsOf(p.measure || '', p.range, ctx);
  const band =
    r.refLow != null && r.refHigh != null && r.refHigh >= mn && r.refLow <= mx
      ? [y(Math.min(r.refHigh, mx)), y(Math.max(r.refLow, mn))]
      : null;
  const unit = unitLabel(m ? m.unit : '');
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height={H}
      role="img"
      aria-label={`${p.label}: ${xs.map((v) => format(p.measure, v, { context: ctx }).text).join(', ')}${unit ? ' ' + unit : ''}`}
    >
      {band ? <rect x={0} y={band[0]} width={W} height={Math.max(1, band[1]! - band[0]!)} fill="var(--co-success-soft)" /> : null}
      <polyline points={pts.map((q) => q[0] + ',' + q[1]).join(' ')} fill="none" stroke="var(--co-primary)" strokeWidth={2} />
      {pts.map((q, i) => {
        const fl = format(p.measure, q[2], { context: ctx, range: p.range }).flag;
        return (
          <circle
            key={i}
            cx={q[0]}
            cy={q[1]}
            r={3.5}
            fill={fl ? (isCritical(fl) ? 'var(--co-danger)' : 'var(--co-warning)') : 'var(--co-surface)'}
            stroke={fl ? 'none' : 'var(--co-primary)'}
            strokeWidth={2}
          />
        );
      })}
    </svg>
  );
}

/* ---------- Radio buttons (WAI-ARIA radio group: roving tabindex, arrows, Home/End) ---------- */

export interface RadioOption {
  /** React key */
  key: string | number;
  /** Button content */
  content: ReactNode;
  /** Tooltip text */
  title?: string;
}

export interface RadioButtonsProps {
  /** Accessible name of the group */
  label: string;
  /** Options */
  options: RadioOption[];
  /** Selected index, or null */
  value: number | null | undefined;
  /** Called with the picked index */
  onChange: (index: number) => void;
  /** Not selectable (still focusable); default false */
  readOnly?: boolean;
  /** Class of the radiogroup element */
  className?: string;
  /** Content before the options inside the group (heading, help) */
  header?: ReactNode;
  /** When set, the buttons are wrapped in a div with this class */
  wrapClassName?: string;
  /** Extra class on each option */
  optionClassName?: string;
}

/** A group of `nu-opt` buttons that behaves as an ARIA radio group. */
export function RadioButtons({
  label,
  options,
  value,
  onChange,
  readOnly = false,
  className,
  header,
  wrapClassName,
  optionClassName,
}: RadioButtonsProps) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const tabStop = value != null && value >= 0 && value < options.length ? value : 0;
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = options.length;
    let next: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % n;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + n) % n;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    if (next === null) return;
    e.preventDefault();
    refs.current[next]?.focus();
    if (!readOnly) onChange(next);
  };
  const buttons = options.map((o, i) => (
    <button
      key={o.key}
      ref={(el) => {
        refs.current[i] = el;
      }}
      type="button"
      role="radio"
      aria-checked={value === i}
      aria-disabled={readOnly || undefined}
      tabIndex={i === tabStop ? 0 : -1}
      className={cx('nu-opt', optionClassName)}
      title={o.title}
      onClick={readOnly ? undefined : () => onChange(i)}
      onKeyDown={(e) => onKeyDown(e, i)}
    >
      {o.content}
    </button>
  ));
  return (
    <div className={className} role="radiogroup" aria-label={label} aria-readonly={readOnly || undefined}>
      {header}
      {wrapClassName ? <div className={wrapClassName}>{buttons}</div> : buttons}
    </div>
  );
}

/* ---------- ScoreForm: shared by FallRiskScore and BradenScore ---------- */

/** One answer of a score item. */
export interface NursingScoreOption {
  /** Answer text */
  label: string;
  /** Points it adds */
  points: number;
  /** Longer description (tooltip) */
  desc?: string;
}

/** One item (question or subscale) of a score tool. */
export interface NursingScoreItem {
  /** Key in the values record */
  id: string;
  /** Item text */
  label: string;
  /** Help line */
  help?: string;
  /** Answers */
  options: NursingScoreOption[];
}

/** Risk band for a total: Badge tone, label and the action it calls for. */
export interface NursingScoreBand {
  /** Badge tone */
  tone: BadgeTone;
  /** Band label ('High fall risk') */
  label: string;
  /** What to do */
  action?: string;
}

/** The last recorded score. */
export interface NursingPreviousScore {
  /** Total */
  total: number;
  /** When ('yesterday 20:00') */
  when: string;
}

/** Props shared by FallRiskScore and BradenScore. */
export interface NursingScoreToolProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'onChange' | 'defaultValue'> {
  /** Option index per item (uncontrolled); default {} */
  defaultValues?: Record<string, number>;
  /** Option index per item (controlled) */
  values?: Record<string, number>;
  /** Cut-offs: total to band; default the tool's standard bands */
  band?: (total: number) => NursingScoreBand;
  /** Last score; default none */
  previous?: NursingPreviousScore;
  /** default false */
  readOnly?: boolean;
  /** Called with all answers after each pick */
  onChange?: (values: Record<string, number>) => void;
  /** Card title */
  title?: string;
  /** Patient line */
  subtitle?: string;
  /** Which shared reference range flags use; default 'inpatient' when no global context is set */
  rangeContext?: RangeContextId;
}

/** Sum of the picked options' points; null until every item is answered. */
export function scoreTotal(items: readonly NursingScoreItem[], values: Record<string, number>): number | null {
  let total = 0;
  for (const it of items) {
    const i = values[it.id];
    const o = i != null ? it.options[i] : undefined;
    if (!o) return null;
    total += o.points;
  }
  return total;
}

export interface ScoreFormProps extends NursingScoreToolProps {
  /** Items of the tool */
  items: readonly NursingScoreItem[];
  /** Total to band */
  band: (total: number) => NursingScoreBand;
  /** Card title */
  title: string;
  /** Highest possible total */
  max?: number;
  /** Label over the total; default 'Total' */
  totalLabel?: string;
}

/** ScoreForm: one radio group per item, automatic total once every item is answered, and the risk band. */
export const ScoreForm = forwardRef<HTMLElement, ScoreFormProps>(function ScoreForm(
  { items, band: bandFn, title, subtitle, max, totalLabel, values, defaultValues, onChange, previous, readOnly, rangeContext, ...rest },
  ref
) {
  const p = { items, band: bandFn, max, totalLabel, previous, readOnly, rangeContext };
  const [cur, setVals] = useControllableState<Record<string, number>>(values, defaultValues || {}, onChange);
  const answered = p.items.filter((it) => cur[it.id] != null && it.options[cur[it.id]!]).length;
  const total = scoreTotal(p.items, cur);
  const complete = total !== null;
  const band = complete ? p.band(total) : null;
  return (
    <Card ref={ref} title={title} subtitle={subtitle} {...rest}>
      {p.items.map((it) => {
        const sel = cur[it.id];
        const picked = sel != null ? it.options[sel] : undefined;
        return (
          <RadioButtons
            key={it.id}
            className="nu-item"
            label={it.label}
            value={picked ? sel : null}
            readOnly={p.readOnly}
            wrapClassName="nu-opts"
            header={
              <>
                <h4>
                  <span>{it.label}</span>
                  {picked ? <span className="nu-num nu-muted">{picked.points} pts</span> : <span className="nu-muted">Not scored</span>}
                </h4>
                {it.help ? <div className="nu-muted nu-help">{it.help}</div> : null}
              </>
            }
            options={it.options.map((o, i) => ({
              key: i,
              title: o.desc,
              content: (
                <>
                  {o.label}
                  <span className="nu-pt">{o.points}</span>
                </>
              ),
            }))}
            onChange={(i) => setVals({ ...cur, [it.id]: i })}
          />
        );
      })}
      <div className="nu-total" role="status" aria-live="polite">
        <div>
          <div className="nu-muted">{p.totalLabel || 'Total'}</div>
          <span className="nu-big">{complete ? format('pts', total).text : '--'}</span>
          <span className="nu-muted">{' pts' + (p.max ? ' of ' + p.max : '')}</span>
        </div>
        {band ? (
          <Badge tone={band.tone} icon={band.tone === 'danger' ? 'alert' : undefined}>
            {band.label}
          </Badge>
        ) : (
          <span className="nu-muted nu-num">
            {answered} of {p.items.length} items scored
          </span>
        )}
        <span className="nu-sp" />
        {band && band.action ? <span className="nu-action">{band.action}</span> : null}
      </div>
      {p.previous ? (
        <div className="nu-muted nu-prev">
          Previous: <Value measure="pts" value={p.previous.total} rangeContext={p.rangeContext} /> ({p.previous.when})
        </div>
      ) : null}
    </Card>
  );
});
