import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { Badge, type BadgeTone } from '../Badge/Badge';
import { Sparkline } from '../Sparkline/Sparkline';

/** Abnormal flag of a vital or lab value: High, Low, Critical high, Critical low. */
export type ResultFlag = 'H' | 'L' | 'HH' | 'LL';

/** How each flag is shown. Shared with LabResultTable. */
export const resultFlags: Record<ResultFlag, { tone: BadgeTone; label: string }> = {
  H: { tone: 'danger', label: 'High' },
  L: { tone: 'warning', label: 'Low' },
  HH: { tone: 'danger', label: 'Critical high' },
  LL: { tone: 'danger', label: 'Critical low' },
};

/** True for the critical flags HH and LL. */
export const isCriticalFlag = (flag?: ResultFlag): boolean => flag === 'HH' || flag === 'LL';

export interface VitalSignProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Vital name ("Blood pressure"); required */
  label: string;
  /** Reading ("152/94"); required */
  value: string | number;
  /** Unit ("mmHg"); default none */
  unit?: string;
  /** 'H' | 'L' | 'HH' | 'LL'; critical flags shade the tile; default none */
  flag?: ResultFlag;
  /** number[]: earlier readings, oldest first, drawn as a sparkline; default none */
  trend?: number[];
  /** Time taken or a note ("10:12 AM", "52nd percentile"); default none */
  taken?: string;
}

/** VitalSign is one vital tile: label, value, unit, High or Low flag (critical shaded), trend sparkline and time taken. */
export const VitalSign = forwardRef<HTMLDivElement, VitalSignProps>(function VitalSign(
  { label, value, unit, flag, trend, taken, className, ...rest },
  ref
) {
  const f = flag ? resultFlags[flag] : undefined;
  return (
    <div ref={ref} className={cx('co-vital', f && 'is-flag', isCriticalFlag(flag) && 'is-crit', className)} {...rest}>
      <span className="co-kl">{label}</span>
      <div className="co-row co-gap-6">
        <span className="co-vital-v">{value}</span>
        <span className="co-mi-s">{unit}</span>
        {f ? (
          <Badge tone={f.tone} size="sm" icon={flag === 'L' || flag === 'LL' ? 'sort-down' : 'sort-up'}>
            {f.label}
          </Badge>
        ) : null}
      </div>
      <div className="co-row co-gap-6">
        {trend ? (
          <Sparkline values={trend} label={`${label} trend`} color={f ? 'var(--co-danger)' : 'var(--co-primary)'} />
        ) : null}
        <span className="co-mi-s">{taken}</span>
      </div>
    </div>
  );
});
