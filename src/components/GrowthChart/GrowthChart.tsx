import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { RangeContextProvider, type RangeContextId } from '../../clinical';
import { cx } from '../../internal/cx';
import { useControllableState } from '../../internal/hooks';
import { SPECIALTY_MEASURES, SpecTable, V, specText, type SpecOver } from '../../internal/specialty';
import { Badge } from '../Badge/Badge';
import { Card } from '../Card/Card';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';

/** One measurement: [age in the curve's age unit, value, date?]. */
export type GrowthPoint = readonly [age: number, value: number, date?: string];

/** Growth chart standard: WHO birth to 24 months, CDC 2 to 20 years. */
export type GrowthStandard = 'who' | 'cdc';

/** Percentile curves for one standard, measure and sex. */
export interface GrowthCurves {
  /** Measure key of the values: 'wt' (kg, 2 decimals), 'bmi' (kg/m², 1 decimal), 'len', 'hc'... or a unit label */
  unit: string;
  /** Ages of the x axis and of each line value */
  ages: ReadonlyArray<number>;
  /** 'mo' months or 'y' years */
  ageUnit: 'mo' | 'y';
  /** Values per percentile, one per age: {3: [...], 50: [...], 97: [...]} */
  lines: Readonly<Record<string, ReadonlyArray<number>>>;
  /** Chart title */
  title: string;
}

/**
 * Built-in curves, rounded illustrations for the preview only. Production must pass `curves` loaded from the
 * published WHO or CDC tables (LMS).
 */
export const GROWTH_CURVES: Readonly<Record<string, GrowthCurves>> = {
  'who-weight-male': {
    unit: 'wt',
    ages: [0, 2, 4, 6, 9, 12, 15, 18, 21, 24],
    ageUnit: 'mo',
    lines: {
      3: [2.5, 4.4, 5.6, 6.4, 7.1, 7.7, 8.3, 8.8, 9.2, 9.7],
      15: [2.9, 4.9, 6.2, 7.1, 7.9, 8.6, 9.2, 9.7, 10.2, 10.7],
      50: [3.3, 5.6, 7.0, 7.9, 8.9, 9.6, 10.3, 10.9, 11.5, 12.2],
      85: [3.9, 6.3, 7.9, 8.9, 10.0, 10.8, 11.5, 12.2, 12.9, 13.6],
      97: [4.3, 6.8, 8.4, 9.5, 10.6, 11.5, 12.3, 13.0, 13.7, 14.5],
    },
    title: 'Weight-for-age, boys, WHO 0 to 24 months',
  },
  'cdc-bmi-male': {
    unit: 'bmi',
    ages: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
    ageUnit: 'y',
    lines: {
      5: [14.7, 14.0, 13.8, 13.8, 14.2, 14.9, 15.7, 16.6, 17.4, 18.2],
      50: [16.6, 15.7, 15.4, 15.8, 16.6, 17.6, 18.9, 20.1, 21.4, 22.6],
      85: [18.1, 17.0, 16.8, 17.9, 19.4, 21.0, 22.6, 24.2, 25.6, 27.0],
      95: [19.3, 17.8, 18.0, 19.6, 21.4, 23.6, 25.9, 27.9, 29.7, 31.0],
    },
    title: 'BMI-for-age, boys, CDC 2 to 20 years',
  },
};

export interface GrowthChartProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Standard shown (controlled): 'who' | 'cdc'; default uncontrolled */
  standard?: GrowthStandard;
  /** First standard shown (uncontrolled); default 'who' */
  defaultStandard?: GrowthStandard;
  /** 'weight' | 'bmi' | string: picks the built-in curve; default 'weight' */
  measure?: 'weight' | 'bmi' | (string & {});
  /** 'male' | 'female': picks the built-in curve; default 'male' */
  sex?: 'male' | 'female';
  /** Array<[age, value, date?]>; default [] */
  points?: ReadonlyArray<GrowthPoint>;
  /** {unit, ages, ageUnit, lines, title}; default the built-in sample for standard, measure and sex */
  curves?: GrowthCurves;
  /** Called with the new standard; the parent passes the matching `curves`. Without it, custom curves hide the switch; default none */
  onStandardChange?: (standard: GrowthStandard) => void;
  /** Card title; default the curves' title */
  title?: string;
  /** Line under the title; default none */
  subtitle?: string;
  /** Note under the table; default how percentile bands are read */
  note?: ReactNode;
  /** Which shared reference range flags use; the lab range on a result still wins; default the global context, else 'outpatient' */
  rangeContext?: RangeContextId;
  /** Legacy (use `curves`): Record<percentile, value per age in `ages`>, ages in months */
  percentiles?: Readonly<Record<string, ReadonlyArray<number>>>;
  /** Legacy (use `curves`): ages in months of `percentiles`; default [0,6,12,18,24,36] */
  ages?: ReadonlyArray<number>;
  /** Legacy: bottom of the y axis; default from the data */
  min?: number;
  /** Legacy: top of the y axis; default from the data */
  max?: number;
  /** Legacy (use `curves.unit`): unit label of the values ('kg') */
  unit?: string;
}

/** Percentile band of a value at an age: words, and whether it is outside or above the healthy lines. */
export interface GrowthBand {
  text: string;
  low?: boolean;
  high?: boolean;
}

/** 3 to '3rd', 50 to '50th', 97 to '97th'. */
function ordinal(n: number | string): string {
  const v = Number(n);
  if (!Number.isInteger(v)) return String(n);
  const t = v % 100;
  return v + (t >= 11 && t <= 13 ? 'th' : (['th', 'st', 'nd', 'rd'][v % 10] ?? 'th'));
}

function interp(ages: ReadonlyArray<number>, vals: ReadonlyArray<number>, a: number): number {
  if (a <= ages[0]!) return vals[0]!;
  for (let i = 1; i < ages.length; i++)
    if (a <= ages[i]!) return vals[i - 1]! + ((vals[i]! - vals[i - 1]!) * (a - ages[i - 1]!)) / (ages[i]! - ages[i - 1]!);
  return vals[vals.length - 1]!;
}

/** The percentile band a value falls in at an age, from the lines drawn (linear between ages). */
export function growthBand(cv: GrowthCurves, age: number, value: number): GrowthBand {
  const ks = Object.keys(cv.lines)
    .map(Number)
    .sort((p, q) => p - q);
  const at = ks.map((k) => interp(cv.ages, cv.lines[k]!, age));
  if (value < at[0]!) return { text: 'Below the ' + ordinal(ks[0]!) + ' percentile', low: true };
  if (value > at[at.length - 1]!) return { text: 'Above the ' + ordinal(ks[ks.length - 1]!) + ' percentile', high: true };
  for (let i = 1; i < ks.length; i++)
    if (value <= at[i]!) return { text: 'Between the ' + ordinal(ks[i - 1]!) + ' and ' + ordinal(ks[i]!) + ' percentile', high: ks[i - 1]! >= 85 };
  return { text: '' };
}

/** The measure key and overrides for a curve unit (a measure key, or a legacy unit label such as 'kg'). */
function unitMeasure(u: string | undefined): { k: string; over?: SpecOver } {
  if (u && Object.prototype.hasOwnProperty.call(SPECIALTY_MEASURES, u)) return { k: u };
  const k = Object.keys(SPECIALTY_MEASURES).find((key) => SPECIALTY_MEASURES[key]!.u === u);
  if (k) return { k };
  return { k: u || '', over: { u: u || '', dp: 1 } };
}

const LEGACY_AGES = [0, 6, 12, 18, 24, 36];
const LEGACY_TITLE = 'Weight-for-age (kg), WHO 0 to 36 months';
const EMPTY: ReadonlyArray<GrowthPoint> = [];
const W = 560;
const H = 272;
const PL = 40;
const PR = 40;
const PT = 22;
const PB = 26;

/**
 * GrowthChart plots a child's measurements against WHO (birth to 24 months) or CDC (2 to 20 years) percentile lines
 * and names the percentile band of every point.
 */
export const GrowthChart = forwardRef<HTMLElement, GrowthChartProps>(function GrowthChart(
  {
    standard,
    defaultStandard = 'who',
    measure = 'weight',
    sex = 'male',
    points = EMPTY,
    curves,
    onStandardChange,
    title,
    subtitle,
    note,
    rangeContext,
    percentiles,
    ages,
    min,
    max,
    unit,
    className,
    ...rest
  },
  ref
) {
  const [std, setStd] = useControllableState<GrowthStandard>(standard, defaultStandard, onStandardChange);
  const custom = !!curves || !!percentiles;
  const cv: GrowthCurves =
    curves ||
    (percentiles
      ? { unit: unit || '', ages: ages || LEGACY_AGES, ageUnit: 'mo', lines: percentiles, title: title || LEGACY_TITLE }
      : GROWTH_CURVES[std + '-' + measure + '-' + sex] || GROWTH_CURVES['who-weight-male']!);
  const um = unitMeasure(cv.unit);
  const txt = (v: number) => specText(um.k, v, um.over);
  const all = Object.keys(cv.lines)
    .flatMap((k) => cv.lines[k]!)
    .concat(points.map((q) => q[1]));
  const mn = min ?? Math.floor(Math.min(...all)) - 1;
  const mx = max ?? Math.ceil(Math.max(...all)) + 1;
  const a0 = cv.ages[0]!;
  const a1 = cv.ages[cv.ages.length - 1]!;
  const x = (a: number) => PL + ((a - a0) / (a1 - a0 || 1)) * (W - PL - PR);
  const y = (v: number) => PT + (1 - (v - mn) / (mx - mn || 1)) * (H - PT - PB);
  const last = points[points.length - 1];
  const b = last ? growthBand(cv, last[0], last[1]) : null;
  const ticks: number[] = [];
  for (let t = Math.ceil(mn); t <= mx; t += mx - mn > 12 ? 2 : 1) ticks.push(t);
  const u = (SPECIALTY_MEASURES[um.k] || um.over || { u: '' }).u;
  const shownTitle = title || cv.title;
  const ageWord = cv.ageUnit === 'mo' ? 'months' : 'years';
  return (
    <RangeContextProvider value={rangeContext}>
      <Card
        ref={ref}
        className={cx('co-growth', className)}
        title={shownTitle}
        subtitle={subtitle}
        actions={
          custom && !onStandardChange ? null : (
            <SegmentedControl
              size="sm"
              label="Chart standard"
              value={std}
              options={[
                { value: 'who', label: 'WHO 0-2' },
                { value: 'cdc', label: 'CDC 2-20' },
              ]}
              onChange={(v) => setStd(v as GrowthStandard)}
            />
          )
        }
        {...rest}
      >
        {b && last ? (
          <div className="co-row co-gap-8 co-growth-latest">
            <span>
              Latest <V k={um.k} over={um.over} v={last[1]} />
              {' at ' + last[0] + ' ' + ageWord}
            </span>
            <Badge tone={b.low || b.high ? 'warning' : 'success'} size="sm">
              {b.text}
            </Badge>
          </div>
        ) : null}
        <figure className="co-sp-fig">
          <svg
            viewBox={'0 0 ' + W + ' ' + H}
            className="co-sp-svg co-growth-svg"
            role="img"
            aria-label={shownTitle + '. Patient points: ' + points.map((q) => q[0] + ' ' + cv.ageUnit + ' ' + txt(q[1])).join(', ')}
          >
            {ticks.map((t) => (
              <g key={'y' + t}>
                <line x1={PL} x2={W - PR} y1={y(t)} y2={y(t)} stroke="var(--co-border)" strokeWidth={0.6} />
                <text x={PL - 6} y={y(t) + 3} textAnchor="end" className="co-axis co-sp-axis-n">
                  {t}
                </text>
              </g>
            ))}
            {cv.ages.map((a) => (
              <text key={'x' + a} x={x(a)} y={H - 8} textAnchor="middle" className="co-axis co-sp-axis-n">
                {a + (cv.ageUnit === 'mo' ? ' mo' : ' y')}
              </text>
            ))}
            <text x={4} y={10} className="co-axis">
              {u}
            </text>
            {Object.keys(cv.lines).map((k) => {
              const L = cv.lines[k]!;
              const main = k === '50';
              const edge = +k >= 95 || +k <= 5;
              return (
                <g key={k}>
                  <polyline
                    points={L.map((v, j) => x(cv.ages[j]!) + ',' + y(v)).join(' ')}
                    fill="none"
                    stroke={edge ? 'var(--co-warning)' : 'var(--co-border-strong)'}
                    strokeWidth={main ? 1.75 : 1}
                    strokeDasharray={main ? undefined : '5 3'}
                  />
                  <text x={W - PR + 4} y={y(L[L.length - 1]!) + 3} className="co-axis">
                    {ordinal(k)}
                  </text>
                </g>
              );
            })}
            <polyline
              points={points.map((q) => x(q[0]) + ',' + y(q[1])).join(' ')}
              fill="none"
              stroke="var(--co-primary)"
              strokeWidth={2}
            />
            {points.map((q, i) => (
              <circle
                key={i}
                cx={x(q[0])}
                cy={y(q[1])}
                r={4}
                fill={i === points.length - 1 ? 'var(--co-primary)' : 'var(--co-surface)'}
                stroke="var(--co-primary)"
                strokeWidth={2}
              >
                <title>{q[0] + ' ' + cv.ageUnit + ': ' + txt(q[1])}</title>
              </circle>
            ))}
          </svg>
        </figure>
        <SpecTable
          caption="Plotted measurements"
          cols={['Date', 'Age', 'Value', 'Percentile band']}
          num={[2]}
          rows={points.map((q) => [
            q[2] || '',
            q[0] + ' ' + ageWord,
            <V key="v" k={um.k} over={um.over} v={q[1]} />,
            growthBand(cv, q[0], q[1]).text,
          ])}
        />
        <div className="co-help">
          {note ||
            'Percentile bands come from the lines drawn; an exact percentile needs the LMS tables. Use WHO from birth to 24 months and CDC from 2 to 20 years.'}
        </div>
      </Card>
    </RangeContextProvider>
  );
});
