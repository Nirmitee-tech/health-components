import { forwardRef, type HTMLAttributes } from 'react';
import {
  FLAGS,
  flag as computeFlag,
  isFiniteNumber,
  measure as findMeasure,
  number,
  range,
  rangeFor,
  unitLabel,
  useRangeContext,
  type Measure,
  type RangeContextId,
} from '../../clinical';
import { cx } from '../../internal/cx';
import { ClinicalValue } from '../ClinicalValue/ClinicalValue';

export interface ReferenceRangeBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The result; required */
  value: number | null;
  /** Measure key (fmt.MEASURES or the range registry); default none */
  measure?: string;
  /** LOINC code; finds the measure when `measure` is absent; default none */
  loinc?: string;
  /** UCUM unit code; default the measure's unit */
  unit?: string;
  /** Decimals; default the measure's precision */
  precision?: number;
  /** Lab reference low; with `refHigh` it replaces the registry range; default from the registry */
  refLow?: number;
  /** Lab reference high; default from the registry */
  refHigh?: number;
  /** Critical low; default from the registry */
  critLow?: number;
  /** Critical high; default from the registry */
  critHigh?: number;
  /** Bar start; default auto (lowest edge or value, minus 12% padding) */
  min?: number;
  /** Bar end; default auto (highest edge or value, plus 12% padding) */
  max?: number;
  /** Label; default the measure label */
  label?: string;
  /** Header row with label and value; default true */
  showHeader?: boolean;
  /** Width (px number or CSS length); default '100%' */
  width?: number | string;
  /** Which shared reference range flags use; the lab range on a result still wins; default the global context, else 'outpatient' */
  rangeContext?: RangeContextId;
  /** The containing set's default context, used only when no prop, provider or global context applies; default none */
  defaultRangeContext?: RangeContextId;
  /** Age in years for the pediatric bands; default none */
  ageYears?: number;
}

/**
 * ReferenceRangeBar places a result on a bar showing the normal band and critical zones, so distance from normal
 * reads at a glance.
 */
export const ReferenceRangeBar = forwardRef<HTMLDivElement, ReferenceRangeBarProps>(function ReferenceRangeBar(
  {
    value,
    measure: measureKey,
    loinc,
    unit: unitProp,
    precision,
    refLow,
    refHigh,
    critLow,
    critHigh,
    min: minProp,
    max: maxProp,
    label: labelProp,
    showHeader = true,
    width,
    rangeContext,
    defaultRangeContext,
    ageYears,
    className,
    style,
    ...rest
  },
  ref
) {
  const m: Partial<Measure> = findMeasure(measureKey || loinc) || {};
  const p = precision != null ? precision : m.p || 0;
  const unit = unitProp || m.unit;
  const ctx = useRangeContext(defaultRangeContext, rangeContext);
  const rr = rangeFor(measureKey || loinc, { context: ctx, refLow, refHigh, critLow, critHigh, ageYears });
  const lo = rr.refLow;
  const hi = rr.refHigh;
  const cl = rr.critLow;
  const ch = rr.critHigh;
  const v = value;
  const pts = [lo, hi, cl, ch, v].filter(isFiniteNumber);
  let min = minProp != null ? minProp : pts.length ? Math.min(...pts) : 0;
  let max = maxProp != null ? maxProp : pts.length ? Math.max(...pts) : 1;
  const pad = (max - min) * 0.12 || 1;
  if (minProp == null) min -= pad;
  if (maxProp == null) max += pad;
  const span = max - min || 1;
  const pc = (x: number) => Math.max(0, Math.min(100, ((x - min) / span) * 100));
  const f = computeFlag(v, { refLow: lo, refHigh: hi, critLow: cl, critHigh: ch });
  const col =
    f === 'LL' || f === 'HH' ? 'var(--co-danger-strong)' : f === 'L' || f === 'H' ? 'var(--co-warning-strong)' : 'var(--co-ink)';
  const label = labelProp || m.label;
  const rangeText = range({ refLow: lo, refHigh: hi }, p, unit);
  const aria =
    (label || 'Value') +
    ' ' +
    number(v, p) +
    (unit ? ' ' + unitLabel(unit) : '') +
    (rangeText ? ', reference ' + rangeText : ', no reference range') +
    (f && f !== 'N' ? ', ' + FLAGS[f].text : '');
  const nLeft = pc(isFiniteNumber(lo) ? lo : min);
  const nRight = pc(isFiniteNumber(hi) ? hi : max);

  return (
    <div
      ref={ref}
      className={cx('co-rr-wrap', className)}
      style={width != null ? { width, ...style } : style}
      {...rest}
    >
      {showHeader ? (
        <div className="co-row co-rr-h">
          <span className="co-rr-hl">{label}</span>
          <ClinicalValue
            value={v}
            measure={measureKey}
            loinc={loinc}
            unit={unit}
            precision={p}
            refLow={lo}
            refHigh={hi}
            critLow={cl}
            critHigh={ch}
            rangeContext={ctx}
            ageYears={ageYears}
            tooltip={false}
            size="sm"
          />
        </div>
      ) : null}
      <div className="co-rr" role="img" aria-label={aria}>
        {isFiniteNumber(cl) ? <span className="co-rr-c" style={{ left: 0, width: pc(cl) + '%' }} /> : null}
        {isFiniteNumber(ch) ? <span className="co-rr-c" style={{ left: pc(ch) + '%', right: 0 }} /> : null}
        <span className="co-rr-n" style={{ left: nLeft + '%', width: nRight - nLeft + '%' }} />
        {isFiniteNumber(lo) ? (
          <span className="co-rr-t" style={{ left: pc(lo) + '%' }}>
            {number(lo, p)}
          </span>
        ) : null}
        {isFiniteNumber(hi) ? (
          <span className="co-rr-t" style={{ left: pc(hi) + '%' }}>
            {number(hi, p)}
          </span>
        ) : null}
        {isFiniteNumber(v) ? <span className="co-rr-m" style={{ left: pc(v) + '%', background: col }} /> : null}
        {isFiniteNumber(v) ? (
          <span className="co-rr-ml" style={{ left: pc(v) + '%', color: col }}>
            {number(v, p)}
          </span>
        ) : null}
      </div>
    </div>
  );
});
