import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { RangeContextProvider, type RangeContextId } from '../../clinical';
import { cx } from '../../internal/cx';
import { SpecTable, V, type SpecRow } from '../../internal/specialty';
import { Badge } from '../Badge/Badge';
import { Card } from '../Card/Card';

/** Thresholds in dB HL keyed by frequency in Hz (250, 500, 1000, 2000, 3000, 4000, 6000, 8000). */
export type AudiogramThresholds = Partial<Record<number, number | null>>;

/** One ear's results. */
export interface AudiogramEar {
  /** Air conduction thresholds */
  ac?: AudiogramThresholds;
  /** Bone conduction thresholds */
  bc?: AudiogramThresholds;
  /** Frequencies with no response at the audiometer's limit */
  nr?: ReadonlyArray<number>;
}

export interface AudiogramProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Right ear {ac, bc?, nr?}; required */
  right: AudiogramEar;
  /** Left ear {ac, bc?, nr?}; required */
  left: AudiogramEar;
  /** Speech results line; default none */
  speech?: string;
  /** Card title; default 'Audiogram' */
  title?: string;
  /** Line under the title; default none */
  subtitle?: string;
  /** Which shared reference range flags use; the lab range on a result still wins; default the global context, else 'outpatient' */
  rangeContext?: RangeContextId;
}

/** Frequencies on the chart, in Hz. */
export const AUDIOGRAM_FREQUENCIES = [250, 500, 1000, 2000, 3000, 4000, 6000, 8000] as const;
const FREQS = AUDIOGRAM_FREQUENCIES;
const DEG: ReadonlyArray<[number, string]> = [
  [25, 'Normal'],
  [40, 'Mild'],
  [55, 'Moderate'],
  [70, 'Moderately severe'],
  [90, 'Severe'],
  [999, 'Profound'],
];

/** Degree of hearing loss for a threshold or average in dB HL (25 / 40 / 55 / 70 / 90 cut-offs, inclusive). */
export function audioDegree(db: number): string {
  for (const [lim, name] of DEG) if (db <= lim) return name;
  return 'Profound';
}

/** Pure tone average of 500, 1000 and 2000 Hz air thresholds, rounded; null when any of the three is missing. */
export function audioPTA(ac: AudiogramThresholds | null | undefined): number | null {
  if (!ac) return null;
  const v = [500, 1000, 2000].map((f) => ac[f]);
  if (v.some((x) => x == null)) return null;
  return Math.round(((v[0] as number) + (v[1] as number) + (v[2] as number)) / 3);
}

const W = 520;
const H = 316;
const PL = 44;
const PR = 12;
const PT = 24;
const PB = 22;
const MN = -10;
const MX = 120;
const x = (f: number) => PL + (Math.log2(f / 250) / 5) * (W - PL - PR);
const y = (db: number) => PT + ((db - MN) / (MX - MN)) * (H - PT - PB);
const fLabel = (f: number) => (f >= 1000 ? f / 1000 + 'k' : String(f));

type Side = 'right' | 'left';

function line(o: AudiogramEar, col: string, key: 'ac' | 'bc') {
  const t = o[key];
  const pts = FREQS.filter((f) => t && t[f] != null);
  return (
    <polyline
      points={pts.map((f) => x(f) + ',' + y(t![f] as number)).join(' ')}
      fill="none"
      stroke={col}
      strokeWidth={1.75}
    />
  );
}

function mark(side: Side, f: number, db: number, col: string, bc: boolean, nr?: boolean): ReactNode {
  const X = x(f) + (bc ? (side === 'right' ? -9 : 9) : 0);
  const Y = y(db);
  const g = bc ? (
    <path
      d={
        side === 'right'
          ? 'M' + (X + 4) + ' ' + (Y - 6) + 'L' + (X - 3) + ' ' + Y + 'L' + (X + 4) + ' ' + (Y + 6)
          : 'M' + (X - 4) + ' ' + (Y - 6) + 'L' + (X + 3) + ' ' + Y + 'L' + (X - 4) + ' ' + (Y + 6)
      }
      fill="none"
      stroke={col}
      strokeWidth={2}
    />
  ) : side === 'right' ? (
    <circle cx={X} cy={Y} r={5.5} fill="var(--co-surface)" stroke={col} strokeWidth={2} />
  ) : (
    <path
      d={'M' + (X - 5) + ' ' + (Y - 5) + 'L' + (X + 5) + ' ' + (Y + 5) + 'M' + (X + 5) + ' ' + (Y - 5) + 'L' + (X - 5) + ' ' + (Y + 5)}
      stroke={col}
      strokeWidth={2}
    />
  );
  return (
    <g key={side + f + (bc ? 'b' : 'a')}>
      {g}
      {nr ? <path d={'M' + X + ' ' + (Y + 6) + 'l' + (side === 'right' ? -6 : 6) + ' 8'} stroke={col} strokeWidth={2} /> : null}
    </g>
  );
}

const BANDS: ReadonlyArray<[number, number]> = [
  [-10, 25],
  [25, 40],
  [40, 55],
  [55, 70],
  [70, 90],
  [90, 120],
];
const DB_TICKS = [-10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];

/**
 * Audiogram plots hearing thresholds for each ear from 250 to 8000 Hz with the standard symbols, shades the degree of
 * loss, and lists every value with the pure tone average.
 */
export const Audiogram = forwardRef<HTMLElement, AudiogramProps>(function Audiogram(
  { right, left, speech, title = 'Audiogram', subtitle, rangeContext, className, ...rest },
  ref
) {
  const ears: Array<[Side, string, string, AudiogramEar]> = [
    ['right', 'Right ear', 'var(--co-danger)', right || {}],
    ['left', 'Left ear', 'var(--co-primary)', left || {}],
  ];
  const summary =
    'Audiogram. ' +
    ears
      .map((e) => {
        const a = audioPTA(e[3].ac);
        return e[1] + ' pure tone average ' + (a == null ? 'not available' : a + ' dB HL, ' + audioDegree(a));
      })
      .join('. ') +
    '. Full values in the table below.';
  const rows: SpecRow[] = ears.flatMap((e) => {
    const o = e[3];
    const a = audioPTA(o.ac);
    const air: ReactNode[] = [<b key="h">{e[1] + ' air'}</b>];
    for (const f of FREQS)
      air.push(o.ac && o.ac[f] != null ? <V key={f} k="dbhl" v={o.ac[f]} noUnit noFlag /> : '-');
    air.push(
      <V key="pta" k="dbhl" v={a} noFlag />,
      a == null ? (
        '-'
      ) : (
        <Badge key="deg" tone={a <= 25 ? 'success' : a > 70 ? 'danger' : 'warning'} size="sm">
          {audioDegree(a)}
        </Badge>
      )
    );
    const bone: ReactNode[] = [
      <span key="h" className="co-mi-s">
        {e[1] + ' bone'}
      </span>,
    ];
    for (const f of FREQS) bone.push(o.bc && o.bc[f] != null ? <V key={f} k="dbhl" v={o.bc[f]} noUnit noFlag /> : '');
    bone.push('', '');
    return [air, bone];
  });
  return (
    <RangeContextProvider value={rangeContext}>
      <Card ref={ref} className={cx('co-audiogram', className)} title={title} subtitle={subtitle} {...rest}>
        <figure className="co-sp-fig">
          <svg viewBox={'0 0 ' + W + ' ' + H} className="co-sp-svg co-audio-svg" role="img" aria-label={summary}>
            {BANDS.map((b, i) => (
              <rect
                key={i}
                x={PL}
                y={y(b[0])}
                width={W - PL - PR}
                height={y(b[1]) - y(b[0])}
                fill={i % 2 ? 'var(--co-surface-muted)' : 'var(--co-surface)'}
              />
            ))}
            {BANDS.map((b, i) => (
              <text key={'t' + i} x={W - PR - 4} y={y(b[1]) - 4} textAnchor="end" className="co-axis">
                {DEG[i]![1]}
              </text>
            ))}
            {FREQS.map((f) => (
              <g key={f}>
                <line
                  x1={x(f)}
                  x2={x(f)}
                  y1={PT}
                  y2={H - PB}
                  stroke="var(--co-border)"
                  strokeDasharray={f === 3000 || f === 6000 ? '2 3' : undefined}
                />
                <text x={x(f)} y={14} textAnchor="middle" className="co-axis">
                  {fLabel(f)}
                </text>
              </g>
            ))}
            {DB_TICKS.map((d) => (
              <g key={d}>
                <line x1={PL} x2={W - PR} y1={y(d)} y2={y(d)} stroke="var(--co-border)" strokeWidth={d === 0 ? 1.5 : 0.75} />
                <text x={PL - 6} y={y(d) + 3} textAnchor="end" className="co-axis co-sp-axis-n">
                  {d}
                </text>
              </g>
            ))}
            <text x={4} y={14} className="co-axis">
              dB HL
            </text>
            <text x={W - PR} y={H - 4} textAnchor="end" className="co-axis">
              Hz
            </text>
            {ears.map((e) => {
              const o = e[3];
              return (
                <g key={e[0]}>
                  {line(o, e[2], 'ac')}
                  {FREQS.filter((f) => o.ac && o.ac[f] != null).map((f) =>
                    mark(e[0], f, o.ac![f] as number, e[2], false, (o.nr || []).includes(f))
                  )}
                  {FREQS.filter((f) => o.bc && o.bc[f] != null).map((f) => mark(e[0], f, o.bc![f] as number, e[2], true))}
                </g>
              );
            })}
          </svg>
          <figcaption className="co-sp-legend">
            <span className="co-audio-r">○ Right air</span>
            <span className="co-audio-r">{'< Right bone'}</span>
            <span className="co-audio-l">✕ Left air</span>
            <span className="co-audio-l">{'> Left bone'}</span>
            <span>Arrow = no response at the limit</span>
            <span>Frequency in Hz</span>
          </figcaption>
        </figure>
        <SpecTable
          caption="Audiogram thresholds in dB HL by frequency in Hz; PTA is the average of 500, 1000 and 2000 Hz"
          rowHead
          cols={['Ear', ...FREQS.map(fLabel), 'PTA', 'Degree']}
          num={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
          rows={rows}
        />
        {speech ? <div className="co-help">{'Speech: ' + speech}</div> : null}
        <div className="co-help">
          Values in dB HL. Degree from the 3-frequency pure tone average using the 25 / 40 / 55 / 70 / 90 dB cut-offs. A gap
          of more than 10 dB between air and bone suggests a conductive part.
        </div>
      </Card>
    </RangeContextProvider>
  );
});
