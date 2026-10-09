import { forwardRef, type HTMLAttributes } from 'react';
import { RangeContextProvider, number, type RangeContextId } from '../../clinical';
import { AcuteTable, AcuteValue } from '../../internal/acute';
import { Alert } from '../Alert/Alert';
import { Card } from '../Card/Card';
import { EmptyState } from '../EmptyState/EmptyState';

/** [hours since the start of active labor, value]. */
export type PartogramPoint = [number, number];

export interface PartogramChartProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Cervical exams as [hours, cm]; required */
  dilation: PartogramPoint[];
  /** Head descent as [hours, fifths palpable 0 to 5]; default [] */
  descent?: PartogramPoint[];
  /** Fetal heart rate as [hours, bpm]; default [] */
  fhr?: PartogramPoint[];
  /** Contractions as [hours, per 10 min]; default [] */
  contractions?: PartogramPoint[];
  /** Hours on the x axis; default 12 */
  hours?: number;
  /** Line under the title; default 'Active phase, alert line at 1 cm per hour, action line 4 hours to the right' */
  subtitle?: string;
  /** Which shared reference range flags use; the lab range on a result still wins; default 'ed' when no global context is set */
  rangeContext?: RangeContextId;
}

const W = 620;
const H = 260;
const PL = 40;
const PR = 12;
const PT = 10;
const PB = 26;

/** The first exam right of the action line (4 hours right of the 1 cm per hour alert line), or undefined. */
export function partogramActionCrossed(dilation: PartogramPoint[]): PartogramPoint | undefined {
  if (!dilation.length) return undefined;
  const [t0, c0] = dilation[0]!;
  return dilation.find((q) => q[1] < c0 + (q[0] - t0 - 4));
}

/**
 * PartogramChart plots cervical dilation and head descent against hours of active labor, with the WHO alert line
 * (1 cm per hour) and action line 4 hours to its right, and an hourly row of fetal heart rate and contractions.
 */
export const PartogramChart = forwardRef<HTMLElement, PartogramChartProps>(function PartogramChart(
  {
    dilation,
    descent = [],
    fhr = [],
    contractions = [],
    hours = 12,
    subtitle = 'Active phase, alert line at 1 cm per hour, action line 4 hours to the right',
    rangeContext,
    ...rest
  },
  ref
) {
  const pts = dilation || [];
  const hrs = Math.max(1, Math.round(hours));
  const x = (t: number) => PL + (t / hrs) * (W - PL - PR);
  const y = (cm: number) => PT + (1 - cm / 10) * (H - PT - PB);
  const t0 = pts.length ? pts[0]![0] : 0;
  const c0 = pts.length ? pts[0]![1] : 4;
  const alertEnd = t0 + (10 - c0);
  const crossed = partogramActionCrossed(pts);
  const hourCols = fhr.length ? fhr : contractions;
  const summary =
    'Partogram. Cervical dilation: ' +
    pts.map((q) => number(q[0]) + ' h ' + number(q[1]) + ' cm').join(', ') +
    (descent.length ? '. Head descent: ' + descent.map((q) => number(q[0]) + ' h ' + number(q[1]) + '/5').join(', ') : '') +
    (crossed ? '. Action line crossed at ' + number(crossed[0]) + ' h' : '');

  return (
    <Card ref={ref} title="Partogram" subtitle={subtitle} {...rest}>
      <RangeContextProvider value={rangeContext}>
        {crossed ? (
          <Alert tone="error" title={'Action line crossed at ' + number(crossed[0]) + ' h'}>
            {'Dilation ' + number(crossed[1], 0) + ' cm. Review with the obstetrician now.'}
          </Alert>
        ) : null}
        {!pts.length ? (
          <EmptyState title="No cervical exams recorded" compact>
            Plotting starts with the first exam in active labor.
          </EmptyState>
        ) : (
          <figure className="co-chart">
            <svg viewBox={`0 0 ${W} ${H}`} className="co-line" role="img" aria-label={summary}>
              {[0, 2, 4, 6, 8, 10].map((c) => (
                <g key={c}>
                  <line x1={PL} x2={W - PR} y1={y(c)} y2={y(c)} stroke="var(--co-line-soft)" />
                  <text x={PL - 6} y={y(c) + 4} textAnchor="end" className="co-axis">
                    {c + ' cm'}
                  </text>
                  {descent.length ? (
                    <text x={W - PR} y={y(c) - 3} textAnchor="end" className="co-axis">
                      {c / 2 + '/5'}
                    </text>
                  ) : null}
                </g>
              ))}
              {Array.from({ length: hrs + 1 }, (_, t) => (
                <text key={'h' + t} x={x(t)} y={H - 8} textAnchor="middle" className="co-axis">
                  {t + ' h'}
                </text>
              ))}
              <line
                x1={x(t0)}
                y1={y(c0)}
                x2={x(Math.min(hrs, alertEnd))}
                y2={y(c0 + Math.min(hrs, alertEnd) - t0)}
                stroke="var(--co-warning)"
                strokeWidth={2}
              />
              <line
                x1={x(t0 + 4)}
                y1={y(c0)}
                x2={x(Math.min(hrs, alertEnd + 4))}
                y2={y(c0 + Math.min(hrs, alertEnd + 4) - t0 - 4)}
                stroke="var(--co-danger)"
                strokeWidth={2}
              />
              <text
                x={x(Math.min(hrs - 1, alertEnd)) - 4}
                y={y(Math.min(10, c0 + Math.min(hrs - 1, alertEnd) - t0)) + 14}
                textAnchor="end"
                className="co-axis"
                style={{ fill: 'var(--co-warning-strong)' }}
              >
                Alert
              </text>
              <text
                x={x(Math.min(hrs, alertEnd + 4)) - 4}
                y={y(Math.min(10, c0 + Math.min(hrs, alertEnd + 4) - t0 - 4)) + 14}
                textAnchor="end"
                className="co-axis"
                style={{ fill: 'var(--co-danger-strong)' }}
              >
                Action
              </text>
              <polyline
                points={pts.map((q) => x(q[0]) + ',' + y(q[1])).join(' ')}
                fill="none"
                stroke="var(--co-primary)"
                strokeWidth={2}
              />
              {pts.map((q, i) => (
                <g key={'x' + i} stroke="var(--co-primary)" strokeWidth={2.5}>
                  <line x1={x(q[0]) - 5} y1={y(q[1]) - 5} x2={x(q[0]) + 5} y2={y(q[1]) + 5} />
                  <line x1={x(q[0]) - 5} y1={y(q[1]) + 5} x2={x(q[0]) + 5} y2={y(q[1]) - 5} />
                </g>
              ))}
              {descent.length ? (
                <polyline
                  points={descent.map((q) => x(q[0]) + ',' + y(q[1] * 2)).join(' ')}
                  fill="none"
                  stroke="var(--co-accent)"
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                />
              ) : null}
              {descent.map((q, i) => (
                <circle key={'o' + i} cx={x(q[0])} cy={y(q[1] * 2)} r={5} fill="var(--co-surface)" stroke="var(--co-accent)" strokeWidth={2} />
              ))}
            </svg>
            <figcaption className="co-legend co-row co-gap-16 co-pg-legend">
              <span>x Cervical dilation (cm)</span>
              {descent.length ? <span>o Head descent, fifths palpable (5/5 on the 10 cm line, 0/5 on 0)</span> : null}
              <span className="co-pg-alert">Alert line</span>
              <span className="co-pg-action">Action line</span>
            </figcaption>
          </figure>
        )}
        {hourCols.length ? (
          <AcuteTable label="Fetal heart rate and contractions by hour" className="co-pg-table">
            <thead>
              <tr>
                <th scope="col" className="co-th-plain">
                  Hour
                </th>
                {hourCols.map((q) => (
                  <th key={q[0]} scope="col" className="co-th-plain co-num co-ac-num">
                    {number(q[0]) + ' h'}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fhr.length ? (
                <tr>
                  <th scope="row" className="co-th-plain">
                    FHR
                  </th>
                  {fhr.map((q) => (
                    <td key={q[0]} className="co-num co-ac-cell-sm">
                      <AcuteValue measure="fhr" value={q[1]} shortFlag />
                    </td>
                  ))}
                </tr>
              ) : null}
              {contractions.length ? (
                <tr>
                  <th scope="row" className="co-th-plain">
                    Contractions
                  </th>
                  {contractions.map((q) => (
                    <td key={q[0]} className="co-num co-ac-cell-sm">
                      <AcuteValue measure="contractions" value={q[1]} shortFlag />
                    </td>
                  ))}
                </tr>
              ) : null}
            </tbody>
          </AcuteTable>
        ) : null}
      </RangeContextProvider>
    </Card>
  );
});
