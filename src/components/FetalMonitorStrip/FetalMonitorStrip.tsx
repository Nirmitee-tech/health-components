import { forwardRef, type HTMLAttributes } from 'react';
import { RangeContextProvider, type RangeContextId } from '../../clinical';
import { AcuteValue } from '../../internal/acute';
import { Alert } from '../Alert/Alert';
import { Badge } from '../Badge/Badge';
import { Card } from '../Card/Card';
import { EmptyState } from '../EmptyState/EmptyState';
import { FHR_CATEGORY_TONES, type FHRCategory } from '../LaborDeliveryBoard/LaborDeliveryBoard';

export type FetalMonitorState = 'live' | 'paused' | 'disconnected';

export interface FetalMonitorStripProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** FHR samples in bpm, oldest first; null for signal loss; default [] */
  fhr?: Array<number | null>;
  /** Uterine activity samples in mmHg; null for signal loss; default [] */
  toco?: Array<number | null>;
  /** 'live' | 'paused' | 'disconnected'; default 'live' when data exists, else 'disconnected' */
  state?: FetalMonitorState;
  /** Tracing category assigned by the clinician; default none (Category not assigned) */
  category?: FHRCategory;
  /** Who assigned the category and when; default none */
  categoryBy?: string;
  /** Room named in the disconnected state; default 'L&D' */
  room?: string;
  /** Line under the title; default none */
  subtitle?: string;
  /** Which shared reference range flags use; the lab range on a result still wins; default 'ed' when no global context is set */
  rangeContext?: RangeContextId;
}

const W = 680;
const H1 = 170;
const H2 = 80;
const PL = 34;

/** Approximate FHR baseline: mean of the valid samples rounded to 5 bpm, or null. Display only, not an interpretation. */
export function approximateBaseline(fhr: ReadonlyArray<number | null>): number | null {
  const valid = fhr.filter((v): v is number => v != null);
  return valid.length ? Math.round(valid.reduce((s, v) => s + v, 0) / valid.length / 5) * 5 : null;
}

/**
 * FetalMonitorStrip is a display placeholder for the cardiotocography feed: fetal heart rate above, uterine activity
 * below, on the standard grid, with an approximate baseline and the category the clinician assigned.
 */
export const FetalMonitorStrip = forwardRef<HTMLElement, FetalMonitorStripProps>(function FetalMonitorStrip(
  { fhr = [], toco = [], state: stateProp, category, categoryBy, room, subtitle, rangeContext, ...rest },
  ref
) {
  const n = Math.max(fhr.length, toco.length);
  const state: FetalMonitorState = stateProp || (n ? 'live' : 'disconnected');
  const x = (i: number) => PL + (i / Math.max(1, n - 1)) * (W - PL - 6);
  const yf = (v: number) => 6 + (1 - (v - 50) / 160) * (H1 - 12);
  const yt = (v: number) => H1 + 10 + (1 - v / 100) * (H2 - 16);
  const path = (arr: ReadonlyArray<number | null>, fy: (v: number) => number) => {
    let d = '';
    let pen = false;
    arr.forEach((v, i) => {
      if (v == null) {
        pen = false;
        return;
      }
      d += (pen ? 'L' : 'M') + x(i).toFixed(1) + ' ' + fy(v).toFixed(1) + ' ';
      pen = true;
    });
    return d.trim();
  };
  const fhrPath = path(fhr, yf);
  const tocoPath = path(toco, yt);
  const base = approximateBaseline(fhr);
  const lost = fhr.some((v) => v == null);

  return (
    <Card
      ref={ref}
      title="Fetal Monitor"
      subtitle={subtitle}
      actions={
        state === 'live' ? (
          <Badge tone="success" dot>
            Live
          </Badge>
        ) : state === 'paused' ? (
          <Badge tone="warning">Paused</Badge>
        ) : (
          <Badge tone="neutral">Not connected</Badge>
        )
      }
      {...rest}
    >
      <RangeContextProvider value={rangeContext}>
        <Alert tone="info">Display copy only. Interpret the tracing on the certified fetal monitor.</Alert>
        {state === 'disconnected' ? (
          <EmptyState title="Monitor not connected" compact>
            {'Connect the bedside monitor in room ' + (room || 'L&D') + ' to stream the tracing.'}
          </EmptyState>
        ) : (
          <figure className="co-chart co-fm-fig">
            <svg
              viewBox={`0 0 ${W} ${H1 + H2 + 10}`}
              className="co-fm-svg"
              role="img"
              aria-label={
                'Fetal heart rate tracing' +
                (base ? ', approximate baseline ' + base + ' bpm' : '') +
                (lost ? ', with signal loss' : '') +
                (toco.length ? ', with uterine activity below' : '')
              }
            >
              <rect x={PL} y={yf(160)} width={W - PL - 6} height={yf(110) - yf(160)} fill="var(--co-success-soft)" />
              {[60, 90, 120, 150, 180, 210].map((g) => (
                <g key={g}>
                  <line x1={PL} x2={W - 6} y1={yf(g)} y2={yf(g)} stroke="var(--co-line-soft)" />
                  <text x={PL - 4} y={yf(g) + 4} textAnchor="end" className="co-axis">
                    {g}
                  </text>
                </g>
              ))}
              {[0, 25, 50, 75, 100].map((g) => (
                <g key={'t' + g}>
                  <line x1={PL} x2={W - 6} y1={yt(g)} y2={yt(g)} stroke="var(--co-line-soft)" />
                  <text x={PL - 4} y={yt(g) + 4} textAnchor="end" className="co-axis">
                    {g}
                  </text>
                </g>
              ))}
              {fhrPath ? <path d={fhrPath} fill="none" stroke="var(--co-primary)" strokeWidth={1.5} /> : null}
              {tocoPath ? <path d={tocoPath} fill="none" stroke="var(--co-accent)" strokeWidth={1.5} /> : null}
            </svg>
            <figcaption className="co-row co-gap-16 co-fm-cap">
              <span>FHR, bpm (top). Uterine activity, mmHg (bottom).</span>
              <span className="co-row co-gap-6">
                Approximate baseline <AcuteValue measure="fhr" value={base} shortFlag />
              </span>
              {category ? (
                <Badge tone={FHR_CATEGORY_TONES[category]} icon={category === 'III' ? 'alert' : undefined}>
                  {'Category ' + category + (categoryBy ? ', ' + categoryBy : '')}
                </Badge>
              ) : (
                <Badge tone="outline">Category not assigned</Badge>
              )}
              {lost ? (
                <Badge tone="warning" icon="alert">
                  Signal loss
                </Badge>
              ) : null}
            </figcaption>
          </figure>
        )}
      </RangeContextProvider>
    </Card>
  );
});
