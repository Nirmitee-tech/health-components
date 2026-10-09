import { forwardRef, type HTMLAttributes } from 'react';
import {
  CONVERSIONS,
  MEASURES,
  convert,
  isFiniteNumber,
  measure as findMeasure,
  number,
  rangeFor,
  unitLabel,
  useRangeContext,
  type ConversionKind,
  type Measure,
  type RangeContextId,
} from '../../clinical';
import { cx } from '../../internal/cx';
import { useControllableState } from '../../internal/hooks';
import { ClinicalValue, type ClinicalValueSize } from '../ClinicalValue/ClinicalValue';

export type UnitToggleKind = ConversionKind;

export interface UnitToggleProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'onChange' | 'children'> {
  /** Measure family: 'weight' | 'height' | 'temp' | 'glucose' | 'creatinine' | 'a1c'; required */
  kind: UnitToggleKind;
  /** Stored value, in `unit`; required */
  value: number | null;
  /** UCUM code of the stored value ('kg', '[lb_av]', 'Cel', 'mg/dL'...); required */
  unit: string;
  /** Unit shown first (uncontrolled); default `unit` */
  defaultUnit?: string;
  /** Unit shown (controlled); default none */
  displayUnit?: string;
  /** Called with the UCUM code the reader picks; default none */
  onChange?: (unit: string) => void;
  /** Shows "Stored as ..." under the converted value; default false */
  showStored?: boolean;
  /** Label; default the measure label */
  label?: string;
  /** 'sm' | 'md' | 'lg'; default 'md' */
  size?: ClinicalValueSize;
  /** Measure key when it differs from `kind`; default `kind` */
  measure?: string;
  /** Shows the range and meta line (in the measure's own unit only); default false */
  showMeta?: boolean;
  /** Which shared reference range flags use; the lab range on a result still wins; default the global context, else 'outpatient' */
  rangeContext?: RangeContextId;
  /** The containing set's default context, used only when no prop, provider or global context applies; default none */
  defaultRangeContext?: RangeContextId;
  /** Age in years for the pediatric bands; default none */
  ageYears?: number;
}

/**
 * UnitToggle shows a stored measurement in the unit the reader picks (lb or kg, in or cm, °F or °C, mg/dL or
 * mmol/L), converting value and range with exact factors from the stored number.
 */
export const UnitToggle = forwardRef<HTMLSpanElement, UnitToggleProps>(function UnitToggle(
  {
    kind,
    value,
    unit,
    defaultUnit,
    displayUnit,
    onChange,
    showStored = false,
    label,
    size,
    measure: measureKey,
    showMeta = false,
    rangeContext,
    defaultRangeContext,
    ageYears,
    className,
    ...rest
  },
  ref
) {
  const c = CONVERSIONS[kind];
  const [shown, setShown] = useControllableState(displayUnit, defaultUnit || unit || c.units[0], onChange);
  const v = isFiniteNumber(value) ? convert(value, unit, shown, kind) : null;
  const m: Partial<Measure> = findMeasure(measureKey || kind) || {};
  const ctx = useRangeContext(defaultRangeContext, rangeContext);
  const rr = rangeFor(measureKey || kind, { context: ctx, ageYears });
  const sameUnit = shown === m.unit;
  /* In another unit the range converts with the value (rule 7). */
  const conv = (x: number | undefined) =>
    !sameUnit && isFiniteNumber(x) && m.unit ? convert(x, m.unit, shown, kind) : undefined;
  const measureForValue = measureKey || (Object.prototype.hasOwnProperty.call(MEASURES, kind) ? kind : undefined);

  return (
    <span ref={ref} className={cx('co-ut', className)} {...rest}>
      <span className="co-ut-seg" role="group" aria-label={(label || m.label || kind) + ' unit'}>
        {c.units.map((u) => (
          <button key={u} type="button" aria-pressed={u === shown} onClick={() => setShown(u)}>
            {unitLabel(u)}
          </button>
        ))}
      </span>
      <ClinicalValue
        value={v}
        unit={shown}
        measure={measureForValue}
        precision={c.p[shown]}
        size={size}
        label={label}
        showMeta={showMeta && sameUnit}
        rangeContext={ctx}
        ageYears={ageYears}
        refLow={conv(rr.refLow)}
        refHigh={conv(rr.refHigh)}
        critLow={conv(rr.critLow)}
        critHigh={conv(rr.critHigh)}
      />
      {showStored ? (
        <span className="co-cv-meta">{'Stored as ' + number(value, c.p[unit]) + ' ' + unitLabel(unit)}</span>
      ) : null}
    </span>
  );
});
