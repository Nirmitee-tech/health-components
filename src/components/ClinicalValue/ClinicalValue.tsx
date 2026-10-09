import { forwardRef, type HTMLAttributes } from 'react';
import {
  FLAGS,
  dateTime,
  flag as computeFlag,
  isCriticalFlagCode,
  measure as findMeasure,
  number,
  range,
  rangeFor,
  unitLabel,
  useRangeContext,
  type FlagCode,
  type Measure,
  type RangeContextId,
  type RangeLimits,
} from '../../clinical';
import { cx } from '../../internal/cx';
import { useDomId } from '../../internal/hooks';
import { AbnormalFlag, type AbnormalFlagVariant } from '../AbnormalFlag/AbnormalFlag';

export type ClinicalValueTrend = 'up' | 'down' | 'stable';
export type ClinicalValueStatus = 'final' | 'preliminary' | 'entered-in-error';
export type ClinicalValueSize = 'sm' | 'md' | 'lg';

const TREND: Record<ClinicalValueTrend, [string, string]> = {
  up: ['↑', 'rising'],
  down: ['↓', 'falling'],
  stable: ['→', 'unchanged'],
};

export interface ClinicalValueProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** The measured number, unrounded: fmt rounds it to the measure's precision; required */
  value: number | null;
  /** Key of fmt.MEASURES ('potassium', 'temp', 'bpSys'...) or a range-registry key/alias; default none */
  measure?: string;
  /** LOINC code; finds the measure when `measure` is absent; default the measure's LOINC */
  loinc?: string;
  /** UCUM unit code of `value`; default the measure's unit. A different unit drops the sample range (it is in the measure's unit) unless a lab range is passed */
  unit?: string;
  /** Decimals; default the measure's precision, else 0 */
  precision?: number;
  /** Lab reference low (FHIR Observation.referenceRange); with `refHigh` it replaces the registry range in every context; default from the registry */
  refLow?: number;
  /** Lab reference high; default from the registry */
  refHigh?: number;
  /** Lab critical low; default the registry's critical low for the context */
  critLow?: number;
  /** Lab critical high; default the registry's critical high for the context */
  critHigh?: number;
  /** Lab flag; overrides the computed one ('A'/'AA' for results with no direction); default computed */
  flag?: FlagCode;
  /** Trend arrow, read as rising / falling / unchanged; default none */
  trend?: ClinicalValueTrend;
  /** Change text shown after the arrow ('+0.6'); default none */
  delta?: string;
  /** ISO time of the result, shown in the tooltip and meta line; default none */
  timestamp?: string;
  /** IANA zone for the timestamp; default the browser zone */
  timeZone?: string;
  /** Performing lab or device; default none */
  source?: string;
  /** Result status; 'entered-in-error' strikes the value through, greys it and never flags it; default 'final' */
  status?: ClinicalValueStatus;
  /** 'sm' | 'md' | 'lg'; default 'md' */
  size?: ClinicalValueSize;
  /** Label override; default the measure label */
  label?: string;
  /** Second line with range, time and source; default false */
  showMeta?: boolean;
  /** Shows the measure name before the value; default false */
  showLabel?: boolean;
  /** Shows the N flag for normal values; default false */
  showNormal?: boolean;
  /** Range tooltip on hover and focus; default true */
  tooltip?: boolean;
  /** Which registry range applies: 'outpatient' | 'inpatient' | 'ed' | 'pediatric' | 'pregnancy'. The lab range (refLow/refHigh) still wins; default the nearest RangeContextProvider, else the global setRangeContext, else `defaultRangeContext`, else 'outpatient' */
  rangeContext?: RangeContextId;
  /** The containing set's default context, used only when no prop, provider or global context applies; default none */
  defaultRangeContext?: RangeContextId;
  /** Age in years; picks the pediatric band in the 'pediatric' context; default none (oldest band) */
  ageYears?: number;
  /** Flag variant for non-critical flags (critical flags always show the word); default 'compact' */
  flagVariant?: AbnormalFlagVariant;
  /** Preformatted text shown instead of the formatted value (e.g. '>1000'); default none */
  display?: string;
}

/**
 * ClinicalValue shows one clinical measurement with its unit, fixed precision, abnormal flag, trend and reference
 * range, formatted by the shared fmt rules.
 */
export const ClinicalValue = forwardRef<HTMLSpanElement, ClinicalValueProps>(function ClinicalValue(
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
    flag: flagProp,
    trend,
    delta,
    timestamp,
    timeZone,
    source,
    status = 'final',
    size = 'md',
    label: labelProp,
    showMeta = false,
    showLabel = false,
    showNormal = false,
    tooltip = true,
    rangeContext,
    defaultRangeContext,
    ageYears,
    flagVariant = 'compact',
    display,
    className,
    id,
    ...rest
  },
  ref
) {
  const tipId = useDomId('co-cv-tip', id ? `${id}-tip` : undefined);
  const m: Partial<Measure> = findMeasure(measureKey || loinc) || {};
  const unit = unitProp != null ? unitProp : m.unit;
  const p = precision != null ? precision : m.p != null ? m.p : 0;
  const ctx = useRangeContext(defaultRangeContext, rangeContext);
  let r: RangeLimits = rangeFor(measureKey || loinc, { context: ctx, refLow, refHigh, critLow, critHigh, ageYears });
  /* The sample range is in the measure's unit only. */
  if (unitProp && m.unit && unitProp !== m.unit && refLow == null && refHigh == null) r = {};
  const eie = status === 'entered-in-error';
  const f: FlagCode | null = eie ? null : flagProp || computeFlag(value, r);
  const crit = isCriticalFlagCode(f);
  const num = display != null ? String(display) : number(value, p);
  const u = unitLabel(unit);
  const rt = range(r, p, unit);
  const tr = trend ? TREND[trend] : undefined;
  const label = labelProp || m.label || '';
  const code = loinc || m.loinc;
  const when = timestamp ? dateTime(timestamp, { hour24: true, timeZone }) : null;
  const srText =
    (label ? label + ' ' : '') +
    num +
    (u ? ' ' + u : '') +
    (f && f !== 'N' ? ', ' + FLAGS[f].text : '') +
    (eie ? ', entered in error' : '');

  /* The outermost element takes ref, id, className and native attributes. */
  const outer = showMeta ? 'stack' : tooltip === false ? 'main' : 'tip';
  const rootProps = { ref, id, ...rest };

  const main = (
    <span
      className={cx(
        'co-cv',
        size === 'lg' && 'co-cv-lg',
        size === 'sm' && 'co-cv-sm',
        (f === 'H' || f === 'L' || f === 'A') && 'co-cv-hi',
        crit && 'co-cv-crit',
        eie && 'co-cv-eie',
        outer === 'main' && className
      )}
      data-loinc={code}
      {...(outer === 'main' ? rootProps : null)}
    >
      {showLabel && label ? <span className="co-cv-meta">{label}</span> : null}
      <span className="co-cv-v" aria-hidden="true">
        {num}
      </span>
      {u ? (
        <span className="co-cv-u" aria-hidden="true">
          {u}
        </span>
      ) : null}
      <span className="co-cv-sr">{srText}</span>
      {f && (f !== 'N' || showNormal) ? (
        <AbnormalFlag flag={f} variant={crit ? 'full' : flagVariant} aria-hidden="true" />
      ) : null}
      {tr ? (
        <span className="co-cv-trend" title={tr[1] + (delta ? ' ' + delta : '')}>
          <span aria-hidden="true">{tr[0]}</span>
          {delta ? ' ' + delta : null}
          <span className="co-cv-sr"> {tr[1]}</span>
        </span>
      ) : null}
      {eie ? <span className="co-af co-af-neutral">Entered in error</span> : null}
    </span>
  );

  const tipLines = [rt ? 'Reference ' + rt : 'No reference range', code ? 'LOINC ' + code : null, when, source || null].filter(
    Boolean
  );
  const withTip =
    tooltip === false ? (
      main
    ) : (
      <span
        className={cx('co-cv-tipw', outer === 'tip' && className)}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- focusable so the range tooltip opens from the keyboard (rule 7: hover or focus).
        tabIndex={0}
        aria-describedby={tipId}
        {...(outer === 'tip' ? rootProps : null)}
      >
        {main}
        <span className="co-cv-tip" role="tooltip" id={tipId}>
          {tipLines.join(' · ')}
        </span>
      </span>
    );
  if (outer !== 'stack') return withTip;
  return (
    <span className={cx('co-cv-stack', className)} {...rootProps}>
      {withTip}
      <span className="co-cv-meta">{[rt ? 'Ref ' + rt : null, when, source].filter(Boolean).join(' · ')}</span>
    </span>
  );
});
